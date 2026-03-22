import type Phaser from 'phaser';
import {
  getDirectionFromVector,
  getIdleAnimationKey,
  getWalkAnimationKey,
  type Direction,
} from './directions';
import type { CharacterAnimationConfig } from './types';

interface UpdateCharacterAnimationParams {
  sprite: Phaser.GameObjects.Sprite;
  characterKey: string;
  animationConfig: CharacterAnimationConfig;
  velocityX: number;
  velocityY: number;
  movementIntentX?: number;
  movementIntentY?: number;
  currentFacing: Direction;
  currentAnimationKey: string | null;
  walkStartThreshold?: number;
  walkStopThreshold?: number;
  directionChangeThreshold?: number;
}

interface CharacterAnimationState {
  facing: Direction;
  animationKey: string;
}

export function updateCharacterAnimation({
  sprite,
  characterKey,
  animationConfig,
  velocityX,
  velocityY,
  movementIntentX = 0,
  movementIntentY = 0,
  currentFacing,
  currentAnimationKey,
  walkStartThreshold = 56,
  walkStopThreshold = 20,
  directionChangeThreshold = 32,
}: UpdateCharacterAnimationParams): CharacterAnimationState {
  const speed = Math.hypot(velocityX, velocityY);
  const intentMagnitude = Math.hypot(movementIntentX, movementIntentY);
  const wasMoving = currentAnimationKey?.includes('-walk-') ?? false;
  const isMoving = wasMoving
    ? speed > walkStopThreshold
    : speed > walkStartThreshold;
  const shouldUpdateFacing =
    intentMagnitude > 0.01 || speed > directionChangeThreshold;
  const facingVectorX =
    intentMagnitude > 0.01 ? movementIntentX : velocityX;
  const facingVectorY =
    intentMagnitude > 0.01 ? movementIntentY : velocityY;
  const facing = shouldUpdateFacing
    ? getDirectionFromVector(facingVectorX, facingVectorY, currentFacing)
    : currentFacing;
  const animationKey = isMoving
    ? getWalkAnimationKey(characterKey, facing)
    : getIdleAnimationKey(characterKey, facing);
  const nextFlipX = Boolean(animationConfig.directions[facing].flipX);
  const activeAnimationKey = sprite.anims.currentAnim?.key ?? null;

  if (animationKey !== currentAnimationKey || activeAnimationKey !== animationKey) {
    sprite.play(animationKey, true);
  }

  if (sprite.flipX !== nextFlipX) {
    sprite.setFlipX(nextFlipX);
  }

  return {
    facing,
    animationKey,
  };
}
