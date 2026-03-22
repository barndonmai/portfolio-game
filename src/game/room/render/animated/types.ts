import Phaser from 'phaser';

export interface FloatingCenterpieceParts {
  glow: Phaser.GameObjects.Ellipse;
  root: Phaser.GameObjects.Container;
  shadow: Phaser.GameObjects.Ellipse;
  sparkles: Phaser.GameObjects.Container;
}

export interface AnimatedPhoneParts {
  handset: Phaser.GameObjects.Container;
  ringLeft: Phaser.GameObjects.Container;
  ringRight: Phaser.GameObjects.Container;
}

export interface AnimatedJukeboxParts {
  glow: Phaser.GameObjects.Ellipse;
  marquee: Phaser.GameObjects.Container;
  noteLeft: Phaser.GameObjects.Container;
  noteRight: Phaser.GameObjects.Container;
  sparkle: Phaser.GameObjects.Rectangle;
}

export interface FloatingResumeScrollParts {
  glow: Phaser.GameObjects.Ellipse;
  scroll: Phaser.GameObjects.Container;
  shadow: Phaser.GameObjects.Ellipse;
  sparkle: Phaser.GameObjects.Rectangle;
}
