import Phaser from 'phaser';
import { DECOR_DEPTH, FURNITURE_DEPTH } from '../config/depth';
import { addContainer, addEllipse, addRect } from './primitives';
import { createRoomScale } from './scale';

function createBottleShelf(
  scene: Phaser.Scene,
  x: number,
  y: number,
  depth: number,
) {
  const bottleColors = [0x7794c7, 0xa3cdb7, 0xdfbf64, 0xcd6656];
  const children: Phaser.GameObjects.GameObject[] = [
    addRect(scene, 0, 0, 96, 54, 0x3b281e, 0.96),
    addRect(scene, 0, -18, 112, 4, 0x5f3e23, 0.95),
    addRect(scene, 0, 18, 112, 4, 0x5f3e23, 0.95),
    addRect(scene, -34, 0, 4, 40, 0x7e5b32, 0.95),
    addRect(scene, 34, 0, 4, 40, 0x7e5b32, 0.95),
  ];

  const rowYs = [-6, 16];
  rowYs.forEach((rowY) => {
    bottleColors.forEach((color, index) => {
      const bottleX = -27 + index * 18;
      children.push(addRect(scene, bottleX, rowY, 8, 18, color, 0.95));
      children.push(addRect(scene, bottleX, rowY - 10, 2, 2, 0xf0dfb0, 0.95));
    });
  });

  return addContainer(scene, x, y, children, depth);
}

function createAnimatedTv(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  addRect(scene, x, y, width + 20, height + 18, 0x5f4325).setDepth(
    DECOR_DEPTH,
  );

  const screen = addRect(scene, x, y, width, height, 0x141c1b).setDepth(
    DECOR_DEPTH + 0.1,
  );
  const glow = addRect(scene, x, y, width - 10, height - 10, 0x6ec9ff, 0.08)
    .setDepth(DECOR_DEPTH + 0.12);
  const scanline = addRect(scene, x, y - height / 4, width - 8, 4, 0xffffff, 0.14)
    .setDepth(DECOR_DEPTH + 0.13);
  const mount = addRect(scene, x, y + height / 2 + 15, 18, 14, 0x3a2a1a).setDepth(
    DECOR_DEPTH - 0.05,
  );
  const rainbow = addContainer(
    scene,
    x - width * 0.18,
    y + 6,
    [
      addRect(scene, -22, -10, 34, 3, 0xf06b6b, 0.9),
      addRect(scene, -22, -6, 34, 3, 0xf3a356, 0.9),
      addRect(scene, -22, -2, 34, 3, 0xf4dc7b, 0.9),
      addRect(scene, -22, 2, 34, 3, 0x8fe388, 0.9),
      addRect(scene, -22, 6, 34, 3, 0x7ad2c7, 0.9),
      addRect(scene, -22, 10, 34, 3, 0x7794c7, 0.9),
    ],
    DECOR_DEPTH + 0.13,
  );
  const cat = addContainer(
    scene,
    x - width * 0.02,
    y + 2,
    [
      addRect(scene, -10, -4, 14, 12, 0xc88aa2, 1),
      addRect(scene, -10, -4, 10, 8, 0xf0d8a8, 1),
      addRect(scene, 2, -2, 10, 10, 0xbcc6d2, 1),
      addRect(scene, 8, -8, 3, 3, 0xbcc6d2, 1),
      addRect(scene, 11, -5, 3, 3, 0xbcc6d2, 1),
      addRect(scene, 10, -1, 2, 2, 0x1a1a1a, 1),
      addRect(scene, 6, -1, 2, 2, 0x1a1a1a, 1),
      addRect(scene, 8, 2, 2, 2, 0xf0a3b5, 1),
      addRect(scene, -14, -1, 4, 2, 0xbcc6d2, 1),
      addRect(scene, -12, 8, 3, 3, 0xbcc6d2, 1),
      addRect(scene, -4, 8, 3, 3, 0xbcc6d2, 1),
      addRect(scene, 0, 8, 3, 3, 0xbcc6d2, 1),
      addRect(scene, 7, 8, 3, 3, 0xbcc6d2, 1),
    ],
    DECOR_DEPTH + 0.14,
  );
  const stars = [
    addRect(scene, x - width * 0.24, y - 12, 3, 3, 0xf3d88f, 0.9),
    addRect(scene, x + width * 0.12, y - 8, 3, 3, 0xf3d88f, 0.9),
    addRect(scene, x + width * 0.22, y + 10, 3, 3, 0xf3d88f, 0.9),
  ];
  stars.forEach((star) => star.setDepth(DECOR_DEPTH + 0.14));

  scene.tweens.add({
    targets: scanline,
    y: y + height / 4,
    duration: 1400,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: [rainbow, cat],
    x: x + width * 0.16,
    duration: 2200,
    ease: 'Linear',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: cat,
    y: y - 2,
    duration: 320,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: rainbow,
    alpha: 0.72,
    duration: 260,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: glow,
    alpha: 0.16,
    duration: 900,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: stars,
    alpha: 0.25,
    duration: 480,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
    stagger: 120,
  });

  return { screen, mount };
}

export function drawDecor(
  scene: Phaser.Scene,
  roomWidth: number,
  roomHeight: number,
) {
  const { px, py, pw, ph } = createRoomScale(roomWidth, roomHeight);
  const backBarAccentDepth = FURNITURE_DEPTH - 0.2;

  createBottleShelf(scene, px(560), py(64), backBarAccentDepth + 0.01);
  createBottleShelf(scene, px(1230), py(64), backBarAccentDepth + 0.01);

  createAnimatedTv(scene, px(180), py(118), pw(150), ph(66));

  addEllipse(
    scene,
    roomWidth / 2,
    roomHeight - py(68),
    pw(264),
    ph(44),
    0xd2a05e,
    0.08,
  ).setDepth(DECOR_DEPTH - 2);
}
