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

export function drawDecor(
  scene: Phaser.Scene,
  roomWidth: number,
  roomHeight: number,
) {
  const { px, py, pw, ph } = createRoomScale(roomWidth, roomHeight);
  const backBarAccentDepth = FURNITURE_DEPTH - 0.2;

  createBottleShelf(scene, px(560), py(64), backBarAccentDepth + 0.01);
  createBottleShelf(scene, px(1230), py(64), backBarAccentDepth + 0.01);

  addRect(scene, px(180), py(118), pw(170), ph(60), 0x5f4325).setDepth(
    DECOR_DEPTH,
  );
  addRect(scene, px(180), py(118), pw(150), ph(44), 0x141c1b).setDepth(
    DECOR_DEPTH + 0.1,
  );
  addRect(scene, px(180), py(152), pw(18), ph(12), 0x3a2a1a).setDepth(
    DECOR_DEPTH - 0.05,
  );

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
