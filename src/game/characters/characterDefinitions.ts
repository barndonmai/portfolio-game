import eastUrl from '../../assets/sprites/brandon/rotations/east.png';
import northEastUrl from '../../assets/sprites/brandon/rotations/north-east.png';
import northWestUrl from '../../assets/sprites/brandon/rotations/north-west.png';
import northUrl from '../../assets/sprites/brandon/rotations/north.png';
import southEastUrl from '../../assets/sprites/brandon/rotations/south-east.png';
import southWestUrl from '../../assets/sprites/brandon/rotations/south-west.png';
import southUrl from '../../assets/sprites/brandon/rotations/south.png';
import westUrl from '../../assets/sprites/brandon/rotations/west.png';
import type {
  CharacterDefinition,
  CharacterFrameSource,
} from './types';

const brandonWalkFrameUrls = import.meta.glob(
  '../../assets/sprites/brandon/animations/walk/**/*.png',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>;

const BRANDON_ROTATION_TEXTURES = {
  'brandon-south': southUrl,
  'brandon-south-east': southEastUrl,
  'brandon-east': eastUrl,
  'brandon-north-east': northEastUrl,
  'brandon-north': northUrl,
  'brandon-north-west': northWestUrl,
  'brandon-west': westUrl,
  'brandon-south-west': southWestUrl,
} as const;

function getWalkTextureKey(direction: string, frameIndex: number) {
  return `brandon-walk-${direction}-${frameIndex}`;
}

const BRANDON_WALK_DIRECTIONS = [
  'north',
  'north-east',
  'east',
  'south-east',
  'south',
  'south-west',
  'west',
  'north-west',
] as const;

const BRANDON_WALK_TEXTURES = Object.fromEntries(
  BRANDON_WALK_DIRECTIONS.flatMap((direction) =>
    Array.from({ length: 6 }, (_, frameIndex) => {
      const framePath = `../../assets/sprites/brandon/animations/walk/${direction}/frame_${frameIndex.toString().padStart(3, '0')}.png`;
      const textureKey = getWalkTextureKey(direction, frameIndex);
      const assetPath = brandonWalkFrameUrls[framePath];

      if (!assetPath) {
        throw new Error(
          `Missing Brandon walk frame asset: ${framePath}`,
        );
      }

      return [[textureKey, assetPath] as const];
    }).flat(),
  ),
) as Record<string, string>;

const BRANDON_TEXTURES: Record<string, string> = {
  ...BRANDON_ROTATION_TEXTURES,
  ...BRANDON_WALK_TEXTURES,
};

function textureFrame(textureKey: string): CharacterFrameSource {
  return {
    kind: 'texture',
    textureKey,
  };
}

function walkFrames(direction: (typeof BRANDON_WALK_DIRECTIONS)[number]) {
  return Array.from({ length: 6 }, (_, frameIndex) =>
    textureFrame(getWalkTextureKey(direction, frameIndex)),
  ) as readonly CharacterFrameSource[];
}

export const characterDefinitions = {
  brandon: {
    key: 'brandon',
    sheet: {
      kind: 'textures',
      textures: BRANDON_TEXTURES,
    },
    animations: {
      directions: {
        n: {
          idleFrame: textureFrame('brandon-north'),
          walkFrames: walkFrames('north'),
        },
        ne: {
          idleFrame: textureFrame('brandon-north-east'),
          walkFrames: walkFrames('north-east'),
        },
        e: {
          idleFrame: textureFrame('brandon-east'),
          walkFrames: walkFrames('east'),
        },
        se: {
          idleFrame: textureFrame('brandon-south-east'),
          walkFrames: walkFrames('south-east'),
        },
        s: {
          idleFrame: textureFrame('brandon-south'),
          walkFrames: walkFrames('south'),
        },
        sw: {
          idleFrame: textureFrame('brandon-south-west'),
          walkFrames: walkFrames('south-west'),
        },
        w: {
          idleFrame: textureFrame('brandon-west'),
          walkFrames: walkFrames('west'),
        },
        nw: {
          idleFrame: textureFrame('brandon-north-west'),
          walkFrames: walkFrames('north-west'),
        },
      },
      frameRate: 6,
      repeat: -1,
    },
    render: {
      displayWidth: 120,
      displayHeight: 120,
      originX: 0.5,
      originY: 0.86,
      spriteOffsetY: 10,
      shadowOffsetY: 12,
      shadowWidth: 20,
      shadowHeight: 8,
      hitboxWidth: 22,
      hitboxHeight: 24,
    },
    notes:
      'Brandon now uses direct PixelLab rotation textures plus the extracted PixelLab walk frames in src/assets/sprites/brandon/animations/walk. Idle comes from rotations and walk uses the real 8-direction, 6-frame PixelLab exports.',
  } satisfies CharacterDefinition,
} as const;

export const defaultPlayerCharacter = characterDefinitions.brandon;
