import type { PortfolioSectionId } from '../types/portfolio';

export const ROOM_WIDTH = 960;
export const ROOM_HEIGHT = 640;
export const PLAYER_SPEED = 180;
export const INTERACTION_RADIUS = 78;
export const PLAYER_SPAWN = { x: 470, y: 560 };

export interface FurnitureDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  stroke: number;
  collides?: boolean;
}

export interface InteractableDefinition {
  id: string;
  sectionId: PortfolioSectionId;
  label: string;
  prompt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
}

export const furniture: FurnitureDefinition[] = [
  {
    id: 'top-left-booth-seat',
    x: 160,
    y: 118,
    width: 184,
    height: 52,
    color: 0x7f2d25,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'top-left-booth-table',
    x: 160,
    y: 172,
    width: 74,
    height: 42,
    color: 0x8f6339,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'mid-left-booth-seat',
    x: 160,
    y: 280,
    width: 184,
    height: 52,
    color: 0x7f2d25,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'mid-left-booth-table',
    x: 160,
    y: 334,
    width: 74,
    height: 42,
    color: 0x8f6339,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'bottom-left-booth-seat',
    x: 160,
    y: 442,
    width: 184,
    height: 52,
    color: 0x7f2d25,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'bottom-left-booth-table',
    x: 160,
    y: 496,
    width: 74,
    height: 42,
    color: 0x8f6339,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'center-table-top',
    x: 410,
    y: 220,
    width: 72,
    height: 72,
    color: 0x7a4b28,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'center-table-middle',
    x: 520,
    y: 348,
    width: 72,
    height: 72,
    color: 0x7a4b28,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'center-table-bottom',
    x: 408,
    y: 470,
    width: 72,
    height: 72,
    color: 0x7a4b28,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'bar-counter',
    x: 745,
    y: 116,
    width: 286,
    height: 76,
    color: 0x6b3a1d,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'back-bar',
    x: 745,
    y: 54,
    width: 286,
    height: 42,
    color: 0x43271a,
    stroke: 0x8d6139,
    collides: false,
  },
  {
    id: 'jukebox',
    x: 92,
    y: 560,
    width: 58,
    height: 76,
    color: 0xb45b34,
    stroke: 0xf0c27b,
    collides: true,
  },
  {
    id: 'payphone',
    x: 212,
    y: 558,
    width: 32,
    height: 70,
    color: 0x48505a,
    stroke: 0x9eb2c7,
    collides: true,
  },
  {
    id: 'resume-stand',
    x: 794,
    y: 548,
    width: 92,
    height: 48,
    color: 0x6f4a2d,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'projects-board',
    x: 888,
    y: 352,
    width: 36,
    height: 128,
    color: 0x57633a,
    stroke: 0xc5d38a,
    collides: true,
  },
];

export const interactables: InteractableDefinition[] = [
  {
    id: 'about-patron',
    sectionId: 'about',
    label: 'Booth Patron',
    prompt: 'Press E to chat',
    x: 246,
    y: 173,
    width: 26,
    height: 32,
    color: 0xf0c27b,
  },
  {
    id: 'experience-ledger',
    sectionId: 'experience',
    label: 'Bar Ledger',
    prompt: 'Press E to read',
    x: 742,
    y: 170,
    width: 38,
    height: 26,
    color: 0xb08c55,
  },
  {
    id: 'projects-board',
    sectionId: 'projects',
    label: 'Project Board',
    prompt: 'Press E to browse',
    x: 862,
    y: 352,
    width: 18,
    height: 92,
    color: 0xe6d186,
  },
  {
    id: 'resume-frame',
    sectionId: 'resume',
    label: 'Resume Frame',
    prompt: 'Press E to inspect',
    x: 793,
    y: 550,
    width: 58,
    height: 28,
    color: 0xf3ead2,
  },
  {
    id: 'contact-phone',
    sectionId: 'contact',
    label: 'Pub Phone',
    prompt: 'Press E to call',
    x: 212,
    y: 558,
    width: 26,
    height: 40,
    color: 0x9eb2c7,
  },
];
