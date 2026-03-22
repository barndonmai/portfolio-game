import Phaser from 'phaser';
import { FURNITURE_DEPTH } from '../../config/depth';
import { STOOL_TEXTURE_KEY } from '../../config/textureKeys';
import type { FurnitureDefinition } from '../../data/roomTypes';
import { addContainer, addEllipse, addRect } from '../primitives';

export function drawStool(scene: Phaser.Scene, piece: FurnitureDefinition) {
  if (scene.textures.exists(STOOL_TEXTURE_KEY)) {
    addEllipse(
      scene,
      piece.x,
      piece.y + 14,
      piece.width * 0.9,
      piece.height * 0.34,
      0x000000,
      0.14,
    ).setDepth(FURNITURE_DEPTH - 0.1);

    scene.add
      .image(piece.x, piece.y, STOOL_TEXTURE_KEY)
      .setDisplaySize(piece.width + 20, piece.height + 18)
      .setDepth(FURNITURE_DEPTH);
    return;
  }

  addContainer(scene, piece.x, piece.y, [
    addEllipse(scene, 0, 6, piece.width + 8, piece.height * 0.5, 0x000000, 0.14),
    addEllipse(scene, 0, 0, piece.width, piece.height, 0x9e693f),
    addEllipse(scene, 0, -4, piece.width * 0.72, piece.height * 0.42, 0xc08953),
    addRect(scene, 0, 16, 6, 22, 0x5b371d),
  ]);
}
