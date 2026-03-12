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
  EMOJI_SUN,
  EMOJI_SUNFLOWER,
  EMOJI_TOMATO,
  EMOJI_WATER,
  EMOJI_WORM,
  FOOTER_SOIL,
} from '@/constants/icons';
import type { Header, SeedlingGrid, SelectedSeedling, Stat, Tip } from '@/types/home';

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

// ─── Tip of the Day ───────────────────────────────────────────────────────────
export const TIP: Tip = {
  title: `${EMOJI_FLOWER_PINK} Garden Tip of the Day`,
  text: 'Water your seedlings in the early morning to reduce evaporation and prevent fungal growth. Keep the soil moist but never waterlogged!',
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_ICONS: string[] = FOOTER_SOIL;

// ─── Seedling Grids ───────────────────────────────────────────────────────────

// Reusable SelectedSeedling entries (Seedling fields + stage/plantedAt/lastWateredAt)
// TODO: remove redundant spaces bellow
const HG_BASIL:    SelectedSeedling = { id: 1,  variety: 'Sweet Basil', type: 'Herb',        emoji: EMOJI_HERB,         whereToStart: 'Indoors',                              whenToStart: '2-4 weeks before last frost',                           soilTemperatureForGermination: '70-84', spacing: '6-12 inches',  depth: '1/4 inch',                              daysToGerminate: '5-10',  wateringFrequency: 'Keep soil moist, water when top inch is dry',               season: 'Warm', frostTolerance: false, height: '12-24 inches', daysToHarvest: '60-90',  soilAcidity: '6.0-7.5 pH', stage: 'First Leaves', plantedAt: '2024-12-20', lastWateredAt: '2024-12-31' };
const HG_MINT:     SelectedSeedling = { id: 8,  variety: 'Mint',        type: 'Herb',        emoji: EMOJI_HERB,         whereToStart: 'Indoors or Outdoors',                  whenToStart: 'Spring, after last frost',                              soilTemperatureForGermination: '64-75',  spacing: '12-18 inches', depth: '1/8 inch',                              daysToGerminate: '10-16', wateringFrequency: 'Keep soil consistently moist',                              season: 'Cool to Warm', frostTolerance: false, height: '1-2 feet', daysToHarvest: '90', soilAcidity: '6.0-7.0 pH', stage: 'First Leaves', plantedAt: '2024-12-24', lastWateredAt: '2024-12-30' };
const HG_ROSEMARY: SelectedSeedling = { id: 9,  variety: 'Rosemary',    type: 'Herb',        emoji: EMOJI_HERB,         whereToStart: 'Indoors',                              whenToStart: '10-12 weeks before last frost',                         soilTemperatureForGermination: '59-70',  spacing: '18-24 inches', depth: '1/8 inch',                              daysToGerminate: '14-21', wateringFrequency: 'Water when top 2 inches of soil are dry',                   season: 'Warm', frostTolerance: false, height: '2-4 feet', daysToHarvest: '90-180', soilAcidity: '6.0-7.0 pH', stage: 'Germinating',  plantedAt: '2024-12-30', lastWateredAt: '2024-12-30' };
const HG_THYME:    SelectedSeedling = { id: 26, variety: 'Thyme',       type: 'Herb',        emoji: EMOJI_HERB,         whereToStart: 'Indoors',                              whenToStart: '6-10 weeks before last frost',                          soilTemperatureForGermination: '64-70',  spacing: '6-12 inches',  depth: '1/8 inch',                              daysToGerminate: '14-28', wateringFrequency: 'Water when soil is dry; drought tolerant once established', season: 'Warm', frostTolerance: true,  height: '6-12 inches', daysToHarvest: '75-90',  soilAcidity: '6.0-8.0 pH', stage: 'Sprouting',    plantedAt: '2024-12-26', lastWateredAt: '2024-12-31' };
const HG_PARSLEY:  SelectedSeedling = { id: 11, variety: 'Parsley',     type: 'Herb',        emoji: EMOJI_LEAF,         whereToStart: 'Indoors',                              whenToStart: '8-10 weeks before last frost',                          soilTemperatureForGermination: '50-75',  spacing: '6-8 inches',   depth: '1/4 inch',                              daysToGerminate: '14-28', wateringFrequency: 'Keep soil moist, water when top inch is dry',               season: 'Cool', frostTolerance: true,  height: '12-18 inches', daysToHarvest: '70-90', soilAcidity: '6.0-7.0 pH', stage: 'Germinating',  plantedAt: '2024-12-29', lastWateredAt: '2024-12-29' };
const HG_CHIVES:   SelectedSeedling = { id: 10, variety: 'Chives',      type: 'Herb',        emoji: EMOJI_SEEDLING,     whereToStart: 'Indoors or Outdoors',                  whenToStart: '6-8 weeks before last frost',                           soilTemperatureForGermination: '59-70',  spacing: '4-6 inches',   depth: '1/4 inch',                              daysToGerminate: '7-14',  wateringFrequency: 'Water regularly, keep soil evenly moist',                   season: 'Cool', frostTolerance: true,  height: '8-20 inches', daysToHarvest: '60-90',  soilAcidity: '6.0-7.0 pH', stage: 'Established',  plantedAt: '2024-12-11', lastWateredAt: '2024-12-28' };

const VP_TOMATO:   SelectedSeedling = { id: 2,  variety: 'Cherry Tomato', type: 'Vegetable', emoji: EMOJI_TOMATO,       whereToStart: 'Indoors',                              whenToStart: '6-8 weeks before last frost',                           soilTemperatureForGermination: '68-77',  spacing: '18-24 inches', depth: '1/4 inch',                              daysToGerminate: '5-10',  wateringFrequency: 'Water deeply and regularly, keep soil consistently moist',  season: 'Warm', frostTolerance: false, height: '3-6 feet (with support)', daysToHarvest: '60-80', soilAcidity: '6.0-6.8 pH', stage: 'Germinating',  plantedAt: '2024-12-27', lastWateredAt: '2024-12-31' };
const VP_SUNFLOWER:SelectedSeedling = { id: 21, variety: 'Sunflower',     type: 'Flower',    emoji: EMOJI_SUNFLOWER,   whereToStart: 'Indoors or Outdoors',                  whenToStart: 'After last frost',                                      soilTemperatureForGermination: '70-86',  spacing: '6-24 inches',  depth: '1 inch',                                daysToGerminate: '7-14',  wateringFrequency: 'Water deeply but infrequently, about 1 inch per week',      season: 'Warm', frostTolerance: false, height: '2-12 feet', daysToHarvest: '70-100', soilAcidity: '6.0-7.5 pH', stage: 'Sprouting',    plantedAt: '2024-12-29', lastWateredAt: '2024-12-31' };
const VP_ZUCCHINI: SelectedSeedling = { id: 15, variety: 'Zucchini',      type: 'Vegetable', emoji: EMOJI_LEAFY,        whereToStart: 'Indoors or Outdoors',                  whenToStart: '3-4 weeks before last frost',                           soilTemperatureForGermination: '70-90',  spacing: '24-36 inches', depth: '1 inch',                                daysToGerminate: '7-14',  wateringFrequency: 'Water deeply, 1-2 inches per week',                         season: 'Warm', frostTolerance: false, height: '2-4 feet', daysToHarvest: '50-70',  soilAcidity: '6.0-7.5 pH', stage: 'First Leaves', plantedAt: '2024-12-23', lastWateredAt: '2024-12-30' };
const VP_KALE:     SelectedSeedling = { id: 7,  variety: 'Kale',          type: 'Leafy Green',emoji: EMOJI_LEAFY,        whereToStart: 'Indoors or Outdoors',                  whenToStart: '4-6 weeks before last frost',                           soilTemperatureForGermination: '39-75',   spacing: '12-18 inches', depth: '1/2 inch',                              daysToGerminate: '5-10',  wateringFrequency: 'Keep soil moist, water when top inch is dry',               season: 'Cool', frostTolerance: true,  height: '1-3 feet', daysToHarvest: '55-75',  soilAcidity: '6.0-7.5 pH', stage: 'Established',  plantedAt: '2024-12-07', lastWateredAt: '2024-12-29' };

const FB_LAVENDER: SelectedSeedling = { id: 3,  variety: 'Lavender', type: 'Flower',         emoji: EMOJI_LAVENDER,     whereToStart: 'Indoors',                              whenToStart: '6-8 weeks before last frost',                           soilTemperatureForGermination: '59-70',  spacing: '12-18 inches', depth: '1/8 inch',                              daysToGerminate: '14-28', wateringFrequency: 'Water when top inch of soil is dry, avoid overwatering',   season: 'Warm', frostTolerance: false, height: '1-3 feet', daysToHarvest: '90-120', soilAcidity: '6.5-7.5 pH', stage: 'Established',  plantedAt: '2024-12-02', lastWateredAt: '2024-12-28' };
const FB_MARIGOLD: SelectedSeedling = { id: 20, variety: 'Marigold', type: 'Flower',         emoji: EMOJI_FLOWER_YELLOW, whereToStart: 'Indoors or Outdoors',                 whenToStart: '6-8 weeks before last frost',                           soilTemperatureForGermination: '70-84',  spacing: '6-12 inches',  depth: '1/8 inch',                              daysToGerminate: '5-7',   wateringFrequency: 'Water when top inch is dry, avoid overwatering',            season: 'Warm', frostTolerance: false, height: '6-24 inches', daysToHarvest: '50-70', soilAcidity: '6.0-7.0 pH', stage: 'Sprouting',    plantedAt: '2024-12-25', lastWateredAt: '2024-12-30' };
const FB_PETUNIA:  SelectedSeedling = { id: 55, variety: 'Petunia',  type: 'Flower',         emoji: EMOJI_FLOWER_PINK,  whereToStart: 'Indoors',                              whenToStart: '10-12 weeks before last frost',                         soilTemperatureForGermination: '55-64',  spacing: '6-12 inches',  depth: 'Surface sow (needs light to germinate)', daysToGerminate: '7-21',  wateringFrequency: 'Water regularly at base, about 1 inch per week',            season: 'Warm', frostTolerance: false, height: '6-18 inches', daysToHarvest: '60-90', soilAcidity: '6.0-7.0 pH', stage: 'First Leaves', plantedAt: '2024-12-21', lastWateredAt: '2024-12-31' };
const FB_COSMOS:   SelectedSeedling = { id: 23, variety: 'Cosmos',   type: 'Flower',         emoji: EMOJI_FLOWER_PINK,  whereToStart: 'Indoors or Outdoors',                  whenToStart: '4-6 weeks before last frost or direct sow after frost', soilTemperatureForGermination: '70-84',  spacing: '9-18 inches',  depth: '1/4 inch',                              daysToGerminate: '7-10',  wateringFrequency: 'Water when top 2 inches are dry, avoid overwatering',       season: 'Warm', frostTolerance: false, height: '1-4 feet', daysToHarvest: '60-90',  soilAcidity: '6.0-7.0 pH', stage: 'Germinating',  plantedAt: '2024-12-28', lastWateredAt: '2024-12-30' };
const FB_ZINNIA:   SelectedSeedling = { id: 22, variety: 'Zinnia',   type: 'Flower',         emoji: EMOJI_FLOWER_RED,   whereToStart: 'Indoors or Outdoors',                  whenToStart: 'After last frost',                                      soilTemperatureForGermination: '70-84',  spacing: '6-18 inches',  depth: '1/4 inch',                              daysToGerminate: '5-7',   wateringFrequency: 'Water at the base, about 1 inch per week',                  season: 'Warm', frostTolerance: false, height: '1-4 feet', daysToHarvest: '60-70',  soilAcidity: '5.5-7.0 pH', stage: 'Sprouting',    plantedAt: '2024-12-24', lastWateredAt: '2024-12-29' };

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
    seedlings:  [HG_BASIL, HG_MINT, HG_ROSEMARY, HG_THYME, HG_PARSLEY, HG_CHIVES],
    tip: {
      title: `${EMOJI_FLOWER_PINK} Herb Garden Tip`,
      text: 'Pinch off flower buds on basil to keep leaves growing strong and prevent the plant from going to seed too early.',
    },
    footerIcons: FOOTER_SOIL,
    // 3 × 2 layout — all 6 cells filled
    cols: 3,
    rows: 2,
    gridCells:  [HG_BASIL, HG_MINT, HG_ROSEMARY, HG_THYME, HG_PARSLEY, HG_CHIVES],
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
    seedlings:  [VP_TOMATO, VP_SUNFLOWER, VP_ZUCCHINI, VP_KALE],
    tip: {
      title: `${EMOJI_FLOWER_PINK} Veggie Patch Tip`,
      text: 'Rotate your vegetable crops each season to prevent soil depletion and reduce the build-up of pests and diseases.',
    },
    footerIcons: [EMOJI_ROCK, EMOJI_TOMATO, EMOJI_WORM, EMOJI_CORN, EMOJI_ROCK],
    // 2 × 2 layout — all 4 cells filled
    cols: 2,
    rows: 2,
    gridCells:  [VP_TOMATO, VP_SUNFLOWER, VP_ZUCCHINI, VP_KALE],
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
      { emoji: EMOJI_SEEDLING, label: 'Seedlings',   value: '5',  color: GARDEN_GREEN },
      { emoji: EMOJI_WATER,    label: 'Need Water',  value: '3',  color: WATER_BLUE   },
      { emoji: EMOJI_SUN,      label: 'Days Active', value: '20', color: PETAL_YELLOW },
    ],
    seedlings:  [FB_LAVENDER, FB_MARIGOLD, FB_PETUNIA, FB_COSMOS, FB_ZINNIA],
    tip: {
      title: `${EMOJI_FLOWER_PINK} Flower Bed Tip`,
      text: 'Deadhead spent blooms regularly to encourage your plants to produce more flowers throughout the season.',
    },
    footerIcons: [EMOJI_ROCK, EMOJI_FLOWER_PINK, EMOJI_WORM, EMOJI_FLOWER_YELLOW, EMOJI_ROCK],
    // 3 × 2 layout — 5 seedlings, last cell empty
    cols: 3,
    rows: 2,
    gridCells:  [FB_LAVENDER, FB_MARIGOLD, FB_PETUNIA, FB_COSMOS, FB_ZINNIA, null],
  },
];
