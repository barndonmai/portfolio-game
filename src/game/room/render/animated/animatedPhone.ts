import Phaser from 'phaser';
import { FLOATING_ITEM_DEPTH } from '../../config/depth';
import { addContainer, addRect } from '../primitives';
import type { AnimatedPhoneParts } from './types';

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

  return { handset, ringLeft, ringRight };
}
