import Phaser from 'phaser';
import {
  RECT_TABLE_TEXTURE_KEY,
  ROUND_TABLE_TEXTURE_KEY,
} from '../../config/textureKeys';
import { FURNITURE_DEPTH } from '../../config/depth';
import type { FurnitureDefinition } from '../../data/roomTypes';
import { addContainer, addEllipse, addRect } from '../primitives';
import { addFurnitureSprite } from './shared';

export function drawRectTable(scene: Phaser.Scene, piece: FurnitureDefinition) {
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
    addEllipse(
      scene,
      0,
      -piece.height * 0.08,
      piece.width * 0.86,
      piece.height * 0.38,
      0xb8744b,
    ),
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

export function drawRoundTable(
  scene: Phaser.Scene,
  piece: FurnitureDefinition,
) {
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

  children.push(addRect(scene, 0, -piece.height * 0.18, piece.width * 0.52, 3, 0xe6b37d));

  addContainer(scene, piece.x, piece.y, children);
}
