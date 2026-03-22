import Phaser from 'phaser';
import type {
  FurnitureDefinition,
  InteractableDefinition,
} from '../roomData';

const BASE_DEPTH = 1;
const FURNITURE_DEPTH = 4;
const DECOR_DEPTH = 6;
const INTERACTABLE_DEPTH = 8;
const FLOATING_ITEM_DEPTH = 11;
const FLOOR_TEXTURE_KEY = 'pub-floor-tiles';
const BACK_BAR_TEXTURE_KEY = 'pub-back-bar';
const BAR_COUNTER_TEXTURE_KEY = 'pub-bar-counter-topdown';
const STOOL_TEXTURE_KEY = 'pub-bar-stool';
const BOOTH_TEXTURE_KEY = 'pub-booth-couch';
const RECT_TABLE_TEXTURE_KEY = 'pub-table-rect';
const ROUND_TABLE_TEXTURE_KEY = 'pub-table-round';

function addRect(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  alpha = 1,
) {
  return scene.add.rectangle(x, y, width, height, color, alpha);
}

function addEllipse(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  alpha = 1,
) {
  return scene.add.ellipse(x, y, width, height, color, alpha);
}

function addContainer(
  scene: Phaser.Scene,
  x: number,
  y: number,
  children: Phaser.GameObjects.GameObject[],
  depth = FURNITURE_DEPTH,
) {
  return scene.add.container(x, y, children).setDepth(depth);
}

function addFurnitureSprite(
  scene: Phaser.Scene,
  textureKey: string,
  piece: FurnitureDefinition,
  options?: {
    angle?: number;
    depth?: number;
    shadowAlpha?: number;
    shadowScaleX?: number;
    shadowScaleY?: number;
    yOffset?: number;
    widthPadding?: number;
    heightPadding?: number;
  },
) {
  const angle = options?.angle ?? 0;
  const yOffset = options?.yOffset ?? 0;
  const depth = options?.depth ?? FURNITURE_DEPTH;
  const widthPadding = options?.widthPadding ?? 0;
  const heightPadding = options?.heightPadding ?? 0;
  const isRotated = Math.abs(angle) % 180 === 90;
  const displayWidth = (isRotated ? piece.height : piece.width) + widthPadding;
  const displayHeight = (isRotated ? piece.width : piece.height) + heightPadding;

  addEllipse(
    scene,
    piece.x,
    piece.y + piece.height * 0.42,
    piece.width * (options?.shadowScaleX ?? 0.9),
    piece.height * (options?.shadowScaleY ?? 0.34),
    0x000000,
    options?.shadowAlpha ?? 0.14,
  ).setDepth(depth - 0.1);

  return scene.add
    .image(piece.x, piece.y + yOffset, textureKey)
    .setDisplaySize(displayWidth, displayHeight)
    .setAngle(angle)
    .setDepth(depth);
}

export interface FloatingCenterpieceParts {
  glow: Phaser.GameObjects.Ellipse;
  root: Phaser.GameObjects.Container;
  shadow: Phaser.GameObjects.Ellipse;
  sparkles: Phaser.GameObjects.Container;
}

export interface AnimatedPhoneParts {
  handset: Phaser.GameObjects.Container;
  ringLeft: Phaser.GameObjects.Container;
  ringRight: Phaser.GameObjects.Container;
}

export interface FloatingResumeScrollParts {
  glow: Phaser.GameObjects.Ellipse;
  scroll: Phaser.GameObjects.Container;
  shadow: Phaser.GameObjects.Ellipse;
  sparkle: Phaser.GameObjects.Rectangle;
}

function drawBottleCluster(
  scene: Phaser.Scene,
  x: number,
  y: number,
  colors: number[],
  scaleX: (value: number) => number,
  scaleY: (value: number) => number,
) {
  const offsets = [-16, -4, 8, 20];
  colors.forEach((color, index) => {
    const offsetX = offsets[index] ?? index * 12;
    addRect(
      scene,
      x + scaleX(offsetX),
      y,
      scaleX(8),
      scaleY(18 + (index % 2) * 4),
      color,
    ).setDepth(DECOR_DEPTH + 0.45);
    addRect(
      scene,
      x + scaleX(offsetX),
      y - scaleY(11),
      scaleX(4),
      scaleY(4),
      0xd9c89a,
    ).setDepth(DECOR_DEPTH + 0.5);
  });
}

