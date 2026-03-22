import Phaser from 'phaser';
import backBarSprite from '../../assets/props/pub_back_bar.png';
import barCounterTopdownSprite from '../../assets/props/pub_bar_counter_topdown.png';
import barStoolSprite from '../../assets/props/pub_bar_stool.png';
import boothCouchSprite from '../../assets/props/pub_booth_couch.png';
import rectTableSprite from '../../assets/props/pub_table_rect.png';
import roundTableSprite from '../../assets/props/pub_table_round.png';
import floorTilesetSprite from '../../assets/tiles/pub_floor_tileset.png';
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
  createAnimatedPubPhone,
  createFloatingCenterpiece,
  createFloatingResumeScroll,
  drawDecor,
  drawFurniture,
  drawInteractables,
  drawPubShell,
} from '../render/pubVisuals';
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
const FLOATING_CENTERPIECE_X = 690;
const FLOATING_CENTERPIECE_Y = 448;
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
    this.load.spritesheet('pub-floor-tiles', floorTilesetSprite, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image('pub-back-bar', backBarSprite);
    this.load.image('pub-bar-counter-topdown', barCounterTopdownSprite);
    this.load.image('pub-bar-stool', barStoolSprite);
    this.load.image('pub-booth-couch', boothCouchSprite);
    this.load.image('pub-table-rect', rectTableSprite);
    this.load.image('pub-table-round', roundTableSprite);

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
    this.addFloatingCenterpiece();
    this.addAnimatedProps();
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
    drawPubShell(this, ROOM_WIDTH, ROOM_HEIGHT);
  }

  private addFurniture() {
    drawFurniture(this, furniture);
  }

  private addDecor() {
    drawDecor(this, ROOM_WIDTH, ROOM_HEIGHT);
  }

  private addInteractables() {
    drawInteractables(this, interactables);
  }

  private addFloatingCenterpiece() {
    const { glow, root, shadow, sparkles } = createFloatingCenterpiece(
      this,
      FLOATING_CENTERPIECE_X,
      FLOATING_CENTERPIECE_Y,
    );
    const label = this.add
      .text(
        FLOATING_CENTERPIECE_X,
        FLOATING_CENTERPIECE_Y + 34,
        'Experience',
        {
          color: '#f2e4c8',
          fontFamily: 'monospace',
          fontSize: '11px',
        },
      )
      .setDepth(11.4)
      .setOrigin(0.5);

    this.tweens.add({
      targets: root,
      y: FLOATING_CENTERPIECE_Y - 12,
      duration: 1800,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: label,
      y: FLOATING_CENTERPIECE_Y + 22,
      duration: 1800,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: sparkles,
      y: FLOATING_CENTERPIECE_Y - 8,
      alpha: 0.35,
      duration: 1200,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: glow,
      scaleX: 1.18,
      scaleY: 1.12,
      alpha: 0.2,
      duration: 1500,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: shadow,
      scaleX: 0.82,
      scaleY: 0.78,
      alpha: 0.1,
      duration: 1800,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private addAnimatedProps() {
    const phonePiece = furniture.find((piece) => piece.id === 'payphone');
    if (phonePiece) {
      const { handset, ringLeft, ringRight } = createAnimatedPubPhone(
        this,
        phonePiece.x,
        phonePiece.y,
      );
      this.add
        .text(phonePiece.x, phonePiece.y + 40, 'Contact', {
          color: '#f2e4c8',
          fontFamily: 'monospace',
          fontSize: '11px',
        })
        .setDepth(11.4)
        .setOrigin(0.5);

      this.tweens.add({
        targets: handset,
        angle: -8,
        duration: 130,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
        repeatDelay: 1800,
      });

      this.tweens.add({
        targets: handset,
        y: phonePiece.y - 24,
        duration: 130,
        ease: 'Quad.Out',
        yoyo: true,
        repeat: -1,
        repeatDelay: 1800,
      });

      this.tweens.add({
        targets: [ringLeft, ringRight],
        alpha: 0.9,
        scaleX: 1.28,
        scaleY: 1.28,
        duration: 180,
        ease: 'Sine.Out',
        yoyo: true,
        repeat: -1,
        repeatDelay: 1750,
      });
    }

    const resumePiece = furniture.find((piece) => piece.id === 'resume-stand');
    if (resumePiece) {
      const { glow, scroll, shadow, sparkle } = createFloatingResumeScroll(
        this,
        resumePiece.x,
        resumePiece.y - 26,
      );
      this.add
        .text(resumePiece.x, resumePiece.y + 16, 'Resume', {
          color: '#f2e4c8',
          fontFamily: 'monospace',
          fontSize: '11px',
        })
        .setDepth(11.4)
        .setOrigin(0.5);

      this.tweens.add({
        targets: scroll,
        y: resumePiece.y - 38,
        duration: 1700,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: glow,
        alpha: 0.2,
        scaleX: 1.12,
        scaleY: 1.08,
        duration: 1500,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: shadow,
        alpha: 0.08,
        scaleX: 0.82,
        duration: 1700,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: sparkle,
        alpha: 0.3,
        y: resumePiece.y - 56,
        duration: 900,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
      });
    }
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
