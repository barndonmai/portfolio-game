import Phaser from 'phaser';
import { PubScene } from './scenes/PubScene';

export function createPortfolioGame(parent: HTMLElement) {
  const width = parent.clientWidth || window.innerWidth;
  const height = parent.clientHeight || window.innerHeight;

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: '#1f1411',
    pixelArt: true,
    roundPixels: true,
    autoRound: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      width,
      height,
    },
    scene: [PubScene],
  });
}
