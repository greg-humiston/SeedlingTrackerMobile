import {
  DECOR_ICONS_DEFAULT,
  EMOJI_CARROT,
  EMOJI_CORN,
  EMOJI_FLOWER_PINK,
  EMOJI_FLOWER_RED,
  EMOJI_FLOWER_YELLOW,
  EMOJI_HERB,
  EMOJI_LAVENDER,
  EMOJI_LEAF,
  EMOJI_LEAFY,
  EMOJI_ROCK,
  EMOJI_SEEDLING,
  EMOJI_SUNFLOWER,
  EMOJI_TOMATO,
  EMOJI_WATER,
  EMOJI_WORM,
  EMOJI_SUN,
  FOOTER_SOIL,
} from '@/constants/icons';
import type { Header, Seedling, SeedlingGrid, Stat, Tip } from '@/types/home';

// ─── Colors ───────────────────────────────────────────────────────────────────
export const GARDEN_GREEN = '#4A7C59';
export const LIGHT_GREEN = '#A8D5BA';
export const SOIL_BROWN = '#8B5E3C';
export const PETAL_YELLOW = '#F6C343';
export const LEAF_GREEN = '#2E7D32';
export const CREAM = '#FAF6EF';
export const WATER_BLUE = '#3A86FF';

// ─── Header Content ───────────────────────────────────────────────────────────
export const HEADER: Header = {
  greeting: 'Good morning,',
  title: `${EMOJI_SEEDLING} My Garden`,
  subtitle: 'Your seedlings are growing beautifully!',
  decorativeIcons: DECOR_ICONS_DEFAULT,
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS: Stat[] = [
  { emoji: EMOJI_SEEDLING, label: 'Seedlings',   value: '12', color: GARDEN_GREEN },
  { emoji: EMOJI_WATER,    label: 'Need Water',  value: '3',  color: WATER_BLUE   },
  { emoji: EMOJI_SUN,      label: 'Days Active', value: '24', color: PETAL_YELLOW },
];

// ─── Seedlings ────────────────────────────────────────────────────────────────
export const SEEDLINGS: Seedling[] = [
  { name: 'Cherry Tomato', stage: 'Germinating',  daysOld: 5,  emoji: EMOJI_TOMATO   },
  { name: 'Sweet Basil',   stage: 'First Leaves', daysOld: 12, emoji: EMOJI_HERB     },
  { name: 'Sunflower',     stage: 'Sprouting',    daysOld: 3,  emoji: EMOJI_SUNFLOWER },
  { name: 'Lavender',      stage: 'Established',  daysOld: 30, emoji: EMOJI_LAVENDER  },
  { name: 'Mint',          stage: 'First Leaves', daysOld: 8,  emoji: EMOJI_SEEDLING  },
  { name: 'Rosemary',      stage: 'Germinating',  daysOld: 2,  emoji: EMOJI_HERB     },
];

// ─── Tip of the Day ───────────────────────────────────────────────────────────
export const TIP: Tip = {
  title: `${EMOJI_FLOWER_PINK} Garden Tip of the Day`,
  text: 'Water your seedlings in the early morning to reduce evaporation and prevent fungal growth. Keep the soil moist but never waterlogged!',
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_ICONS: string[] = FOOTER_SOIL;

// ─── Seedling Grids ───────────────────────────────────────────────────────────
export const SEEDLING_GRIDS: SeedlingGrid[] = [
  {
    id: 'herb-garden',
    createdAt: '2025-01-01T00:00:00.000Z',
    name: 'Herb Garden',
    emoji: EMOJI_HERB,
    description: 'Kitchen herbs and aromatics',
    header: {
      greeting: 'Good morning,',
      title: `${EMOJI_HERB} Herb Garden`,
      subtitle: 'Your herbs are thriving!',
      decorativeIcons: DECOR_ICONS_DEFAULT,
    },
    stats: [
      { emoji: EMOJI_SEEDLING, label: 'Seedlings',   value: '6',  color: GARDEN_GREEN },
      { emoji: EMOJI_WATER,    label: 'Need Water',  value: '2',  color: WATER_BLUE   },
      { emoji: EMOJI_SUN,      label: 'Days Active', value: '14', color: PETAL_YELLOW },
    ],
    seedlings: [
      { name: 'Sweet Basil', stage: 'First Leaves', daysOld: 12, emoji: EMOJI_HERB,     plantedAt: '2024-12-20', lastWateredAt: '2024-12-31' },
      { name: 'Mint',        stage: 'First Leaves', daysOld: 8,  emoji: EMOJI_SEEDLING,  plantedAt: '2024-12-24', lastWateredAt: '2024-12-30' },
      { name: 'Rosemary',    stage: 'Germinating',  daysOld: 2,  emoji: EMOJI_HERB,     plantedAt: '2024-12-30', lastWateredAt: '2024-12-30' },
      { name: 'Thyme',       stage: 'Sprouting',    daysOld: 6,  emoji: EMOJI_LEAF,     plantedAt: '2024-12-26', lastWateredAt: '2024-12-31' },
      { name: 'Parsley',     stage: 'Germinating',  daysOld: 3,  emoji: EMOJI_SEEDLING,  plantedAt: '2024-12-29', lastWateredAt: '2024-12-29' },
      { name: 'Chives',      stage: 'Established',  daysOld: 21, emoji: EMOJI_HERB,     plantedAt: '2024-12-11', lastWateredAt: '2024-12-28' },
    ],
    tip: {
      title: `${EMOJI_FLOWER_PINK} Herb Garden Tip`,
      text: 'Pinch off flower buds on basil to keep leaves growing strong and prevent the plant from going to seed too early.',
    },
    footerIcons: FOOTER_SOIL,
    // 3 × 2 layout — all 6 cells filled
    cols: 3,
    rows: 2,
    gridCells: [
      { name: 'Sweet Basil', stage: 'First Leaves', daysOld: 12, emoji: EMOJI_HERB,     plantedAt: '2024-12-20', lastWateredAt: '2024-12-31' },
      { name: 'Mint',        stage: 'First Leaves', daysOld: 8,  emoji: EMOJI_SEEDLING,  plantedAt: '2024-12-24', lastWateredAt: '2024-12-30' },
      { name: 'Rosemary',    stage: 'Germinating',  daysOld: 2,  emoji: EMOJI_HERB,     plantedAt: '2024-12-30', lastWateredAt: '2024-12-30' },
      { name: 'Thyme',       stage: 'Sprouting',    daysOld: 6,  emoji: EMOJI_LEAF,     plantedAt: '2024-12-26', lastWateredAt: '2024-12-31' },
      { name: 'Parsley',     stage: 'Germinating',  daysOld: 3,  emoji: EMOJI_SEEDLING,  plantedAt: '2024-12-29', lastWateredAt: '2024-12-29' },
      { name: 'Chives',      stage: 'Established',  daysOld: 21, emoji: EMOJI_HERB,     plantedAt: '2024-12-11', lastWateredAt: '2024-12-28' },
    ],
  },
  {
    id: 'veggie-patch',
    createdAt: '2025-01-01T00:00:00.000Z',
    name: 'Veggie Patch',
    emoji: EMOJI_TOMATO,
    description: 'Tomatoes, greens and more',
    header: {
      greeting: 'Good morning,',
      title: `${EMOJI_TOMATO} Veggie Patch`,
      subtitle: 'Your vegetables are growing beautifully!',
      decorativeIcons: [EMOJI_TOMATO, EMOJI_LEAFY, EMOJI_CORN, EMOJI_CARROT, EMOJI_TOMATO, EMOJI_LEAFY],
    },
    stats: [
      { emoji: EMOJI_SEEDLING, label: 'Seedlings',   value: '4',  color: GARDEN_GREEN },
      { emoji: EMOJI_WATER,    label: 'Need Water',  value: '1',  color: WATER_BLUE   },
      { emoji: EMOJI_SUN,      label: 'Days Active', value: '30', color: PETAL_YELLOW },
    ],
    seedlings: [
      { name: 'Cherry Tomato', stage: 'Germinating',  daysOld: 5,  emoji: EMOJI_TOMATO,   plantedAt: '2024-12-27', lastWateredAt: '2024-12-31' },
      { name: 'Sunflower',     stage: 'Sprouting',    daysOld: 3,  emoji: EMOJI_SUNFLOWER, plantedAt: '2024-12-29', lastWateredAt: '2024-12-31' },
      { name: 'Zucchini',      stage: 'First Leaves', daysOld: 9,  emoji: EMOJI_LEAFY,     plantedAt: '2024-12-23', lastWateredAt: '2024-12-30' },
      { name: 'Kale',          stage: 'Established',  daysOld: 25, emoji: EMOJI_LEAFY,     plantedAt: '2024-12-07', lastWateredAt: '2024-12-29' },
    ],
    tip: {
      title: `${EMOJI_FLOWER_PINK} Veggie Patch Tip`,
      text: 'Rotate your vegetable crops each season to prevent soil depletion and reduce the build-up of pests and diseases.',
    },
    footerIcons: [EMOJI_ROCK, EMOJI_TOMATO, EMOJI_WORM, EMOJI_CORN, EMOJI_ROCK],
    // 2 × 2 layout — all 4 cells filled
    cols: 2,
    rows: 2,
    gridCells: [
      { name: 'Cherry Tomato', stage: 'Germinating',  daysOld: 5,  emoji: EMOJI_TOMATO,   plantedAt: '2024-12-27', lastWateredAt: '2024-12-31' },
      { name: 'Sunflower',     stage: 'Sprouting',    daysOld: 3,  emoji: EMOJI_SUNFLOWER, plantedAt: '2024-12-29', lastWateredAt: '2024-12-31' },
      { name: 'Zucchini',      stage: 'First Leaves', daysOld: 9,  emoji: EMOJI_LEAFY,     plantedAt: '2024-12-23', lastWateredAt: '2024-12-30' },
      { name: 'Kale',          stage: 'Established',  daysOld: 25, emoji: EMOJI_LEAFY,     plantedAt: '2024-12-07', lastWateredAt: '2024-12-29' },
    ],
  },
  {
    id: 'flower-bed',
    createdAt: '2025-01-01T00:00:00.000Z',
    name: 'Flower Bed',
    emoji: EMOJI_FLOWER_PINK,
    description: 'Blooms and ornamental plants',
    header: {
      greeting: 'Good morning,',
      title: `${EMOJI_FLOWER_PINK} Flower Bed`,
      subtitle: 'Your flowers are blooming!',
      decorativeIcons: [
        EMOJI_FLOWER_PINK, EMOJI_FLOWER_YELLOW, EMOJI_FLOWER_RED,
        EMOJI_FLOWER_PINK, EMOJI_FLOWER_PINK, EMOJI_FLOWER_YELLOW,
      ],
    },
    stats: [
      { emoji: EMOJI_SEEDLING,    label: 'Seedlings',   value: '5',  color: GARDEN_GREEN },
      { emoji: EMOJI_WATER,       label: 'Need Water',  value: '3',  color: WATER_BLUE   },
      { emoji: EMOJI_SUN,         label: 'Days Active', value: '20', color: PETAL_YELLOW },
    ],
    seedlings: [
      { name: 'Lavender', stage: 'Established',  daysOld: 30, emoji: EMOJI_LAVENDER,     plantedAt: '2024-12-02', lastWateredAt: '2024-12-28' },
      { name: 'Marigold', stage: 'Sprouting',    daysOld: 7,  emoji: EMOJI_FLOWER_YELLOW, plantedAt: '2024-12-25', lastWateredAt: '2024-12-30' },
      { name: 'Petunia',  stage: 'First Leaves', daysOld: 11, emoji: EMOJI_FLOWER_PINK,   plantedAt: '2024-12-21', lastWateredAt: '2024-12-31' },
      { name: 'Cosmos',   stage: 'Germinating',  daysOld: 4,  emoji: EMOJI_FLOWER_RED,    plantedAt: '2024-12-28', lastWateredAt: '2024-12-30' },
      { name: 'Zinnia',   stage: 'Sprouting',    daysOld: 8,  emoji: EMOJI_SUNFLOWER,     plantedAt: '2024-12-24', lastWateredAt: '2024-12-29' },
    ],
    tip: {
      title: `${EMOJI_FLOWER_PINK} Flower Bed Tip`,
      text: 'Deadhead spent blooms regularly to encourage your plants to produce more flowers throughout the season.',
    },
    footerIcons: [EMOJI_ROCK, EMOJI_FLOWER_PINK, EMOJI_WORM, EMOJI_FLOWER_YELLOW, EMOJI_ROCK],
    // 3 × 2 layout — 5 seedlings, last cell empty
    cols: 3,
    rows: 2,
    gridCells: [
      { name: 'Lavender', stage: 'Established',  daysOld: 30, emoji: EMOJI_LAVENDER,     plantedAt: '2024-12-02', lastWateredAt: '2024-12-28' },
      { name: 'Marigold', stage: 'Sprouting',    daysOld: 7,  emoji: EMOJI_FLOWER_YELLOW, plantedAt: '2024-12-25', lastWateredAt: '2024-12-30' },
      { name: 'Petunia',  stage: 'First Leaves', daysOld: 11, emoji: EMOJI_FLOWER_PINK,   plantedAt: '2024-12-21', lastWateredAt: '2024-12-31' },
      { name: 'Cosmos',   stage: 'Germinating',  daysOld: 4,  emoji: EMOJI_FLOWER_RED,    plantedAt: '2024-12-28', lastWateredAt: '2024-12-30' },
      { name: 'Zinnia',   stage: 'Sprouting',    daysOld: 8,  emoji: EMOJI_SUNFLOWER,     plantedAt: '2024-12-24', lastWateredAt: '2024-12-29' },
      null,
    ],
  },
];