export function drawPubShell(
  scene: Phaser.Scene,
  roomWidth: number,
  roomHeight: number,
) {
  const scaleX = roomWidth / 1600;
  const scaleY = roomHeight / 1040;
  const px = (value: number) => Math.round(value * scaleX);
  const py = (value: number) => Math.round(value * scaleY);
  const pw = (value: number) => Math.round(value * scaleX);
  const ph = (value: number) => Math.round(value * scaleY);

  addRect(scene, roomWidth / 2, roomHeight / 2, roomWidth, roomHeight, 0x41281c)
    .setDepth(BASE_DEPTH);

  if (scene.textures.exists(FLOOR_TEXTURE_KEY)) {
    const floorTexture = scene.add
      .renderTexture(0, 0, roomWidth, roomHeight)
      .setOrigin(0)
      .setDepth(BASE_DEPTH + 0.1);
    const baseFloorFrame = 5;

    for (let y = 0; y < roomHeight; y += 16) {
      for (let x = 0; x < roomWidth; x += 16) {
        floorTexture.draw(FLOOR_TEXTURE_KEY, x, y, baseFloorFrame);
      }
    }
  } else {
    const floor = scene.add.graphics().setDepth(BASE_DEPTH + 0.1);
    for (let x = 28; x < roomWidth; x += 30) {
      const color = x % 60 === 0 ? 0x563626 : 0x4d3022;
      floor.fillStyle(color, 1);
      floor.fillRect(x, 0, 22, roomHeight);
      floor.fillStyle(0x6a442d, 0.14);
      floor.fillRect(x + 16, 0, 2, roomHeight);
    }
    for (let y = 28; y < roomHeight; y += 48) {
      floor.fillStyle(0x2b1a14, 0.12);
      floor.fillRect(0, y, roomWidth, 2);
    }
  }

  const floorWear = scene.add.graphics().setDepth(BASE_DEPTH + 0.16);
  floorWear.fillStyle(0x4a2c1f, 0.22);
  floorWear.fillRect(0, 0, roomWidth, roomHeight);

  floorWear.fillStyle(0x6f4730, 0.14);
  floorWear.fillEllipse(900, 820, 980, 360);
  floorWear.fillEllipse(1380, 520, 240, 520);
  floorWear.fillEllipse(286, 266, 260, 180);

  floorWear.fillStyle(0x8a6244, 0.12);
  floorWear.fillEllipse(930, 910, 520, 120);
  floorWear.fillEllipse(1240, 820, 220, 120);
  floorWear.fillEllipse(760, 610, 180, 90);

  floorWear.fillStyle(0x2a1913, 0.08);
  floorWear.fillRect(0, 396, roomWidth, 10);
  floorWear.fillRect(0, 744, roomWidth, 10);

  addRect(scene, roomWidth / 2, py(78), roomWidth, ph(156), 0x35584f).setDepth(BASE_DEPTH + 0.2);
  addRect(scene, roomWidth - px(56), roomHeight / 2, pw(112), roomHeight, 0x35584f).setDepth(BASE_DEPTH + 0.2);
  addRect(scene, roomWidth / 2, py(126), roomWidth, ph(54), 0x274038, 0.92).setDepth(BASE_DEPTH + 0.25);
  addRect(scene, roomWidth - px(56), roomHeight / 2, pw(34), roomHeight, 0x274038, 0.82).setDepth(BASE_DEPTH + 0.25);

  addRect(scene, roomWidth / 2, py(26), pw(712), ph(28), 0x251611).setDepth(BASE_DEPTH + 0.3);
  addRect(scene, px(308), py(26), pw(592), ph(28), 0x251611).setDepth(BASE_DEPTH + 0.3);
  addRect(scene, px(1378), py(26), pw(616), ph(28), 0x251611).setDepth(BASE_DEPTH + 0.3);
  addRect(scene, px(26), roomHeight / 2, pw(28), ph(596), 0x251611).setDepth(BASE_DEPTH + 0.3);
  addRect(scene, roomWidth - px(26), roomHeight / 2, pw(28), roomHeight - ph(24), 0x251611).setDepth(BASE_DEPTH + 0.3);
  addRect(scene, px(314), roomHeight - py(26), pw(612), ph(28), 0x251611).setDepth(BASE_DEPTH + 0.3);
  addRect(scene, px(1438), roomHeight - py(26), pw(408), ph(28), 0x251611).setDepth(BASE_DEPTH + 0.3);

  addRect(scene, px(836), py(66), pw(216), ph(116), 0x161110, 0.62).setDepth(BASE_DEPTH + 0.35);
  addRect(scene, px(836), py(116), pw(148), ph(10), 0xc79a58, 0.52).setDepth(BASE_DEPTH + 0.4);

  addEllipse(scene, px(292), py(226), pw(424), ph(310), 0x000000, 0.14).setDepth(BASE_DEPTH + 0.05);
  addEllipse(scene, px(934), py(756), pw(1060), ph(620), 0x6a1f1f, 0.08).setDepth(BASE_DEPTH + 0.05);
  addEllipse(scene, px(1324), py(926), pw(428), ph(212), 0xd0a15f, 0.08).setDepth(BASE_DEPTH + 0.08);
}

