import Phaser from 'phaser';
import type { FurnitureDefinition } from '../../data/roomTypes';
import { FURNITURE_DEPTH } from '../../config/depth';
import { addEllipse } from '../primitives';

interface FurnitureSpriteOptions {
  angle?: number;
  depth?: number;
  flipX?: boolean;
  flipY?: boolean;
  shadowAlpha?: number;
  shadowScaleX?: number;
  shadowScaleY?: number;
  yOffset?: number;
  widthPadding?: number;
  heightPadding?: number;
}

export function addFurnitureSprite(
  scene: Phaser.Scene,
  textureKey: string,
  piece: FurnitureDefinition,
  options?: FurnitureSpriteOptions,
) {
  const angle = options?.angle ?? 0;
  const yOffset = options?.yOffset ?? 0;
  const depth = options?.depth ?? FURNITURE_DEPTH;
  const flipX = options?.flipX ?? false;
  const flipY = options?.flipY ?? false;
  const widthPadding = options?.widthPadding ?? 0;
  const heightPadding = options?.heightPadding ?? 0;
  const isRotated = Math.abs(angle) % 180 === 90;
  const displayWidth = (isRotated ? piece.height : piece.width) + widthPadding;
  const displayHeight =
    (isRotated ? piece.width : piece.height) + heightPadding;

  addEllipse(
    scene,
    piece.x,
    piece.y + piece.height * 0.42,
    piece.width * (options?.shadowScaleX ?? 0.9),
    piece.height * (options?.shadowScaleY ?? 0.34),
    0x000000,
    options?.shadowAlpha ?? 0.14,
  ).setDepth(depth - 0.1);

  return scene.add
    .image(piece.x, piece.y + yOffset, textureKey)
    .setDisplaySize(displayWidth, displayHeight)
    .setAngle(angle)
    .setFlip(flipX, flipY)
    .setDepth(depth);
}
