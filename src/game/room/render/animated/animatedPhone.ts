import Phaser from 'phaser';
import { FLOATING_ITEM_DEPTH } from '../../config/depth';
import { addContainer, addRect } from '../primitives';
import type { AnimatedPhoneParts } from './types';

const LABEL_DEPTH = 11.4;

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

export function addAnimatedPhoneProp(
  scene: Phaser.Scene,
  x: number,
  y: number,
  labelText = 'Contact',
) {
  const { handset, ringLeft, ringRight } = createAnimatedPubPhone(scene, x, y);

  scene.add
    .text(x, y + 40, labelText, {
      color: '#f2e4c8',
      fontFamily: 'monospace',
      fontSize: '11px',
    })
    .setDepth(LABEL_DEPTH)
    .setOrigin(0.5);

  scene.tweens.add({
    targets: handset,
    angle: -8,
    duration: 130,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
    repeatDelay: 1800,
  });

  scene.tweens.add({
    targets: handset,
    y: y - 24,
    duration: 130,
    ease: 'Quad.Out',
    yoyo: true,
    repeat: -1,
    repeatDelay: 1800,
  });

  scene.tweens.add({
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
