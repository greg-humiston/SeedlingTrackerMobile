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
  title: '🌱 My Garden',
  subtitle: 'Your seedlings are growing beautifully!',
  decorativeIcons: ['🌿', '🌱', '🌿', '🍃', '🌱', '🌿'],
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS: Stat[] = [
  { emoji: '🌱', label: 'Seedlings', value: '12', color: GARDEN_GREEN },
  { emoji: '💧', label: 'Need Water', value: '3', color: WATER_BLUE },
  { emoji: '☀️', label: 'Days Active', value: '24', color: PETAL_YELLOW },
];

// ─── Seedlings ────────────────────────────────────────────────────────────────
export const SEEDLINGS: Seedling[] = [
  { name: 'Cherry Tomato', stage: 'Germinating', daysOld: 5, emoji: '🍅' },
  { name: 'Sweet Basil', stage: 'First Leaves', daysOld: 12, emoji: '🌿' },
  { name: 'Sunflower', stage: 'Sprouting', daysOld: 3, emoji: '🌻' },
  { name: 'Lavender', stage: 'Established', daysOld: 30, emoji: '💜' },
  { name: 'Mint', stage: 'First Leaves', daysOld: 8, emoji: '🌱' },
  { name: 'Rosemary', stage: 'Germinating', daysOld: 2, emoji: '🌿' },
];

// ─── Tip of the Day ───────────────────────────────────────────────────────────
export const TIP: Tip = {
  title: '🌸 Garden Tip of the Day',
  text: 'Water your seedlings in the early morning to reduce evaporation and prevent fungal growth. Keep the soil moist but never waterlogged!',
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_ICONS: string[] = ['🪨', '🌱', '🪱', '🌱', '🪨'];

// ─── Seedling Grids ───────────────────────────────────────────────────────────
export const SEEDLING_GRIDS: SeedlingGrid[] = [
  {
    id: 'herb-garden',
    name: 'Herb Garden',
    emoji: '🌿',
    description: 'Kitchen herbs and aromatics',
    header: {
      greeting: 'Good morning,',
      title: '🌿 Herb Garden',
      subtitle: 'Your herbs are thriving!',
      decorativeIcons: ['🌿', '🌱', '🌿', '🍃', '🌱', '🌿'],
    },
    stats: [
      { emoji: '🌱', label: 'Seedlings', value: '6', color: GARDEN_GREEN },
      { emoji: '💧', label: 'Need Water', value: '2', color: WATER_BLUE },
      { emoji: '☀️', label: 'Days Active', value: '14', color: PETAL_YELLOW },
    ],
    seedlings: [
      { name: 'Sweet Basil', stage: 'First Leaves', daysOld: 12, emoji: '🌿' },
      { name: 'Mint', stage: 'First Leaves', daysOld: 8, emoji: '🌱' },
      { name: 'Rosemary', stage: 'Germinating', daysOld: 2, emoji: '🌿' },
      { name: 'Thyme', stage: 'Sprouting', daysOld: 6, emoji: '🍃' },
      { name: 'Parsley', stage: 'Germinating', daysOld: 3, emoji: '🌱' },
      { name: 'Chives', stage: 'Established', daysOld: 21, emoji: '🌿' },
    ],
    tip: {
      title: '🌸 Herb Garden Tip',
      text: 'Pinch off flower buds on basil to keep leaves growing strong and prevent the plant from going to seed too early.',
    },
    footerIcons: ['🪨', '🌱', '🪱', '🌱', '🪨'],
  },
  {
    id: 'veggie-patch',
    name: 'Veggie Patch',
    emoji: '🍅',
    description: 'Tomatoes, greens and more',
    header: {
      greeting: 'Good morning,',
      title: '🍅 Veggie Patch',
      subtitle: 'Your vegetables are growing beautifully!',
      decorativeIcons: ['🍅', '🥬', '🌽', '🥕', '🍅', '🥬'],
    },
    stats: [
      { emoji: '🌱', label: 'Seedlings', value: '4', color: GARDEN_GREEN },
      { emoji: '💧', label: 'Need Water', value: '1', color: WATER_BLUE },
      { emoji: '☀️', label: 'Days Active', value: '30', color: PETAL_YELLOW },
    ],
    seedlings: [
      { name: 'Cherry Tomato', stage: 'Germinating', daysOld: 5, emoji: '🍅' },
      { name: 'Sunflower', stage: 'Sprouting', daysOld: 3, emoji: '🌻' },
      { name: 'Zucchini', stage: 'First Leaves', daysOld: 9, emoji: '🥬' },
      { name: 'Kale', stage: 'Established', daysOld: 25, emoji: '🥬' },
    ],
    tip: {
      title: '🌸 Veggie Patch Tip',
      text: 'Rotate your vegetable crops each season to prevent soil depletion and reduce the build-up of pests and diseases.',
    },
    footerIcons: ['🪨', '🍅', '🪱', '🌽', '🪨'],
  },
  {
    id: 'flower-bed',
    name: 'Flower Bed',
    emoji: '🌸',
    description: 'Blooms and ornamental plants',
    header: {
      greeting: 'Good morning,',
      title: '🌸 Flower Bed',
      subtitle: 'Your flowers are blooming!',
      decorativeIcons: ['🌸', '🌼', '🌺', '💐', '🌸', '🌼'],
    },
    stats: [
      { emoji: '🌱', label: 'Seedlings', value: '5', color: GARDEN_GREEN },
      { emoji: '💧', label: 'Need Water', value: '3', color: WATER_BLUE },
      { emoji: '☀️', label: 'Days Active', value: '20', color: PETAL_YELLOW },
    ],
    seedlings: [
      { name: 'Lavender', stage: 'Established', daysOld: 30, emoji: '💜' },
      { name: 'Marigold', stage: 'Sprouting', daysOld: 7, emoji: '🌼' },
      { name: 'Petunia', stage: 'First Leaves', daysOld: 11, emoji: '🌸' },
      { name: 'Cosmos', stage: 'Germinating', daysOld: 4, emoji: '🌺' },
      { name: 'Zinnia', stage: 'Sprouting', daysOld: 8, emoji: '🌻' },
    ],
    tip: {
      title: '🌸 Flower Bed Tip',
      text: 'Deadhead spent blooms regularly to encourage your plants to produce more flowers throughout the season.',
    },
    footerIcons: ['🪨', '🌸', '🪱', '🌼', '🪨'],
  },
];
