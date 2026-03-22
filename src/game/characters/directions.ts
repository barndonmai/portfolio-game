export const DIRECTIONS = [
  'n',
  'ne',
  'e',
  'se',
  's',
  'sw',
  'w',
  'nw',
] as const;

export type Direction = (typeof DIRECTIONS)[number];

const DIRECTIONS_BY_OCTANT: Direction[] = [
  'e',
  'ne',
  'n',
  'nw',
  'w',
  'sw',
  's',
  'se',
];

export function getDirectionFromVector(
  x: number,
  y: number,
  fallback: Direction = 's',
): Direction {
  if (Math.abs(x) < 0.001 && Math.abs(y) < 0.001) {
    return fallback;
  }

  const angle = Math.atan2(-y, x);
  const octant = Math.round(angle / (Math.PI / 4));
  const normalizedOctant =
    ((octant % DIRECTIONS_BY_OCTANT.length) + DIRECTIONS_BY_OCTANT.length) %
    DIRECTIONS_BY_OCTANT.length;

  return DIRECTIONS_BY_OCTANT[normalizedOctant];
}

export function getIdleAnimationKey(
  characterKey: string,
  direction: Direction,
) {
  return `${characterKey}-idle-${direction}`;
}

export function getWalkAnimationKey(
  characterKey: string,
  direction: Direction,
) {
  return `${characterKey}-walk-${direction}`;
}