function drawBoothPiece(scene: Phaser.Scene, piece: FurnitureDefinition) {
  const useBoothSprite =
    scene.textures.exists(BOOTH_TEXTURE_KEY) && piece.id.includes('booth-island');

  if (useBoothSprite) {
    const vertical = piece.height > piece.width;
    addFurnitureSprite(scene, BOOTH_TEXTURE_KEY, piece, {
      angle: vertical ? 90 : 0,
      yOffset: vertical ? -2 : -4,
      widthPadding: vertical ? 18 : 20,
      heightPadding: vertical ? 18 : 10,
      shadowScaleX: vertical ? 0.76 : 0.92,
      shadowScaleY: vertical ? 0.24 : 0.28,
      shadowAlpha: 0.16,
    });
    return;
  }

  const children: Phaser.GameObjects.GameObject[] = [];
  const isVertical = piece.height > piece.width;

  children.push(
    addRect(scene, 0, 8, piece.width + 10, piece.height + 10, 0x2b1815, 0.35),
    addRect(scene, 0, 0, piece.width, piece.height, 0x6e2322),
    addRect(scene, 0, -piece.height * 0.14, piece.width - 10, piece.height * 0.28, 0x8b2f2b),
    addRect(scene, 0, piece.height * 0.08, piece.width - 12, piece.height * 0.16, 0x9b4439, 0.9),
    addRect(scene, 0, piece.height * 0.2, piece.width - 8, 10, 0x3e1716),
    addRect(scene, 0, -piece.height * 0.34, piece.width - 18, 10, 0xd7a56a),
  );

  const seamCount = Math.max(
    2,
    Math.floor((isVertical ? piece.height : piece.width) / 64),
  );
  for (let index = 0; index < seamCount; index += 1) {
    if (isVertical) {
      const seamY =
        -piece.height / 2 + 24 + index * ((piece.height - 48) / seamCount);
      children.push(
        addRect(scene, 0, seamY, piece.width - 18, 4, 0x9b4a3c, 0.9),
      );
    } else {
      const seamX =
        -piece.width / 2 + 24 + index * ((piece.width - 48) / seamCount);
      children.push(
        addRect(scene, seamX, 0, 4, piece.height - 18, 0x9b4a3c, 0.9),
      );
    }
  }

  addContainer(scene, piece.x, piece.y, children);
}

function drawRectTable(scene: Phaser.Scene, piece: FurnitureDefinition) {
  if (scene.textures.exists(RECT_TABLE_TEXTURE_KEY)) {
    addFurnitureSprite(scene, RECT_TABLE_TEXTURE_KEY, piece, {
      yOffset: -2,
      widthPadding: 18,
      heightPadding: 20,
      shadowScaleX: 0.72,
      shadowScaleY: 0.2,
      shadowAlpha: 0.12,
    });
    return;
  }

  const children: Phaser.GameObjects.GameObject[] = [
    addEllipse(
      scene,
      0,
      piece.height * 0.44,
      piece.width * 0.72,
      piece.height * 0.3,
      0x000000,
      0.12,
    ),
    addEllipse(scene, 0, -piece.height * 0.02, piece.width, piece.height * 0.62, 0x8f5835),
    addEllipse(scene, 0, -piece.height * 0.08, piece.width * 0.86, piece.height * 0.38, 0xb8744b),
    addRect(scene, 0, -piece.height * 0.22, piece.width * 0.76, 3, 0xe6b37d),
    addRect(scene, -piece.width * 0.18, -piece.height * 0.06, 3, piece.height * 0.34, 0x7d452d),
    addRect(scene, 0, -piece.height * 0.02, 3, piece.height * 0.38, 0x7d452d),
    addRect(scene, piece.width * 0.18, piece.height * 0.02, 3, piece.height * 0.3, 0x7d452d),
    addRect(scene, 0, piece.height * 0.32, 8, piece.height * 0.24, 0x5b371d),
    addRect(scene, -piece.width * 0.16, piece.height * 0.48, 6, piece.height * 0.24, 0x7d452d),
    addRect(scene, piece.width * 0.16, piece.height * 0.48, 6, piece.height * 0.24, 0x7d452d),
    addEllipse(scene, 0, piece.height * 0.56, 24, 8, 0x3d2518),
  ];

  addContainer(scene, piece.x, piece.y, children);
}

