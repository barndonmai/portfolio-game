import type { PortfolioSectionId } from '../types/portfolio';

export const ROOM_WIDTH = 1760;
export const ROOM_HEIGHT = 1180;
export const PLAYER_SPEED = 180;
export const INTERACTION_RADIUS = 78;
export const PLAYER_SPAWN = { x: 900, y: 1020 };

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
    x: 260,
    y: 176,
    width: 250,
    height: 60,
    color: 0x7f2d25,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'top-left-booth-table',
    x: 260,
    y: 242,
    width: 92,
    height: 50,
    color: 0x8f6339,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'mid-left-booth-seat',
    x: 260,
    y: 420,
    width: 250,
    height: 60,
    color: 0x7f2d25,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'mid-left-booth-table',
    x: 260,
    y: 486,
    width: 92,
    height: 50,
    color: 0x8f6339,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'bottom-left-booth-seat',
    x: 260,
    y: 664,
    width: 250,
    height: 60,
    color: 0x7f2d25,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'bottom-left-booth-table',
    x: 260,
    y: 730,
    width: 92,
    height: 50,
    color: 0x8f6339,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'center-table-top',
    x: 780,
    y: 360,
    width: 92,
    height: 92,
    color: 0x7a4b28,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'center-table-middle',
    x: 980,
    y: 610,
    width: 92,
    height: 92,
    color: 0x7a4b28,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'center-table-bottom',
    x: 760,
    y: 860,
    width: 92,
    height: 92,
    color: 0x7a4b28,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'bar-counter',
    x: 1330,
    y: 176,
    width: 520,
    height: 86,
    color: 0x6b3a1d,
    stroke: 0xd39c63,
    collides: true,
  },
  {
    id: 'back-bar',
    x: 1330,
    y: 92,
    width: 520,
    height: 52,
    color: 0x43271a,
    stroke: 0x8d6139,
    collides: false,
  },
  {
    id: 'jukebox',
    x: 116,
    y: 1030,
    width: 70,
    height: 92,
    color: 0xb45b34,
    stroke: 0xf0c27b,
    collides: true,
  },
  {
    id: 'payphone',
    x: 346,
    y: 1032,
    width: 34,
    height: 78,
    color: 0x48505a,
    stroke: 0x9eb2c7,
    collides: true,
  },
  {
    id: 'resume-stand',
    x: 1440,
    y: 1022,
    width: 118,
    height: 58,
    color: 0x6f4a2d,
    stroke: 0xd8b074,
    collides: true,
  },
  {
    id: 'projects-board',
    x: 1638,
    y: 720,
    width: 40,
    height: 160,
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
    x: 344,
    y: 244,
    width: 26,
    height: 32,
    color: 0xf0c27b,
  },
  {
    id: 'experience-ledger',
    sectionId: 'experience',
    label: 'Bar Ledger',
    prompt: 'Press E to read',
    x: 1238,
    y: 246,
    width: 38,
    height: 26,
    color: 0xb08c55,
  },
  {
    id: 'projects-board',
    sectionId: 'projects',
    label: 'Project Board',
    prompt: 'Press E to browse',
    x: 1596,
    y: 720,
    width: 18,
    height: 92,
    color: 0xe6d186,
  },
  {
    id: 'resume-frame',
    sectionId: 'resume',
    label: 'Resume Frame',
    prompt: 'Press E to inspect',
    x: 1438,
    y: 1020,
    width: 58,
    height: 28,
    color: 0xf3ead2,
  },
  {
    id: 'contact-phone',
    sectionId: 'contact',
    label: 'Pub Phone',
    prompt: 'Press E to call',
    x: 346,
    y: 1030,
    width: 26,
    height: 40,
    color: 0x9eb2c7,
  },
];
