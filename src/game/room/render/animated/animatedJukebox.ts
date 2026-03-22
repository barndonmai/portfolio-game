import Phaser from 'phaser';
import { FLOATING_ITEM_DEPTH } from '../../config/depth';
import { addContainer, addEllipse, addRect } from '../primitives';
import type { AnimatedJukeboxParts } from './types';

const LABEL_DEPTH = 11.4;

export function createAnimatedJukebox(
  scene: Phaser.Scene,
  x: number,
  y: number,
): AnimatedJukeboxParts {
  const glow = addEllipse(scene, x, y - 6, 88, 40, 0xf0c27b, 0.12).setDepth(
    FLOATING_ITEM_DEPTH - 1,
  );
  const marquee = addContainer(
    scene,
    x,
    y - 18,
    [
      addRect(scene, 0, 0, 40, 12, 0xf4d983, 0.92),
      addRect(scene, -12, 0, 6, 12, 0x8be0d8, 0.95),
      addRect(scene, 0, 0, 6, 12, 0xf06b6b, 0.95),
      addRect(scene, 12, 0, 6, 12, 0x8be0d8, 0.95),
      addRect(scene, 0, -8, 30, 4, 0xfff5d6, 0.9),
    ],
    FLOATING_ITEM_DEPTH,
  );
  const noteLeft = addContainer(
    scene,
    x - 26,
    y - 12,
    [
      addRect(scene, 0, -4, 4, 14, 0x8be0d8, 0.9),
      addRect(scene, 5, -8, 4, 12, 0x8be0d8, 0.9),
      addRect(scene, 3, -10, 12, 3, 0x8be0d8, 0.9),
      addRect(scene, -4, 7, 8, 6, 0xf4d983, 0.95),
      addRect(scene, 6, 3, 8, 6, 0xf4d983, 0.95),
    ],
    FLOATING_ITEM_DEPTH + 0.1,
  );
  noteLeft.setAlpha(0);
  const noteRight = addContainer(
    scene,
    x + 26,
    y - 8,
    [
      addRect(scene, 0, -4, 4, 14, 0xf06b6b, 0.9),
      addRect(scene, 5, -8, 4, 12, 0xf06b6b, 0.9),
      addRect(scene, 3, -10, 12, 3, 0xf06b6b, 0.9),
      addRect(scene, -4, 7, 8, 6, 0xf4d983, 0.95),
      addRect(scene, 6, 3, 8, 6, 0xf4d983, 0.95),
    ],
    FLOATING_ITEM_DEPTH + 0.1,
  );
  noteRight.setAlpha(0);
  const sparkle = addRect(scene, x + 18, y - 28, 4, 4, 0xfff5d6, 0.9)
    .setDepth(FLOATING_ITEM_DEPTH + 0.15)
    .setAlpha(0.7);

  return { glow, marquee, noteLeft, noteRight, sparkle };
}

export function addAnimatedJukeboxProp(
  scene: Phaser.Scene,
  x: number,
  y: number,
  labelText = 'Jukebox',
) {
  const { glow, marquee, noteLeft, noteRight, sparkle } = createAnimatedJukebox(
    scene,
    x,
    y,
  );

  scene.add
    .text(x, y + 58, labelText, {
      color: '#f2e4c8',
      fontFamily: 'monospace',
      fontSize: '11px',
    })
    .setDepth(LABEL_DEPTH)
    .setOrigin(0.5);

  scene.tweens.add({
    targets: glow,
    alpha: 0.24,
    scaleX: 1.16,
    scaleY: 1.08,
    duration: 900,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: marquee,
    y: y - 22,
    duration: 1000,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });

  scene.tweens.add({
    targets: [noteLeft, noteRight],
    alpha: 0.95,
    scaleX: 1.18,
    scaleY: 1.18,
    duration: 320,
    ease: 'Sine.Out',
    yoyo: true,
    repeat: -1,
    repeatDelay: 1200,
  });

  scene.tweens.add({
    targets: noteLeft,
    x: x - 40,
    y: y - 32,
    duration: 900,
    ease: 'Sine.Out',
    yoyo: true,
    repeat: -1,
    repeatDelay: 620,
  });

  scene.tweens.add({
    targets: noteRight,
    x: x + 42,
    y: y - 28,
    duration: 980,
    ease: 'Sine.Out',
    yoyo: true,
    repeat: -1,
    repeatDelay: 620,
  });

  scene.tweens.add({
    targets: sparkle,
    alpha: 0.2,
    scaleX: 1.8,
    scaleY: 1.8,
    duration: 540,
    ease: 'Sine.InOut',
    yoyo: true,
    repeat: -1,
  });
}