function drawRoundTable(scene: Phaser.Scene, piece: FurnitureDefinition) {
  if (scene.textures.exists(ROUND_TABLE_TEXTURE_KEY)) {
    addEllipse(
      scene,
      piece.x,
      piece.y + 24,
      piece.width * 0.7,
      piece.height * 0.24,
      0x000000,
      0.14,
    ).setDepth(FURNITURE_DEPTH - 0.1);

    scene.add
      .image(piece.x, piece.y + 4, ROUND_TABLE_TEXTURE_KEY)
      .setDisplaySize(piece.width + 32, piece.height + 22)
      .setDepth(FURNITURE_DEPTH);
    return;
  }

  const children: Phaser.GameObjects.GameObject[] = [
    addEllipse(scene, 0, 18, piece.width * 0.68, piece.height * 0.22, 0x000000, 0.12),
    addEllipse(scene, 0, -2, piece.width, piece.height * 0.6, 0x8d5736),
    addEllipse(scene, 0, -8, piece.width * 0.88, piece.height * 0.32, 0xb8744b),
    addRect(scene, -piece.width * 0.24, -piece.height * 0.08, 3, piece.height * 0.26, 0x7d452d),
    addRect(scene, 0, -piece.height * 0.02, 3, piece.height * 0.3, 0x7d452d),
    addRect(scene, piece.width * 0.24, piece.height * 0.04, 3, piece.height * 0.2, 0x7d452d),
    addRect(scene, 0, piece.height * 0.22, 8, piece.height * 0.3, 0x5b371d),
    addRect(scene, -piece.width * 0.18, piece.height * 0.44, 6, piece.height * 0.26, 0x7d452d),
    addRect(scene, 0, piece.height * 0.5, 6, piece.height * 0.3, 0x7d452d),
    addRect(scene, piece.width * 0.18, piece.height * 0.44, 6, piece.height * 0.26, 0x7d452d),
    addEllipse(scene, 0, piece.height * 0.58, 22, 8, 0x3d2518),
  ];

  for (const stripeX of [-piece.width * 0.24, 0, piece.width * 0.24]) {
    children.push(
      addRect(scene, stripeX, -piece.height * 0.06, 3, piece.height * 0.28, 0x7d452d),
    );
  }

  children.push(
    addRect(scene, 0, -piece.height * 0.18, piece.width * 0.52, 3, 0xe6b37d),
  );

  addContainer(scene, piece.x, piece.y, children);
}

function drawBarCounter(
  scene: Phaser.Scene,
  piece: FurnitureDefinition,
  horizontal = false,
) {
  if (scene.textures.exists(BAR_COUNTER_TEXTURE_KEY)) {
    addFurnitureSprite(scene, BAR_COUNTER_TEXTURE_KEY, piece, {
      angle: horizontal ? 0 : 90,
      yOffset: horizontal ? -4 : -2,
      widthPadding: horizontal ? 32 : 38,
      heightPadding: horizontal ? 18 : 26,
      shadowScaleX: horizontal ? 0.92 : 0.82,
      shadowScaleY: horizontal ? 0.18 : 0.28,
      shadowAlpha: 0.16,
    });
    return;
  }

  const children: Phaser.GameObjects.GameObject[] = [
    addRect(scene, 0, 8, piece.width + 8, piece.height + 8, 0x000000, 0.18),
    addRect(scene, 0, 0, piece.width, piece.height, 0x5b331c),
    addRect(
      scene,
      0,
      horizontal ? -piece.height * 0.16 : -piece.height * 0.44,
      piece.width,
      16,
      0xd0a15f,
    ),
    addRect(
      scene,
      0,
      horizontal ? piece.height * 0.08 : 0,
      piece.width - 10,
      piece.height - 24,
      0x6c3e22,
    ),
  ];

  if (horizontal) {
    for (let x = -piece.width / 2 + 28; x < piece.width / 2 - 12; x += 38) {
      children.push(addRect(scene, x, 8, 8, piece.height - 28, 0x7e4e2d));
    }
  } else {
    for (let y = -piece.height / 2 + 28; y < piece.height / 2 - 12; y += 52) {
      children.push(addRect(scene, 0, y, piece.width - 16, 8, 0x7d4b29));
      children.push(addRect(scene, -piece.width * 0.26, y + 16, 10, 24, 0xc59a61));
      children.push(addRect(scene, piece.width * 0.12, y + 16, 10, 24, 0xc59a61));
    }
  }

  addContainer(scene, piece.x, piece.y, children);
}

