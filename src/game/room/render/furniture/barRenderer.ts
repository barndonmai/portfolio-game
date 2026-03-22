import Phaser from 'phaser';
import {
  BACK_BAR_TEXTURE_KEY,
  BAR_COUNTER_TEXTURE_KEY,
} from '../../config/textureKeys';
import { DECOR_DEPTH } from '../../config/depth';
import type { FurnitureDefinition } from '../../data/roomTypes';
import { addContainer, addRect } from '../primitives';
import { addFurnitureSprite } from './shared';

export function drawBarCounter(
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

export function drawBackBar(scene: Phaser.Scene, piece: FurnitureDefinition) {
  if (scene.textures.exists(BACK_BAR_TEXTURE_KEY)) {
    const horizontal = piece.width > piece.height;
    addFurnitureSprite(scene, BACK_BAR_TEXTURE_KEY, piece, {
      angle: horizontal ? 90 : 0,
      depth: DECOR_DEPTH,
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
