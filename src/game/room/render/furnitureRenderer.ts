import Phaser from 'phaser';
import { FURNITURE_DEPTH } from '../config/depth';
import type { FurnitureDefinition } from '../data/roomTypes';
import { addRect } from './primitives';
import { drawBarCounter } from './furniture/barRenderer';
import { drawBoothPiece } from './furniture/boothRenderer';
import {
  drawBoard,
  drawCarpet,
  drawColumn,
  drawJukebox,
  drawPhone,
  drawResumeStand,
} from './furniture/miscFurnitureRenderer';
import { drawStool } from './furniture/stoolRenderer';
import { drawRectTable, drawRoundTable } from './furniture/tableRenderer';

type FurnitureRenderKind =
  | 'roundTable'
  | 'rectTable'
  | 'booth'
  | 'stool'
  | 'barCounter'
  | 'column'
  | 'jukebox'
  | 'phone'
  | 'resume'
  | 'board'
  | 'carpet'
  | 'fallback';

const SKIPPED_FURNITURE_IDS = new Set([
  'resume-stand',
  'bar-top-return',
  'back-bar',
  'back-bar-shelf-top',
]);

function resolveFurnitureRenderKind(
  piece: FurnitureDefinition,
): FurnitureRenderKind | null {
  if (SKIPPED_FURNITURE_IDS.has(piece.id)) {
    return null;
  }

  if (piece.id.includes('table')) {
    return piece.shape === 'ellipse' || piece.id.includes('round-table')
      ? 'roundTable'
      : 'rectTable';
  }

  if (piece.id.includes('booth') || piece.id.includes('bench')) {
    return 'booth';
  }

  if (piece.id.includes('stool')) {
    return 'stool';
  }

  if (piece.id.includes('bar-counter')) {
    return 'barCounter';
  }

  if (piece.id.includes('column')) {
    return 'column';
  }

  if (piece.id.includes('carpet')) {
    return 'carpet';
  }

  if (piece.id.includes('jukebox')) {
    return 'jukebox';
  }

  if (piece.id.includes('phone')) {
    return 'phone';
  }

  if (piece.id.includes('resume')) {
    return 'resume';
  }

  if (piece.id.includes('board')) {
    return 'board';
  }

  return 'fallback';
}

export function drawFurniture(
  scene: Phaser.Scene,
  furniture: FurnitureDefinition[],
) {
  furniture.forEach((piece) => {
    switch (resolveFurnitureRenderKind(piece)) {
      case null:
        return;
      case 'roundTable':
        drawRoundTable(scene, piece);
        return;
      case 'rectTable':
        drawRectTable(scene, piece);
        return;
      case 'booth':
        drawBoothPiece(scene, piece);
        return;
      case 'stool':
        drawStool(scene, piece);
        return;
      case 'barCounter':
        drawBarCounter(scene, piece, piece.width > piece.height);
        return;
      case 'column':
        drawColumn(scene, piece);
        return;
      case 'carpet':
        drawCarpet(scene, piece);
        return;
      case 'jukebox':
        drawJukebox(scene, piece);
        return;
      case 'phone':
        drawPhone(scene, piece);
        return;
      case 'resume':
        drawResumeStand(scene, piece);
        return;
      case 'board':
        drawBoard(scene, piece);
        return;
      case 'fallback':
        addRect(scene, piece.x, piece.y, piece.width, piece.height, piece.color)
          .setStrokeStyle(3, piece.stroke)
          .setDepth(FURNITURE_DEPTH);
        return;
    }
  });
}
