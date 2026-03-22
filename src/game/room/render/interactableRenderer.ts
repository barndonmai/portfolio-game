import Phaser from 'phaser';
import { INTERACTABLE_DEPTH } from '../config/depth';
import type { InteractableDefinition } from '../data/roomTypes';
import { addEllipse, addRect } from './primitives';

const ANIMATED_INTERACTABLE_IDS = new Set([
  'experience-ledger',
  'resume-scroll',
  'contact-phone',
  'jukebox',
]);

export function drawInteractables(
  scene: Phaser.Scene,
  interactables: InteractableDefinition[],
) {
  interactables.forEach((interactable) => {
    if (ANIMATED_INTERACTABLE_IDS.has(interactable.id)) {
      return;
    }

    addEllipse(
      scene,
      interactable.x,
      interactable.y + interactable.height * 0.42,
      interactable.width + 22,
      12,
      0x000000,
      0.16,
    ).setDepth(INTERACTABLE_DEPTH - 1);

    addRect(
      scene,
      interactable.x,
      interactable.y,
      interactable.width,
      interactable.height,
      interactable.color,
    ).setDepth(INTERACTABLE_DEPTH);

    addRect(
      scene,
      interactable.x,
      interactable.y - interactable.height * 0.18,
      interactable.width - 6,
      6,
      0xf3e1b0,
      0.7,
    ).setDepth(INTERACTABLE_DEPTH + 0.1);

    scene.add
      .text(
        interactable.x,
        interactable.y + interactable.height / 2 + 14,
        interactable.label,
        {
          color: '#f2e4c8',
          fontFamily: 'monospace',
          fontSize: '10px',
        },
      )
      .setDepth(INTERACTABLE_DEPTH + 0.2)
      .setOrigin(0.5);
  });
}