function drawBackBar(scene: Phaser.Scene, piece: FurnitureDefinition) {
  if (scene.textures.exists(BACK_BAR_TEXTURE_KEY)) {
    const horizontal = piece.width > piece.height;
    addFurnitureSprite(scene, BACK_BAR_TEXTURE_KEY, piece, {
      angle: horizontal ? 90 : 0,
      depth: DECOR_DEPTH,
      yOffset: 0,
      widthPadding: horizontal ? 12 : 8,
      heightPadding: horizontal ? 12 : 26,
      shadowScaleX: horizontal ? 0.84 : 0.72,
      shadowScaleY: horizontal ? 0.18 : 0.26,
      shadowAlpha: 0.1,
    });
    return;
  }

  const children: Phaser.GameObjects.GameObject[] = [
    addRect(scene, 0, 0, piece.width, piece.height, 0x342016),
    addRect(scene, 0, -piece.height * 0.34, piece.width - 10, 8, 0x8d6139),
    addRect(scene, 0, 0, piece.width - 10, 8, 0x8d6139),
    addRect(scene, 0, piece.height * 0.34, piece.width - 10, 8, 0x8d6139),
  ];

  for (let y = -piece.height / 2 + 26; y < piece.height / 2 - 18; y += 54) {
    children.push(addRect(scene, -10, y, 10, 18, 0x8bc5b6));
    children.push(addRect(scene, 8, y, 10, 18, 0xc85c4d));
    children.push(addRect(scene, 24, y, 10, 18, 0xd4aa58));
  }

  addContainer(scene, piece.x, piece.y, children, DECOR_DEPTH);
}

function drawStool(scene: Phaser.Scene, piece: FurnitureDefinition) {
  if (scene.textures.exists(STOOL_TEXTURE_KEY)) {
    addEllipse(
      scene,
      piece.x,
      piece.y + 14,
      piece.width * 0.9,
      piece.height * 0.34,
      0x000000,
      0.14,
    ).setDepth(FURNITURE_DEPTH - 0.1);

    scene.add
      .image(piece.x, piece.y, STOOL_TEXTURE_KEY)
      .setDisplaySize(piece.width + 20, piece.height + 18)
      .setDepth(FURNITURE_DEPTH);
    return;
  }

  addContainer(scene, piece.x, piece.y, [
    addEllipse(scene, 0, 6, piece.width + 8, piece.height * 0.5, 0x000000, 0.14),
    addEllipse(scene, 0, 0, piece.width, piece.height, 0x9e693f),
    addEllipse(scene, 0, -4, piece.width * 0.72, piece.height * 0.42, 0xc08953),
    addRect(scene, 0, 16, 6, 22, 0x5b371d),
  ]);
}

function drawColumn(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 0, piece.width, piece.height, 0x5b493e),
    addRect(scene, 0, -piece.height * 0.26, piece.width - 10, 10, 0xbca17d),
    addRect(scene, 0, piece.height * 0.26, piece.width - 10, 10, 0x3b2f28),
    addRect(scene, -piece.width * 0.18, 0, 6, piece.height - 12, 0x8d7c6e),
  ]);
}

function drawJukebox(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 8, piece.width + 10, piece.height + 10, 0x000000, 0.18),
    addRect(scene, 0, 0, piece.width, piece.height, 0x8d4526),
    addRect(scene, 0, -piece.height * 0.18, piece.width - 10, piece.height * 0.34, 0xc7733b),
    addRect(scene, 0, -piece.height * 0.24, piece.width * 0.52, piece.height * 0.16, 0xf2d16d),
    addRect(scene, 0, 10, piece.width * 0.62, piece.height * 0.22, 0x3f2418),
    addRect(scene, 0, piece.height * 0.28, piece.width * 0.74, 12, 0xf0c27b),
  ]);
}

function drawPhone(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 10, piece.width + 8, piece.height + 8, 0x000000, 0.18),
    addRect(scene, 0, 0, piece.width, piece.height, 0x3d4650),
    addRect(scene, 0, -piece.height * 0.22, piece.width - 8, 18, 0x6d7b88),
    addRect(scene, 0, 4, piece.width - 12, 20, 0x1e252d),
    addRect(scene, 0, piece.height * 0.22, 12, 20, 0x9eb2c7),
  ]);
}

