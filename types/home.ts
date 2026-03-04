export type Header = {
  greeting: string;
  title: string;
  subtitle: string;
  decorativeIcons: string[];
};

export type Stat = {
  emoji: string;
  label: string;
  value: string;
  color: string;
};

export type Seedling = {
  id: number;
  variety: string;
  type: string;
  emoji: string;
  whereToStart: string;
  whenToStart: string;
  soilTemperatureForGermination: string;
  spacing: string;
  depth: string;
  daysToGerminate: string;
  wateringFrequency: string;
  season: string;
  frostTolerance: boolean;
  height: string;
  daysToHarvest: string;
  soilAcidity: string;
};

export type SelectedSeedling = Seedling & {
  stage: string;
  /** ISO 8601 date the seedling was first planted. */
  plantedAt?: string;
  /** ISO 8601 date the seedling was last watered. */
  lastWateredAt?: string;
};

/**
 * Draft form state for creating a custom seedling.
 * All string fields start as '' and frostTolerance starts as null
 * (null means the user has not yet made a selection).
 */
export type DraftSeedling = {
  variety: string;
  type: string;
  emoji: string;
  whereToStart: string;
  whenToStart: string;
  soilTemperatureForGermination: string;
  spacing: string;
  depth: string;
  daysToGerminate: string;
  wateringFrequency: string;
  season: string;
  frostTolerance: boolean | null;
  height: string;
  daysToHarvest: string;
  soilAcidity: string;
};

export type Tip = {
  title: string;
  text: string;
};

export type SeedlingGrid = {
  id: string;
  /** ISO 8601 date string set when the grid is first created. */
  createdAt: string;
  name: string;
  emoji: string;
  description: string;
  header: Header;
  stats: Stat[];
  seedlings: SelectedSeedling[];
  tip: Tip;
  footerIcons: string[];
  /** Number of columns in the 2-D grid layout. */
  cols: number;
  /** Number of rows in the 2-D grid layout. */
  rows: number;
  /**
   * Flat representation of the 2-D grid (length === rows * cols).
   * null entries are empty cells; non-null entries are placed seedlings.
   * Index formula: row * cols + col.
   */
  gridCells: (SelectedSeedling | null)[];
};
