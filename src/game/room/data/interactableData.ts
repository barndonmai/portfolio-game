import type { InteractableDefinition } from './roomTypes';

const primaryInteractables: InteractableDefinition[] = [
  {
    id: 'experience-ledger',
    sectionId: 'experience',
    label: 'Experience',
    prompt: 'Press E to explore',
    x: 690,
    y: 498,
    width: 34,
    height: 34,
    color: 0x77d2ca,
  },
  {
    id: 'jukebox',
    sectionId: 'projects',
    label: 'Jukebox',
    prompt: 'Press E to browse',
    x: 438,
    y: 326,
    width: 40,
    height: 48,
    color: 0xf0c27b,
  },
];

const utilityInteractables: InteractableDefinition[] = [
  {
    id: 'resume-scroll',
    sectionId: 'resume',
    label: 'Resume',
    prompt: 'Press E to inspect',
    x: 820,
    y: 798,
    width: 40,
    height: 32,
    color: 0xf3ead2,
  },
  {
    id: 'contact-phone',
    sectionId: 'contact',
    label: 'Contact',
    prompt: 'Press E to call',
    x: 566,
    y: 798,
    width: 26,
    height: 40,
    color: 0x9eb2c7,
  },
];

export const interactables: InteractableDefinition[] = [
  ...primaryInteractables,
  ...utilityInteractables,
];
