import Phaser from 'phaser';
import {
  emitNearbyInteractable,
  emitOpenSection,
  onUiLock,
  type InteractableSummary,
} from '../gameEvents';
import { defaultPlayerCharacter } from '../characters/characterDefinitions';
import { createCharacterAnimations } from '../characters/createCharacterAnimations';
import type { Direction } from '../characters/directions';
import type { CharacterDefinition } from '../characters/types';
import { updateCharacterAnimation } from '../characters/updateCharacterAnimation';
import {
  furniture,
  interactables,
  INTERACTION_RADIUS,
  PLAYER_SPEED,
  PLAYER_SPAWN,
  ROOM_HEIGHT,
  ROOM_WIDTH,
  type InteractableDefinition,
} from '../roomData';

const CAMERA_FOLLOW_LERP = 0.16;
const ANIMATION_WALK_START_SPEED = 56;
const ANIMATION_WALK_STOP_SPEED = 20;
const ANIMATION_DIRECTION_CHANGE_SPEED = 32;
const VISUAL_POSITION_SNAP = 1;
const TOUCH_MOVE_ARRIVAL_RADIUS = 14;

type PlayerHitbox = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

export class PubScene extends Phaser.Scene {
  private player!: PlayerHitbox;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private currentNearby: InteractableSummary | null = null;
  private uiLocked = false;
  private unsubscribeUiLock: (() => void) | null = null;
  private readonly playerCharacter: CharacterDefinition = defaultPlayerCharacter;
  private readonly movementIntent = new Phaser.Math.Vector2();
  private readonly touchMoveTarget = new Phaser.Math.Vector2();
  private activeTouchMovePointerId: number | null = null;
  private playerFacing: Direction = 's';
  private currentAnimationKey: string | null = null;

  constructor() {
    super('PubScene');
  }

  preload() {
    if (this.playerCharacter.sheet.kind === 'grid') {
      this.load.spritesheet(
        this.playerCharacter.sheet.textureKey,
        this.playerCharacter.sheet.assetPath,
        {
          frameWidth: this.playerCharacter.sheet.frameWidth,
          frameHeight: this.playerCharacter.sheet.frameHeight,
          margin: this.playerCharacter.sheet.margin ?? 0,
          spacing: this.playerCharacter.sheet.spacing ?? 0,
        },
      );
      return;
    }

    if (this.playerCharacter.sheet.kind === 'textures') {
      Object.entries(this.playerCharacter.sheet.textures).forEach(
        ([textureKey, assetPath]) => {
          this.load.image(textureKey, assetPath);
        },
      );
      return;
    }

    this.load.image(
      this.playerCharacter.sheet.textureKey,
      this.playerCharacter.sheet.assetPath,
    );
  }

