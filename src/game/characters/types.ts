import type { Direction } from './directions';

export interface CharacterFrameRef {
  row: number;
  column: number;
}

export interface CharacterFrameRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CharacterFrameSource =
  | {
      kind: 'grid';
      frame: CharacterFrameRef;
    }
  | {
      kind: 'texture';
      textureKey: string;
      frame?: string | number;
    }
  | ({
      kind: 'rect';
    } & CharacterFrameRect);

export interface CharacterGridSheetConfig {
  kind: 'grid';
  textureKey: string;
  assetPath: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  margin?: number;
  spacing?: number;
}

export interface CharacterAtlasSheetConfig {
  kind: 'atlas';
  textureKey: string;
  assetPath: string;
}

export interface CharacterTextureSheetConfig {
  kind: 'textures';
  textures: Record<string, string>;
}

export type CharacterSheetConfig =
  | CharacterGridSheetConfig
  | CharacterAtlasSheetConfig
  | CharacterTextureSheetConfig;

export interface CharacterDirectionAnimationConfig {
  idleFrame: CharacterFrameSource;
  walkFrames: readonly CharacterFrameSource[];
  flipX?: boolean;
}

export interface CharacterAnimationConfig {
  directions: Record<Direction, CharacterDirectionAnimationConfig>;
  frameRate: number;
  repeat: number;
}

export interface CharacterRenderConfig {
  displayWidth: number;
  displayHeight: number;
  originX: number;
  originY: number;
  spriteOffsetY: number;
  shadowOffsetY: number;
  shadowWidth: number;
  shadowHeight: number;
  hitboxWidth: number;
  hitboxHeight: number;
}

export interface CharacterDefinition {
  key: string;
  sheet: CharacterSheetConfig;
  animations: CharacterAnimationConfig;
  render: CharacterRenderConfig;
  notes?: string;
}
