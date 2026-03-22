import Phaser from 'phaser';
import { FLOATING_ITEM_DEPTH } from '../../config/depth';
import { addContainer, addEllipse, addRect } from '../primitives';
import type { FloatingResumeScrollParts } from './types';

export function createFloatingResumeScroll(
  scene: Phaser.Scene,
  x: number,
  y: number,
): FloatingResumeScrollParts {
  const shadow = addEllipse(scene, x, y + 8, 56, 16, 0x000000, 0.14).setDepth(
    FLOATING_ITEM_DEPTH - 2,
  );
  const glow = addEllipse(scene, x, y - 10, 62, 24, 0xe8d28d, 0.12).setDepth(
    FLOATING_ITEM_DEPTH - 1,
  );
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
  const sparkle = addRect(scene, x + 20, y - 22, 4, 4, 0x8be0d8).setDepth(
    FLOATING_ITEM_DEPTH + 0.1,
  );

  return { glow, scroll, shadow, sparkle };
}
