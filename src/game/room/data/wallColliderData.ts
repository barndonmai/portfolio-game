import { ROOM_HEIGHT, ROOM_WIDTH } from '../config/roomConstants';
import type { WallColliderDefinition } from './roomTypes';

export const wallColliders: WallColliderDefinition[] = [
  {
    id: 'top-wall',
    x: (ROOM_WIDTH - 156) / 2,
    y: 78,
    width: ROOM_WIDTH - 156,
    height: 156,
  },
  {
    id: 'right-wall',
    x: ROOM_WIDTH - 78,
    y: ROOM_HEIGHT / 2,
    width: 156,
    height: ROOM_HEIGHT,
  },
];
