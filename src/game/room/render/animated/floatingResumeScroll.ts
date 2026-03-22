import Phaser from 'phaser';
import { FLOATING_ITEM_DEPTH } from '../../config/depth';
import { addContainer, addEllipse, addRect } from '../primitives';
import type { FloatingResumeScrollParts } from './types';

const LABEL_DEPTH = 11.4;

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

export function addAnimatedResumeScrollProp(
  scene: Phaser.Scene,
  x: number,
  y: number,
  labelText = 'Resume',
) {
  const { glow, scroll, shadow, sparkle } = createFloatingResumeScroll(
    scene,
    x,
    y,
  );

  scene.add
    .text(x, y + 16, labelText, {
      color: '#f2e4c8',
      fontFamily: 'monospace',
      fontSize: '11px',
    })
    .setDepth(LABEL_DEPTH)
    .setOrigin(0.5);

  scene.tweens.add({
    targets: scroll,
    y: y - 12,
    duration: 1700,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: glow,
    alpha: 0.2,
    scaleX: 1.12,
    scaleY: 1.08,
    duration: 1500,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: shadow,
    alpha: 0.08,
    scaleX: 0.82,
    duration: 1700,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: sparkle,
    alpha: 0.3,
    y: y - 30,
    duration: 900,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });
}
