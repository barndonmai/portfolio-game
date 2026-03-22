import Phaser from 'phaser';
import {
  BOOTH_ROTATED_180_TEXTURE_KEY,
  BOOTH_TEXTURE_KEY,
} from '../../config/textureKeys';
import type { FurnitureDefinition } from '../../data/roomTypes';
import { addContainer, addRect } from '../primitives';
import { addFurnitureSprite } from './shared';

const ROTATED_BOOTH_IDS = new Set([
  'nook-booth-lower-curve',
  'nook-booth-bottom-lower-curve',
  'booth-island-a-bottom',
  'booth-island-b-bottom',
  'booth-island-c-bottom',
  'tv-bench',
]);

export function drawBoothPiece(
  scene: Phaser.Scene,
  piece: FurnitureDefinition,
) {
  const useBoothSprite =
    scene.textures.exists(BOOTH_TEXTURE_KEY) &&
    ((piece.id.includes('booth') && !piece.id.includes('table')) ||
      piece.id.includes('bench') ||
      piece.id.startsWith('nook-booth-'));

  if (useBoothSprite) {
    const vertical = piece.height > piece.width;
    const isNookBooth = piece.id.startsWith('nook-booth-');
    const textureKey = ROTATED_BOOTH_IDS.has(piece.id)
      ? BOOTH_ROTATED_180_TEXTURE_KEY
      : BOOTH_TEXTURE_KEY;

    addFurnitureSprite(scene, textureKey, piece, {
      angle: vertical ? 90 : 0,
      yOffset: vertical ? -2 : isNookBooth ? -2 : -4,
      widthPadding: vertical ? (isNookBooth ? 6 : 18) : isNookBooth ? 8 : 20,
      heightPadding: vertical ? (isNookBooth ? 8 : 18) : isNookBooth ? 6 : 10,
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
    addRect(
      scene,
      0,
      -piece.height * 0.14,
      piece.width - 10,
      piece.height * 0.28,
      0x8b2f2b,
    ),
    addRect(
      scene,
      0,
      piece.height * 0.08,
      piece.width - 12,
      piece.height * 0.16,
      0x9b4439,
      0.9,
    ),
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
      continue;
    }

    const seamX =
      -piece.width / 2 + 24 + index * ((piece.width - 48) / seamCount);
    children.push(addRect(scene, seamX, 0, 4, piece.height - 18, 0x9b4a3c, 0.9));
  }

  addContainer(scene, piece.x, piece.y, children);
}
