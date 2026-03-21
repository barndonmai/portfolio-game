import Phaser from 'phaser';
import { ROOM_HEIGHT, ROOM_WIDTH } from './roomData';
import { PubScene } from './scenes/PubScene';

export function createPortfolioGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: ROOM_WIDTH,
    height: ROOM_HEIGHT,
    backgroundColor: '#1f1411',
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [PubScene],
  });
}
