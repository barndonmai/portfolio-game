import Phaser from 'phaser';
import { FLOATING_ITEM_DEPTH, FURNITURE_DEPTH } from '../../config/depth';
import { addContainer, addEllipse, addRect } from '../primitives';
import type { FloatingCenterpieceParts } from './types';

export function createFloatingCenterpiece(
  scene: Phaser.Scene,
  x: number,
  y: number,
): FloatingCenterpieceParts {
  const shadow = addEllipse(scene, x, y + 26, 72, 22, 0x000000, 0.18).setDepth(
    FURNITURE_DEPTH - 0.5,
  );
  const glow = addEllipse(scene, x, y + 10, 74, 42, 0xdcb56a, 0.12).setDepth(
    FLOATING_ITEM_DEPTH - 1,
  );
  const root = addContainer(
    scene,
    x,
    y,
    [
      addRect(scene, 0, 0, 14, 14, 0x2f1d14),
      addRect(scene, 0, -8, 8, 8, 0xdcb56a),
      addRect(scene, 0, 8, 8, 8, 0xdcb56a),
      addRect(scene, -8, 0, 8, 8, 0xdcb56a),
      addRect(scene, 8, 0, 8, 8, 0xdcb56a),
      addRect(scene, 0, 0, 28, 6, 0x72503a),
      addRect(scene, 0, 0, 6, 28, 0x72503a),
      addRect(scene, 0, 0, 18, 18, 0x5c221b),
      addRect(scene, 0, 0, 10, 10, 0x77d2ca),
      addRect(scene, 0, 0, 4, 4, 0xe8f7f4),
    ],
    FLOATING_ITEM_DEPTH,
  );
  const sparkles = addContainer(
    scene,
    x,
    y,
    [
      addRect(scene, -24, -14, 4, 4, 0xf2d58c),
      addRect(scene, 22, -10, 4, 4, 0xf2d58c),
      addRect(scene, -18, 14, 4, 4, 0x8be0d8),
      addRect(scene, 20, 16, 4, 4, 0x8be0d8),
    ],
    FLOATING_ITEM_DEPTH + 0.2,
  );
  sparkles.setAlpha(0.75);

  return { glow, root, shadow, sparkles };
}
