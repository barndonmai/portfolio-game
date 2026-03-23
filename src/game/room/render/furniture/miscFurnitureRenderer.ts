import Phaser from 'phaser';
import { JUKEBOX_TEXTURE_KEY } from '../../config/textureKeys';
import type { FurnitureDefinition } from '../../data/roomTypes';
import { addContainer, addRect } from '../primitives';
import { addFurnitureSprite } from './shared';

export function drawColumn(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 0, piece.width, piece.height, 0x5b493e),
    addRect(scene, 0, -piece.height * 0.26, piece.width - 10, 10, 0xbca17d),
    addRect(scene, 0, piece.height * 0.26, piece.width - 10, 10, 0x3b2f28),
    addRect(scene, -piece.width * 0.18, 0, 6, piece.height - 12, 0x8d7c6e),
  ]);
}

export function drawJukebox(scene: Phaser.Scene, piece: FurnitureDefinition) {
  if (!scene.textures.exists(JUKEBOX_TEXTURE_KEY)) {
    return;
  }

  addFurnitureSprite(scene, JUKEBOX_TEXTURE_KEY, piece, {
    yOffset: 14,
    widthPadding: 28,
    heightPadding: 42,
    shadowScaleX: 0.76,
    shadowScaleY: 0.22,
    shadowAlpha: 0.16,
  });
}

export function drawPhone(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 10, piece.width + 8, piece.height + 8, 0x000000, 0.18),
    addRect(scene, 0, 0, piece.width, piece.height, 0x3d4650),
    addRect(scene, 0, -piece.height * 0.22, piece.width - 8, 18, 0x6d7b88),
    addRect(scene, 0, 4, piece.width - 12, 20, 0x1e252d),
    addRect(scene, 0, piece.height * 0.22, 12, 20, 0x9eb2c7),
  ]);
}

export function drawResumeStand(
  scene: Phaser.Scene,
  piece: FurnitureDefinition,
) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 12, piece.width + 12, piece.height * 0.5, 0x000000, 0.16),
    addRect(scene, 0, 0, piece.width, piece.height * 0.54, 0x6b4a2d),
    addRect(scene, 0, -8, piece.width - 12, piece.height * 0.24, 0xf0e7d0),
    addRect(scene, 0, piece.height * 0.18, 14, piece.height * 0.66, 0x5a3a22),
  ]);
}

export function drawBoard(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 8, piece.width + 8, piece.height + 8, 0x000000, 0.16),
    addRect(scene, 0, 0, piece.width, piece.height, 0x4b6038),
    addRect(scene, 0, 0, piece.width - 12, piece.height - 14, 0x70824b),
    addRect(scene, 0, -piece.height * 0.22, piece.width - 18, 12, 0xe9d18b),
    addRect(scene, 0, 6, piece.width - 18, 10, 0xe8b072),
    addRect(scene, 0, piece.height * 0.22, piece.width - 18, 10, 0xc85c4d),
  ]);
}

export function drawCarpet(scene: Phaser.Scene, piece: FurnitureDefinition) {
  addContainer(scene, piece.x, piece.y, [
    addRect(scene, 0, 6, piece.width + 8, piece.height + 4, 0x000000, 0.12),
    addRect(scene, 0, 0, piece.width, piece.height, 0x5d231e),
    addRect(scene, 0, 0, piece.width - 10, piece.height - 10, 0x7a2f29),
    addRect(scene, 0, -piece.height * 0.22, piece.width - 18, 4, 0xd39c63, 0.9),
    addRect(scene, 0, piece.height * 0.22, piece.width - 18, 4, 0xd39c63, 0.9),
    addRect(scene, -piece.width * 0.24, 0, 3, piece.height - 14, 0xb46e5e, 0.8),
    addRect(scene, piece.width * 0.24, 0, 3, piece.height - 14, 0xb46e5e, 0.8),
  ]);
}