function drawResumeStand(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 12, piece.width + 12, piece.height * 0.5, 0x000000, 0.16),
    addRect(scene, 0, 0, piece.width, piece.height * 0.54, 0x6b4a2d),
    addRect(scene, 0, -8, piece.width - 12, piece.height * 0.24, 0xf0e7d0),
    addRect(scene, 0, piece.height * 0.18, 14, piece.height * 0.66, 0x5a3a22),
  ]);
}

function drawBoard(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 8, piece.width + 8, piece.height + 8, 0x000000, 0.16),
    addRect(scene, 0, 0, piece.width, piece.height, 0x4b6038),
    addRect(scene, 0, 0, piece.width - 12, piece.height - 14, 0x70824b),
    addRect(scene, 0, -piece.height * 0.22, piece.width - 18, 12, 0xe9d18b),
    addRect(scene, 0, 6, piece.width - 18, 10, 0xe8b072),
    addRect(scene, 0, piece.height * 0.22, piece.width - 18, 10, 0xc85c4d),
  ]);
}

export function drawFurniture(
  scene: Phaser.Scene,
  furniture: FurnitureDefinition[],
) {
  furniture.forEach((piece) => {
    if (piece.id === 'resume-stand') {
      return;
    }

    if (
      piece.id === 'bar-top-return' ||
      piece.id === 'back-bar' ||
      piece.id === 'back-bar-shelf-top'
    ) {
      return;
    }

    if (piece.id.includes('table')) {
      if (piece.id.includes('round-table')) {
        drawRoundTable(scene, piece);
        return;
      }

      drawRectTable(scene, piece);
      return;
    }

    if (piece.id.includes('booth')) {
      drawBoothPiece(scene, piece);
      return;
    }

    if (piece.id.includes('stool')) {
      drawStool(scene, piece);
      return;
    }

    if (piece.id === 'bar-counter') {
      drawBarCounter(scene, piece, piece.width > piece.height);
      return;
    }

    if (piece.id.includes('column')) {
      drawColumn(scene, piece);
      return;
    }

    if (piece.id.includes('jukebox')) {
      drawJukebox(scene, piece);
      return;
    }

    if (piece.id.includes('phone')) {
      drawPhone(scene, piece);
      return;
    }

    if (piece.id.includes('resume')) {
      drawResumeStand(scene, piece);
      return;
    }

    if (piece.id.includes('board')) {
      drawBoard(scene, piece);
      return;
    }

    addRect(scene, piece.x, piece.y, piece.width, piece.height, piece.color)
      .setStrokeStyle(3, piece.stroke)
      .setDepth(FURNITURE_DEPTH);
  });
}

