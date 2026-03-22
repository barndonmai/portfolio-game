import Phaser from 'phaser';
import { FURNITURE_DEPTH } from '../config/depth';

export function addRect(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  alpha = 1,
) {
  return scene.add.rectangle(x, y, width, height, color, alpha);
}

export function addEllipse(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number,
  alpha = 1,
) {
  return scene.add.ellipse(x, y, width, height, color, alpha);
}

export function addContainer(
  scene: Phaser.Scene,
  x: number,
  y: number,
  children: Phaser.GameObjects.GameObject[],
  depth = FURNITURE_DEPTH,
) {
  return scene.add.container(x, y, children).setDepth(depth);
}
