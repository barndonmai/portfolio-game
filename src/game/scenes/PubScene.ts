import Phaser from 'phaser';
import {
  emitNearbyInteractable,
  emitOpenSection,
  onUiLock,
  type InteractableSummary,
} from '../gameEvents';
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

type PlayerRectangle = Phaser.GameObjects.Rectangle & {
  body: Phaser.Physics.Arcade.Body;
};

export class PubScene extends Phaser.Scene {
  private player!: PlayerRectangle;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private currentNearby: InteractableSummary | null = null;
  private uiLocked = false;
  private unsubscribeUiLock: (() => void) | null = null;

  constructor() {
    super('PubScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    this.drawRoomShell();
    this.addFurniture();
    this.addDecor();
    this.addInteractables();
    this.createPlayer();
    this.setupInput();
    this.subscribeToUiLock();
    this.setupCamera();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
      this.unsubscribeUiLock?.();
      emitNearbyInteractable(null);
    });
  }

  update() {
    if (this.uiLocked) {
      this.player.body.setVelocity(0, 0);
      this.playerShadow.setPosition(this.player.x, this.player.y + 16);
      return;
    }

    this.handleMovement();
    this.updateNearbyInteractable();
    this.playerShadow.setPosition(this.player.x, this.player.y + 16);

    if (
      this.currentNearby &&
      Phaser.Input.Keyboard.JustDown(this.interactKey)
    ) {
      emitOpenSection(this.currentNearby.sectionId);
    }
  }

  private drawRoomShell() {
    this.add
      .rectangle(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, ROOM_WIDTH, ROOM_HEIGHT, 0x563621)
      .setStrokeStyle(18, 0x2b1a14);

    const floorLines = this.add.graphics();
    floorLines.lineStyle(2, 0x6a442a, 0.4);
    for (let x = 52; x < ROOM_WIDTH - 40; x += 36) {
      floorLines.lineBetween(x, 40, x, ROOM_HEIGHT - 40);
    }
    for (let y = 52; y < ROOM_HEIGHT - 40; y += 36) {
      floorLines.lineBetween(40, y, ROOM_WIDTH - 40, y);
    }

    this.add
      .rectangle(ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 620, 860, 0x6a1f1f, 0.22)
      .setStrokeStyle(4, 0xc58c5a, 0.5);

    this.add.rectangle(ROOM_WIDTH / 2, 26, ROOM_WIDTH - 24, 28, 0x2a1914);
    this.add.rectangle(ROOM_WIDTH / 2, ROOM_HEIGHT - 26, ROOM_WIDTH - 24, 28, 0x2a1914);
    this.add.rectangle(26, ROOM_HEIGHT / 2, 28, ROOM_HEIGHT - 24, 0x2a1914);
    this.add.rectangle(ROOM_WIDTH - 26, ROOM_HEIGHT / 2, 28, ROOM_HEIGHT - 24, 0x2a1914);
  }

  private addFurniture() {
    furniture.forEach((piece) => {
      this.add
        .rectangle(piece.x, piece.y, piece.width, piece.height, piece.color)
        .setStrokeStyle(3, piece.stroke);
    });
  }

  private addDecor() {
    const decor = this.add.graphics();
    decor.fillStyle(0xe0b35b, 1);
    decor.fillCircle(136, 84, 9);
    decor.fillCircle(286, 84, 9);
    decor.fillCircle(1120, 84, 9);
    decor.fillCircle(1320, 84, 9);
    decor.fillCircle(1520, 84, 9);

    decor.fillStyle(0x8b5a2b, 1);
    decor.fillRect(520, 62, 84, 52);
    decor.fillRect(648, 62, 112, 52);
    decor.fillRect(796, 62, 84, 52);

    decor.lineStyle(3, 0xd8b074, 1);
    decor.strokeRect(520, 62, 84, 52);
    decor.strokeRect(648, 62, 112, 52);
    decor.strokeRect(796, 62, 84, 52);

    decor.fillStyle(0x7a5a24, 1);
    decor.fillRect(84, 972, 96, 18);
    decor.fillRect(1380, 972, 136, 18);

    this.add
      .text(130, 968, 'JUKE', {
        color: '#f2e4c8',
        fontFamily: 'monospace',
        fontSize: '14px',
      })
      .setOrigin(0.5);

    this.add
      .text(1448, 968, 'RESUME', {
        color: '#f2e4c8',
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
    this.playerShadow = this.add.ellipse(
      PLAYER_SPAWN.x,
      PLAYER_SPAWN.y + 16,
      18,
      10,
      0x000000,
      0.25,
    );

    this.player = this.add.rectangle(
      PLAYER_SPAWN.x,
      PLAYER_SPAWN.y,
      22,
      28,
      0xf4d08f,
    ) as PlayerRectangle;
    this.player.setStrokeStyle(2, 0x4d3428);
    this.player.setDepth(10);
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
  }

  private setupInput() {
    const keyboard = this.input.keyboard;

    if (!keyboard) {
      throw new Error('Keyboard input is not available.');
    }

    this.cursors = keyboard.createCursorKeys();
    this.wasd = keyboard.addKeys('W,A,S,D') as Record<
      'W' | 'A' | 'S' | 'D',
      Phaser.Input.Keyboard.Key
    >;
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  private setupCamera() {
    const camera = this.cameras.main;
    camera.setBounds(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    camera.roundPixels = true;
    camera.startFollow(this.player, true, 0.1, 0.1);
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
    const targetVisibleWidth = 1100;
    const targetVisibleHeight = 700;

    return Phaser.Math.Clamp(
      Math.max(width / targetVisibleWidth, height / targetVisibleHeight),
      1.35,
      2.2,
    );
  }

  private subscribeToUiLock() {
    this.unsubscribeUiLock = onUiLock((locked) => {
      this.uiLocked = locked;

      if (locked) {
        this.player.body.setVelocity(0, 0);
      }
    });
  }

  private handleMovement() {
    const horizontal =
      (this.cursors.left.isDown || this.wasd.A.isDown ? -1 : 0) +
      (this.cursors.right.isDown || this.wasd.D.isDown ? 1 : 0);
    const vertical =
      (this.cursors.up.isDown || this.wasd.W.isDown ? -1 : 0) +
      (this.cursors.down.isDown || this.wasd.S.isDown ? 1 : 0);

    const movement = new Phaser.Math.Vector2(horizontal, vertical).normalize();
    this.player.body.setVelocity(
      movement.x * PLAYER_SPEED,
      movement.y * PLAYER_SPEED,
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
