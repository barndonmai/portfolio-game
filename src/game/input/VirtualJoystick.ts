import Phaser from 'phaser';

const DEFAULT_RADIUS = 34;
const DEFAULT_MARGIN_LEFT = 92;
const DEFAULT_MARGIN_BOTTOM = 92;
const BASE_SIZE = 92;
const INNER_BASE_SIZE = 62;
const THUMB_SIZE = 30;
const THUMB_INNER_SIZE = 16;
const JOYSTICK_DEPTH = 60;
const ACTIVATION_PADDING = 18;

interface VirtualJoystickOptions {
  radius?: number;
  marginLeft?: number;
  marginBottom?: number;
}

export class VirtualJoystick {
  private readonly scene: Phaser.Scene;
  private readonly radius: number;
  private readonly marginLeft: number;
  private readonly marginBottom: number;
  private readonly vector = new Phaser.Math.Vector2();
  private readonly center = new Phaser.Math.Vector2();
  private readonly root: Phaser.GameObjects.Container;
  private readonly thumb: Phaser.GameObjects.Container;
  private readonly hitZone: Phaser.GameObjects.Zone;
  private activePointerId: number | null = null;

  constructor(scene: Phaser.Scene, options: VirtualJoystickOptions = {}) {
    this.scene = scene;
    this.radius = options.radius ?? DEFAULT_RADIUS;
    this.marginLeft = options.marginLeft ?? DEFAULT_MARGIN_LEFT;
    this.marginBottom = options.marginBottom ?? DEFAULT_MARGIN_BOTTOM;

    const baseShadow = scene.add
      .rectangle(4, 4, BASE_SIZE, BASE_SIZE, 0x1b100d, 0.28)
      .setStrokeStyle(0);
    const baseOuter = scene.add
      .rectangle(0, 0, BASE_SIZE, BASE_SIZE, 0x2a1914, 0.44)
      .setStrokeStyle(4, 0xd39c63, 0.55);
    const baseInner = scene.add
      .rectangle(0, 0, INNER_BASE_SIZE, INNER_BASE_SIZE, 0x6b3a1d, 0.52)
      .setStrokeStyle(2, 0xf0c27b, 0.45);
    const horizontalGuide = scene.add
      .rectangle(0, 0, INNER_BASE_SIZE - 14, 4, 0xf2e4c8, 0.18)
      .setStrokeStyle(0);
    const verticalGuide = scene.add
      .rectangle(0, 0, 4, INNER_BASE_SIZE - 14, 0xf2e4c8, 0.18)
      .setStrokeStyle(0);

    const thumbShadow = scene.add
      .rectangle(3, 3, THUMB_SIZE, THUMB_SIZE, 0x1b100d, 0.32)
      .setStrokeStyle(0);
    const thumbOuter = scene.add
      .rectangle(0, 0, THUMB_SIZE, THUMB_SIZE, 0xf2e4c8, 0.82)
      .setStrokeStyle(3, 0x4b2d1f, 0.9);
    const thumbInner = scene.add
      .rectangle(0, 0, THUMB_INNER_SIZE, THUMB_INNER_SIZE, 0xd8b074, 0.95)
      .setStrokeStyle(0);

    this.thumb = scene.add.container(0, 0, [
      thumbShadow,
      thumbOuter,
      thumbInner,
    ]);

    this.root = scene.add.container(0, 0, [
      baseShadow,
      baseOuter,
      baseInner,
      horizontalGuide,
      verticalGuide,
      this.thumb,
    ]);
    this.root.setDepth(JOYSTICK_DEPTH);
    this.root.setScrollFactor(0);
    this.root.setAlpha(0.92);

    this.hitZone = scene.add.zone(
      0,
      0,
      BASE_SIZE + ACTIVATION_PADDING * 2,
      BASE_SIZE + ACTIVATION_PADDING * 2,
    );
    this.hitZone.setOrigin(0.5);
    this.hitZone.setScrollFactor(0);
    this.hitZone.setDepth(JOYSTICK_DEPTH);
    this.hitZone.setInteractive();

    this.layout(scene.scale.width, scene.scale.height);

    scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
    scene.input.on(Phaser.Input.Events.GAME_OUT, this.handlePointerCancel, this);
    scene.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
  }

  static shouldEnable(scene?: Phaser.Scene) {
    if (typeof window === 'undefined') {
      return false;
    }

    const hasTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    const coarsePointer =
      window.matchMedia?.('(pointer: coarse)').matches ??
      false;
    const anyCoarsePointer =
      window.matchMedia?.('(any-pointer: coarse)').matches ??
      false;
    const noHover =
      window.matchMedia?.('(hover: none)').matches ??
      false;
    const phaserTouch =
      scene?.sys.game.device.input.touch ?? false;

    return hasTouch || coarsePointer || anyCoarsePointer || noHover || phaserTouch;
  }

  getVector() {
    return this.vector;
  }

  reset() {
    this.activePointerId = null;
    this.vector.set(0, 0);
    this.thumb.setPosition(0, 0);
  }

  destroy() {
    this.reset();
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
    this.scene.input.off(Phaser.Input.Events.GAME_OUT, this.handlePointerCancel, this);
    this.scene.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.hitZone.destroy();
    this.root.destroy(true);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.layout(gameSize.width, gameSize.height);
  }

  private layout(width: number, height: number) {
    this.center.set(this.marginLeft, height - this.marginBottom);
    this.root.setPosition(this.center.x, this.center.y);
    this.hitZone.setPosition(this.center.x, this.center.y);
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (this.activePointerId !== null) {
      return;
    }

    if (!this.isPointerInsideActivation(pointer)) {
      return;
    }

    this.activePointerId = pointer.id;
    this.updateFromPointer(pointer);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.id !== this.activePointerId) {
      return;
    }

    this.updateFromPointer(pointer);
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer) {
    if (pointer.id !== this.activePointerId) {
      return;
    }

    this.reset();
  }

  private handlePointerCancel() {
    this.reset();
  }

  private updateFromPointer(pointer: Phaser.Input.Pointer) {
    const deltaX = pointer.x - this.center.x;
    const deltaY = pointer.y - this.center.y;
    const distance = Math.hypot(deltaX, deltaY);
    const clampScale =
      distance > this.radius ? this.radius / distance : 1;
    const clampedX = deltaX * clampScale;
    const clampedY = deltaY * clampScale;

    this.thumb.setPosition(clampedX, clampedY);
    this.vector.set(clampedX / this.radius, clampedY / this.radius);

    if (this.vector.lengthSq() > 1) {
      this.vector.normalize();
    }
  }

  private isPointerInsideActivation(pointer: Phaser.Input.Pointer) {
    const activationRadius = this.radius + ACTIVATION_PADDING;
    return (
      Phaser.Math.Distance.Between(
        pointer.x,
        pointer.y,
        this.center.x,
        this.center.y,
      ) <= activationRadius
    );
  }
}