export function drawDecor(
  scene: Phaser.Scene,
  roomWidth: number,
  roomHeight: number,
) {
  const scaleX = roomWidth / 1600;
  const scaleY = roomHeight / 1040;
  const px = (value: number) => Math.round(value * scaleX);
  const py = (value: number) => Math.round(value * scaleY);
  const pw = (value: number) => Math.round(value * scaleX);
  const ph = (value: number) => Math.round(value * scaleY);

  for (const [x, y] of [
    [132, 88],
    [292, 88],
    [486, 88],
  ] as const) {
    addEllipse(scene, px(x), py(y + 38), pw(120), ph(66), 0xe3b15f, 0.07).setDepth(DECOR_DEPTH - 2);
    addRect(scene, px(x), py(y), pw(14), ph(14), 0xe0b35b).setDepth(DECOR_DEPTH);
    addRect(scene, px(x), py(y + 18), pw(8), ph(24), 0x6d4a28).setDepth(DECOR_DEPTH);
  }

  for (const frame of [
    [544, 62, 86, 54],
    [656, 62, 124, 54],
  ] as const) {
    addRect(scene, px(frame[0]), py(frame[1]), pw(frame[2]), ph(frame[3]), 0x855631).setDepth(DECOR_DEPTH);
    addRect(scene, px(frame[0]), py(frame[1]), pw(frame[2] - 10), ph(frame[3] - 10), 0x283229).setDepth(DECOR_DEPTH + 0.1);
    addRect(scene, px(frame[0]), py(frame[1] - 4), pw(frame[2] - 18), ph(6), 0xd8b074).setDepth(DECOR_DEPTH + 0.2);
  }

  addRect(scene, px(1044), py(88), pw(424), ph(86), 0x23342d, 0.96).setDepth(DECOR_DEPTH - 0.1);
  addRect(scene, px(1044), py(122), pw(452), ph(10), 0x8f6938, 0.92).setDepth(DECOR_DEPTH + 0.15);
  addRect(scene, px(1044), py(58), pw(434), ph(8), 0x5f3e24, 0.96).setDepth(DECOR_DEPTH + 0.1);

  for (const shelfX of [926, 1044, 1162] as const) {
    addRect(scene, px(shelfX), py(82), pw(102), ph(46), 0x342117, 0.96).setDepth(DECOR_DEPTH + 0.2);
    addRect(scene, px(shelfX), py(66), pw(110), ph(6), 0xa47943).setDepth(DECOR_DEPTH + 0.25);
    addRect(scene, px(shelfX), py(98), pw(110), ph(6), 0xa47943).setDepth(DECOR_DEPTH + 0.25);
    addRect(scene, px(shelfX), py(128), pw(110), ph(6), 0xa47943).setDepth(DECOR_DEPTH + 0.25);
  }

  addRect(scene, px(1044), py(86), pw(118), ph(52), 0x8e6a3f).setDepth(DECOR_DEPTH + 0.3);
  addRect(scene, px(1044), py(86), pw(96), ph(36), 0x1c2724).setDepth(DECOR_DEPTH + 0.35);
  addRect(scene, px(1044), py(60), pw(128), ph(8), 0xc9a15f).setDepth(DECOR_DEPTH + 0.3);

  drawBottleCluster(
    scene,
    px(926),
    py(88),
    [0x6f8ab7, 0xc85c4d, 0xd2ab57, 0x8ab69a],
    pw,
    ph,
  );
  drawBottleCluster(
    scene,
    px(926),
    py(118),
    [0x7f9cc3, 0x8ab69a, 0xc85c4d, 0xd2ab57],
    pw,
    ph,
  );
  drawBottleCluster(
    scene,
    px(1162),
    py(88),
    [0x6f8ab7, 0x8ab69a, 0xd2ab57, 0xc85c4d],
    pw,
    ph,
  );
  drawBottleCluster(
    scene,
    px(1162),
    py(118),
    [0xc85c4d, 0xd2ab57, 0x6f8ab7, 0x8ab69a],
    pw,
    ph,
  );

  for (const lampX of [892, 1194] as const) {
    addEllipse(scene, px(lampX), py(122), pw(96), ph(54), 0xe3b15f, 0.08).setDepth(DECOR_DEPTH - 1.5);
    addRect(scene, px(lampX), py(70), pw(10), ph(10), 0xcaa15d).setDepth(DECOR_DEPTH + 0.35);
    addRect(scene, px(lampX), py(98), pw(6), ph(26), 0x6d4a28).setDepth(DECOR_DEPTH + 0.35);
  }

  addRect(scene, px(836), py(86), pw(70), ph(18), 0x1d1413).setDepth(DECOR_DEPTH);
  scene.add.text(px(836), py(86), 'HALL', {
    color: '#d8b074',
    fontFamily: 'monospace',
    fontSize: '12px',
  }).setDepth(DECOR_DEPTH + 0.2).setOrigin(0.5);

  addEllipse(scene, roomWidth / 2, roomHeight - py(68), pw(264), ph(44), 0xd2a05e, 0.08).setDepth(DECOR_DEPTH - 2);
}

export function drawInteractables(
  scene: Phaser.Scene,
  interactables: InteractableDefinition[],
) {
  interactables.forEach((interactable) => {
    const animatedPropIds = new Set([
      'experience-ledger',
      'resume-scroll',
      'contact-phone',
    ]);

    if (animatedPropIds.has(interactable.id)) {
      return;
    }

    addEllipse(
      scene,
      interactable.x,
      interactable.y + interactable.height * 0.42,
      interactable.width + 22,
      12,
      0x000000,
      0.16,
    ).setDepth(INTERACTABLE_DEPTH - 1);

    addRect(
      scene,
      interactable.x,
      interactable.y,
      interactable.width,
      interactable.height,
      interactable.color,
    ).setDepth(INTERACTABLE_DEPTH);

    addRect(
      scene,
      interactable.x,
      interactable.y - interactable.height * 0.18,
      interactable.width - 6,
      6,
      0xf3e1b0,
      0.7,
    ).setDepth(INTERACTABLE_DEPTH + 0.1);

    scene.add.text(
      interactable.x,
      interactable.y + interactable.height / 2 + 14,
      interactable.label,
      {
        color: '#f2e4c8',
        fontFamily: 'monospace',
        fontSize: '10px',
      },
    )
      .setDepth(INTERACTABLE_DEPTH + 0.2)
      .setOrigin(0.5);
  });
}