  create() {
    this.physics.world.setBounds(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    createCharacterAnimations(this, this.playerCharacter);
    this.drawRoomShell();
    this.addFurniture();
    this.addDecor();
    this.addInteractables();
    this.createPlayer();
    this.setupInput();
    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      this.handlePointerDownForTouchMove,
      this,
    );
    this.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      this.handlePointerMoveForTouchMove,
      this,
    );
    this.input.on(
      Phaser.Input.Events.POINTER_UP,
      this.handlePointerUpForTouchMove,
      this,
    );
    this.subscribeToUiLock();
    this.setupCamera();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
      this.input.off(
        Phaser.Input.Events.POINTER_DOWN,
        this.handlePointerDownForTouchMove,
        this,
      );
      this.input.off(
        Phaser.Input.Events.POINTER_MOVE,
        this.handlePointerMoveForTouchMove,
        this,
      );
      this.input.off(
        Phaser.Input.Events.POINTER_UP,
        this.handlePointerUpForTouchMove,
        this,
      );
      this.unsubscribeUiLock?.();
      emitNearbyInteractable(null);
    });
  }

  update() {
    if (this.uiLocked) {
      this.movementIntent.set(0, 0);
      this.clearTouchMoveTarget();
      this.player.body.setVelocity(0, 0);
      this.updatePlayerAnimation();
      this.syncPlayerVisuals();
      return;
    }

    this.handleMovement();
    this.updateNearbyInteractable();
    this.updatePlayerAnimation();
    this.syncPlayerVisuals();

    if (
      this.currentNearby &&
      Phaser.Input.Keyboard.JustDown(this.interactKey)
    ) {
      emitOpenSection(this.currentNearby.sectionId);
    }
  }

  private drawRoomShell() {
    this.add
      .rectangle(
        ROOM_WIDTH / 2,
        ROOM_HEIGHT / 2,
        ROOM_WIDTH,
        ROOM_HEIGHT,
        0x4a2f21,
      )
      .setStrokeStyle(18, 0x241712);

    this.add.rectangle(ROOM_WIDTH / 2, 78, ROOM_WIDTH, 156, 0x35584f);
    this.add.rectangle(ROOM_WIDTH - 88, ROOM_HEIGHT / 2, 176, ROOM_HEIGHT, 0x35584f);
    this.add.rectangle(ROOM_WIDTH / 2, 92, ROOM_WIDTH, 52, 0x2b1a14, 0.85);
    this.add.rectangle(ROOM_WIDTH - 88, ROOM_HEIGHT / 2, 54, ROOM_HEIGHT, 0x2b1a14, 0.72);

    const floorLines = this.add.graphics();
    floorLines.lineStyle(2, 0x6a442a, 0.28);
    for (let x = 52; x < ROOM_WIDTH - 40; x += 36) {
      floorLines.lineBetween(x, 40, x, ROOM_HEIGHT - 40);
    }
    for (let y = 52; y < ROOM_HEIGHT - 40; y += 36) {
      floorLines.lineBetween(40, y, ROOM_WIDTH - 40, y);
    }

    this.add
      .rectangle(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 720, 860, 0x6d2324, 0.1)
      .setStrokeStyle(4, 0xc58c5a, 0.35);

    this.add.rectangle(316, 156, 492, 308, 0x231614, 0.18);
    this.add.rectangle(836, 66, 216, 116, 0x1d1413, 0.5);
    this.add.rectangle(836, 118, 144, 12, 0xc58c5a, 0.45);
    this.add.rectangle(ROOM_WIDTH / 2, 26, 712, 28, 0x2a1914);
    this.add.rectangle(308, 26, 592, 28, 0x2a1914);
    this.add.rectangle(1378, 26, 616, 28, 0x2a1914);
    this.add.rectangle(26, ROOM_HEIGHT / 2, 28, 596, 0x2a1914);
    this.add.rectangle(ROOM_WIDTH - 26, ROOM_HEIGHT / 2, 28, ROOM_HEIGHT - 24, 0x2a1914);
    this.add.rectangle(314, ROOM_HEIGHT - 26, 612, 28, 0x2a1914);
    this.add.rectangle(1438, ROOM_HEIGHT - 26, 408, 28, 0x2a1914);
    this.add.rectangle(1048, ROOM_HEIGHT - 26, 220, 14, 0xc58c5a, 0.4);
  }

  private addFurniture() {
    furniture.forEach((piece) => {
      const shape =
        piece.shape === 'ellipse'
          ? this.add.ellipse(
              piece.x,
              piece.y,
              piece.width,
              piece.height,
              piece.color,
            )
          : this.add.rectangle(
              piece.x,
              piece.y,
              piece.width,
              piece.height,
              piece.color,
            );

      shape.setStrokeStyle(3, piece.stroke);
    });
  }

  private addDecor() {
    const decor = this.add.graphics();
    decor.fillStyle(0xe0b35b, 1);
    decor.fillCircle(130, 88, 9);
    decor.fillCircle(292, 88, 9);
    decor.fillCircle(486, 88, 9);
    decor.fillCircle(1040, 88, 9);
    decor.fillCircle(1282, 88, 9);
    decor.fillCircle(1514, 88, 9);

    decor.fillStyle(0x8b5a2b, 1);
    decor.fillRect(544, 62, 86, 54);
    decor.fillRect(656, 62, 124, 54);
    decor.fillRect(1228, 62, 102, 54);
    decor.fillRect(1384, 62, 84, 54);

    decor.lineStyle(3, 0xd8b074, 1);
    decor.strokeRect(544, 62, 86, 54);
    decor.strokeRect(656, 62, 124, 54);
    decor.strokeRect(1228, 62, 102, 54);
    decor.strokeRect(1384, 62, 84, 54);

    decor.fillStyle(0x7a5a24, 1);
    decor.fillRect(92, 910, 88, 18);
    decor.fillRect(1186, 944, 126, 18);
    decor.fillRect(1540, 570, 28, 176);
    decor.fillStyle(0xc8a15f, 0.7);
    decor.fillRect(1540, 620, 28, 10);
    decor.fillRect(1540, 674, 28, 10);
    decor.fillRect(1540, 728, 28, 10);
    decor.fillRect(1540, 782, 28, 10);

    this.add
      .text(136, 906, 'MUSIC', {
        color: '#f2e4c8',
        fontFamily: 'monospace',
        fontSize: '12px',
      })
      .setOrigin(0.5);

    this.add
      .text(1248, 940, 'FRAME', {
        color: '#f2e4c8',
        fontFamily: 'monospace',
        fontSize: '12px',
      })
      .setOrigin(0.5);

    this.add
      .text(836, 86, 'HALL', {
        color: '#d8b074',
        fontFamily: 'monospace',
        fontSize: '12px',
      })
      .setOrigin(0.5);
  }

  private addInteractables() {
    interactables.forEach((interactable) => {
      this.add
        .rectangle(
          interactable.x,
          interactable.y,
          interactable.width,
          interactable.height,
          interactable.color,
        )
        .setStrokeStyle(2, 0x2a1914);

      this.add
        .text(interactable.x, interactable.y + interactable.height / 2 + 14, interactable.label, {
          color: '#f2e4c8',
          fontFamily: 'monospace',
          fontSize: '10px',
        })
        .setOrigin(0.5);
    });
  }

  private createPlayer() {
    const { render, key } = this.playerCharacter;
    const initialIdleFrame =
      this.playerCharacter.animations.directions[this.playerFacing].idleFrame;
    const initialTextureKey = (() => {
      if (initialIdleFrame.kind === 'texture') {
        return initialIdleFrame.textureKey;
      }

      if (this.playerCharacter.sheet.kind === 'textures') {
        throw new Error(
          'Texture-based characters must use texture frame sources for initial sprites.',
        );
      }

      return this.playerCharacter.sheet.textureKey;
    })();
    const initialTextureFrame =
      initialIdleFrame.kind === 'texture'
        ? initialIdleFrame.frame
        : undefined;

    this.playerShadow = this.add.ellipse(
      PLAYER_SPAWN.x,
      PLAYER_SPAWN.y + render.shadowOffsetY,
      render.shadowWidth,
      render.shadowHeight,
      0x000000,
      0.25,
    );

    this.player = this.add.rectangle(
      PLAYER_SPAWN.x,
      PLAYER_SPAWN.y,
      render.hitboxWidth,
      render.hitboxHeight,
      0xf4d08f,
    ) as PlayerHitbox;
    this.player.setAlpha(0);

    this.playerSprite = this.add.sprite(
      PLAYER_SPAWN.x,
      PLAYER_SPAWN.y + render.spriteOffsetY,
      initialTextureKey,
      initialTextureFrame,
    );
    this.playerSprite.setDisplaySize(
      render.displayWidth,
      render.displayHeight,
    );
    this.playerSprite.setOrigin(render.originX, render.originY);
    this.playerSprite.setDepth(10);
    this.playerShadow.setDepth(9);

    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(PLAYER_SPEED, PLAYER_SPEED);

    furniture
      .filter((piece) => piece.collides)
      .forEach((piece) => {
        const collider = this.add.rectangle(
          piece.x,
          piece.y,
          piece.width,
          piece.height,
          0x000000,
          0,
        );
        this.physics.add.existing(collider, true);
        this.physics.add.collider(this.player, collider);
      });

    this.currentAnimationKey = `${key}-idle-${this.playerFacing}`;
    this.playerSprite.play(this.currentAnimationKey);
    this.syncPlayerVisuals();
  }

  private setupInput() {
    const keyboard = this.input.keyboard;

    if (!keyboard) {
      throw new Error('Keyboard input is not available.');
    }

    this.cursors = keyboard.createCursorKeys();
    this.wasd = keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<
      'W' | 'A' | 'S' | 'D',
      Phaser.Input.Keyboard.Key
    >;
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  private handlePointerDownForTouchMove(pointer: Phaser.Input.Pointer) {
    if (this.uiLocked || !this.isTouchLikePointer(pointer)) {
      return;
    }

    this.activeTouchMovePointerId = pointer.id;
    this.updateTouchMoveTarget(pointer);
  }

  private handlePointerMoveForTouchMove(pointer: Phaser.Input.Pointer) {
    if (
      this.uiLocked ||
      pointer.id !== this.activeTouchMovePointerId ||
      !this.isTouchLikePointer(pointer)
    ) {
      return;
    }

    this.updateTouchMoveTarget(pointer);
  }

  private handlePointerUpForTouchMove(pointer: Phaser.Input.Pointer) {
    if (pointer.id !== this.activeTouchMovePointerId) {
      return;
    }

    this.clearTouchMoveTarget();
  }

  private setupCamera() {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    camera.roundPixels = true;
    camera.startFollow(
      this.player,
      true,
      CAMERA_FOLLOW_LERP,
      CAMERA_FOLLOW_LERP,
    );
    this.applyCameraViewport(this.scale.width, this.scale.height);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.applyCameraViewport(gameSize.width, gameSize.height);
  }

  private applyCameraViewport(width: number, height: number) {
    const camera = this.cameras.main;
    camera.setSize(width, height);
    camera.setZoom(this.getCameraZoom(width, height));
  }

  private getCameraZoom(width: number, height: number) {
    const targetVisibleWidth = 1220;
    const targetVisibleHeight = 780;

    return Phaser.Math.Clamp(
      Math.max(width / targetVisibleWidth, height / targetVisibleHeight),
      1.25,
      2.05,
    );
  }

  private subscribeToUiLock() {
    this.unsubscribeUiLock = onUiLock((locked) => {
      this.uiLocked = locked;

      if (locked) {
        this.movementIntent.set(0, 0);
        this.clearTouchMoveTarget();
        this.player.body.setVelocity(0, 0);
      }
    });
  }

  private handleMovement() {
    const keyboardVector = new Phaser.Math.Vector2(
      (this.cursors.left.isDown || this.wasd.A.isDown ? -1 : 0) +
        (this.cursors.right.isDown || this.wasd.D.isDown ? 1 : 0),
      (this.cursors.up.isDown || this.wasd.W.isDown ? -1 : 0) +
        (this.cursors.down.isDown || this.wasd.S.isDown ? 1 : 0),
    );

    if (keyboardVector.lengthSq() > 1) {
      keyboardVector.normalize();
    }

    const horizontal = keyboardVector.x;
    const vertical = keyboardVector.y;

    if (horizontal !== 0 || vertical !== 0) {
      this.clearTouchMoveTarget();
    }

    if (horizontal === 0 && vertical === 0) {
      if (this.activeTouchMovePointerId !== null) {
        const deltaX = this.touchMoveTarget.x - this.player.x;
        const deltaY = this.touchMoveTarget.y - this.player.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance <= TOUCH_MOVE_ARRIVAL_RADIUS) {
          this.clearTouchMoveTarget();
          this.movementIntent.set(0, 0);
          this.player.body.setVelocity(0, 0);
          return;
        }

        this.movementIntent.set(deltaX, deltaY).normalize();
        this.player.body.setVelocity(
          this.movementIntent.x * PLAYER_SPEED,
          this.movementIntent.y * PLAYER_SPEED,
        );
        return;
      }

      this.movementIntent.set(0, 0);
      this.player.body.setVelocity(0, 0);
      return;
    }

    this.movementIntent.set(horizontal, vertical);

    if (this.movementIntent.lengthSq() > 1) {
      this.movementIntent.normalize();
    }

    const targetVelocityX = this.movementIntent.x * PLAYER_SPEED;
    const targetVelocityY = this.movementIntent.y * PLAYER_SPEED;

    if (
      this.player.body.velocity.x !== targetVelocityX ||
      this.player.body.velocity.y !== targetVelocityY
    ) {
      this.player.body.setVelocity(targetVelocityX, targetVelocityY);
    }
  }

  private isTouchLikePointer(pointer: Phaser.Input.Pointer) {
    const event = pointer.event as
      | PointerEvent
      | TouchEvent
      | MouseEvent
      | undefined;
    const pointerType =
      event && 'pointerType' in event ? event.pointerType : undefined;

    return (
      pointer.wasTouch ||
      pointerType === 'touch' ||
      pointerType === 'pen'
    );
  }

  private updateTouchMoveTarget(pointer: Phaser.Input.Pointer) {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

    this.touchMoveTarget.set(
      Phaser.Math.Clamp(worldPoint.x, 0, ROOM_WIDTH),
      Phaser.Math.Clamp(worldPoint.y, 0, ROOM_HEIGHT),
    );
  }

  private clearTouchMoveTarget() {
    this.activeTouchMovePointerId = null;
    this.touchMoveTarget.set(0, 0);
  }

  private updatePlayerAnimation() {
    const nextState = updateCharacterAnimation({
      sprite: this.playerSprite,
      characterKey: this.playerCharacter.key,
      animationConfig: this.playerCharacter.animations,
      velocityX: this.player.body.velocity.x,
      velocityY: this.player.body.velocity.y,
      movementIntentX: this.movementIntent.x,
      movementIntentY: this.movementIntent.y,
      currentFacing: this.playerFacing,
      currentAnimationKey: this.currentAnimationKey,
      walkStartThreshold: ANIMATION_WALK_START_SPEED,
      walkStopThreshold: ANIMATION_WALK_STOP_SPEED,
      directionChangeThreshold: ANIMATION_DIRECTION_CHANGE_SPEED,
    });

    this.playerFacing = nextState.facing;
    this.currentAnimationKey = nextState.animationKey;
  }

  private syncPlayerVisuals() {
    const snappedX = Phaser.Math.Snap.To(this.player.x, VISUAL_POSITION_SNAP);
    const snappedY = Phaser.Math.Snap.To(this.player.y, VISUAL_POSITION_SNAP);

    this.playerShadow.setPosition(
      snappedX,
      snappedY + this.playerCharacter.render.shadowOffsetY,
    );
    this.playerSprite.setPosition(
      snappedX,
      snappedY + this.playerCharacter.render.spriteOffsetY,
    );
  }

  private updateNearbyInteractable() {
    const nearest = interactables.reduce<{
      candidate: InteractableDefinition | null;
      distance: number;
    }>(
      (closest, interactable) => {
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          interactable.x,
          interactable.y,
        );

        if (distance < closest.distance && distance <= INTERACTION_RADIUS) {
          return {
            candidate: interactable,
            distance,
          };
        }

        return closest;
      },
      {
        candidate: null,
        distance: Number.POSITIVE_INFINITY,
      },
    );

    const nextNearby = nearest.candidate
      ? {
          id: nearest.candidate.id,
          label: nearest.candidate.label,
          prompt: nearest.candidate.prompt,
          sectionId: nearest.candidate.sectionId,
        }
      : null;

    if (this.currentNearby?.id !== nextNearby?.id) {
      this.currentNearby = nextNearby;
      emitNearbyInteractable(nextNearby);
    }
  }
}
