import Phaser from 'phaser';
import {
  DIRECTIONS,
  getIdleAnimationKey,
  getWalkAnimationKey,
} from './directions';
import type {
  CharacterDefinition,
  CharacterFrameRect,
  CharacterFrameSource,
  CharacterGridSheetConfig,
  CharacterSheetConfig,
} from './types';

function getSheetTextureKey(sheet: CharacterSheetConfig) {
  if (sheet.kind === 'textures') {
    throw new Error('Texture-based characters do not use a shared sheet texture key.');
  }

  return sheet.textureKey;
}

function resolveGridFrameRect(
  sheet: CharacterGridSheetConfig,
  source: Extract<CharacterFrameSource, { kind: 'grid' }>,
): CharacterFrameRect {
  const { row, column } = source.frame;

  if (row < 0 || row >= sheet.rows) {
    throw new Error(
      `Frame row ${row} is outside the configured sheet rows for ${sheet.textureKey}.`,
    );
  }

  if (column < 0 || column >= sheet.columns) {
    throw new Error(
      `Frame column ${column} is outside the configured sheet columns for ${sheet.textureKey}.`,
    );
  }

  const margin = sheet.margin ?? 0;
  const spacing = sheet.spacing ?? 0;

  return {
    x: margin + column * (sheet.frameWidth + spacing),
    y: margin + row * (sheet.frameHeight + spacing),
    width: sheet.frameWidth,
    height: sheet.frameHeight,
  };
}

function resolveFrameRect(
  sheet: CharacterSheetConfig,
  source: CharacterFrameSource,
): CharacterFrameRect {
  if (source.kind === 'texture') {
    throw new Error('Texture frame sources do not resolve through sheet rectangles.');
  }

  if (source.kind === 'rect') {
    return source;
  }

  if (sheet.kind !== 'grid') {
    throw new Error(
      `Grid frame references require a grid sheet config for ${getSheetTextureKey(sheet)}.`,
    );
  }

  return resolveGridFrameRect(sheet, source);
}

function getTextureFrameKey(
  characterKey: string,
  state: 'idle' | 'walk',
  direction: string,
  index: number,
) {
  return `${characterKey}-frame-${state}-${direction}-${index}`;
}

function ensureTextureFrame(
  scene: Phaser.Scene,
  definition: CharacterDefinition,
  state: 'idle' | 'walk',
  direction: string,
  index: number,
  source: CharacterFrameSource,
) {
  if (source.kind === 'texture') {
    return {
      key: source.textureKey,
      frame: source.frame,
    };
  }

  const frameKey = getTextureFrameKey(
    definition.key,
    state,
    direction,
    index,
  );
  const texture = scene.textures.get(getSheetTextureKey(definition.sheet));

  if (!texture.has(frameKey)) {
    const frame = resolveFrameRect(definition.sheet, source);
    texture.add(
      frameKey,
      0,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
    );
  }

    return {
      key: getSheetTextureKey(definition.sheet),
      frame: frameKey,
    };
}

export function createCharacterAnimations(
  scene: Phaser.Scene,
  definition: CharacterDefinition,
) {
  for (const direction of DIRECTIONS) {
    const directionConfig = definition.animations.directions[direction];

    const idleKey = getIdleAnimationKey(definition.key, direction);
    if (!scene.anims.exists(idleKey)) {
      scene.anims.create({
        key: idleKey,
        frames: [
          ensureTextureFrame(
            scene,
            definition,
            'idle',
            direction,
            0,
            directionConfig.idleFrame,
          ),
        ],
        frameRate: 1,
        repeat: -1,
      });
    }

    const walkKey = getWalkAnimationKey(definition.key, direction);
    if (!scene.anims.exists(walkKey)) {
      scene.anims.create({
        key: walkKey,
        frames: directionConfig.walkFrames.map((frame, index) =>
          ensureTextureFrame(
            scene,
            definition,
            'walk',
            direction,
            index,
            frame,
          ),
        ),
        frameRate: definition.animations.frameRate,
        repeat: definition.animations.repeat,
      });
    }
  }
}