export function createFloatingCenterpiece(
  scene: Phaser.Scene,
  x: number,
  y: number,
): FloatingCenterpieceParts {
  const shadow = addEllipse(scene, x, y + 26, 72, 22, 0x000000, 0.18)
    .setDepth(FURNITURE_DEPTH - 0.5);

  const glow = addEllipse(scene, x, y + 10, 74, 42, 0xdcb56a, 0.12)
    .setDepth(FLOATING_ITEM_DEPTH - 1);

  const root = addContainer(
    scene,
    x,
    y,
    [
      addRect(scene, 0, 0, 14, 14, 0x2f1d14),
      addRect(scene, 0, -8, 8, 8, 0xdcb56a),
      addRect(scene, 0, 8, 8, 8, 0xdcb56a),
      addRect(scene, -8, 0, 8, 8, 0xdcb56a),
      addRect(scene, 8, 0, 8, 8, 0xdcb56a),
      addRect(scene, 0, 0, 28, 6, 0x72503a),
      addRect(scene, 0, 0, 6, 28, 0x72503a),
      addRect(scene, 0, 0, 18, 18, 0x5c221b),
      addRect(scene, 0, 0, 10, 10, 0x77d2ca),
      addRect(scene, 0, 0, 4, 4, 0xe8f7f4),
    ],
    FLOATING_ITEM_DEPTH,
  );

  const sparkles = addContainer(
    scene,
    x,
    y,
    [
      addRect(scene, -24, -14, 4, 4, 0xf2d58c),
      addRect(scene, 22, -10, 4, 4, 0xf2d58c),
      addRect(scene, -18, 14, 4, 4, 0x8be0d8),
      addRect(scene, 20, 16, 4, 4, 0x8be0d8),
    ],
    FLOATING_ITEM_DEPTH + 0.2,
  );
  sparkles.setAlpha(0.75);

  return {
    glow,
    root,
    shadow,
    sparkles,
  };
}

export function createAnimatedPubPhone(
  scene: Phaser.Scene,
  x: number,
  y: number,
): AnimatedPhoneParts {
  const handset = addContainer(
    scene,
    x,
    y - 14,
    [
      addRect(scene, 0, 0, 18, 6, 0x1f252b),
      addRect(scene, -7, 0, 4, 10, 0x6d7b88),
      addRect(scene, 7, 0, 4, 10, 0x6d7b88),
      addRect(scene, 0, 0, 8, 2, 0x9eb2c7),
    ],
    FLOATING_ITEM_DEPTH,
  );

  const ringLeft = addContainer(
    scene,
    x - 18,
    y - 18,
    [
      addRect(scene, 0, 0, 3, 9, 0xe8d28d),
      addRect(scene, -4, 0, 3, 5, 0xe8d28d),
    ],
    FLOATING_ITEM_DEPTH - 0.2,
  );
  ringLeft.setAlpha(0);

  const ringRight = addContainer(
    scene,
    x + 18,
    y - 18,
    [
      addRect(scene, 0, 0, 3, 9, 0xe8d28d),
      addRect(scene, 4, 0, 3, 5, 0xe8d28d),
    ],
    FLOATING_ITEM_DEPTH - 0.2,
  );
  ringRight.setAlpha(0);

  return {
    handset,
    ringLeft,
    ringRight,
  };
}

export function createFloatingResumeScroll(
  scene: Phaser.Scene,
  x: number,
  y: number,
): FloatingResumeScrollParts {
  const shadow = addEllipse(scene, x, y + 8, 56, 16, 0x000000, 0.14)
    .setDepth(FLOATING_ITEM_DEPTH - 2);
  const glow = addEllipse(scene, x, y - 10, 62, 24, 0xe8d28d, 0.12)
    .setDepth(FLOATING_ITEM_DEPTH - 1);

  const scroll = addContainer(
    scene,
    x,
    y - 12,
    [
      addRect(scene, 0, 0, 30, 20, 0xf3ead2),
      addRect(scene, 0, -6, 22, 4, 0xffffff),
      addRect(scene, -13, 0, 4, 24, 0xc59a61),
      addRect(scene, 13, 0, 4, 24, 0xc59a61),
      addRect(scene, -6, 2, 12, 2, 0xbfa57f),
      addRect(scene, -4, 7, 16, 2, 0xbfa57f),
      addRect(scene, 0, 12, 10, 2, 0xbfa57f),
    ],
    FLOATING_ITEM_DEPTH,
  );

  const sparkle = addRect(scene, x + 20, y - 22, 4, 4, 0x8be0d8)
    .setDepth(FLOATING_ITEM_DEPTH + 0.1);

  return {
    glow,
    scroll,
    shadow,
    sparkle,
  };
}
