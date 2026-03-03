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
  name: string;
  stage: string;
  daysOld: number;
  emoji: string;
};

export type Tip = {
  title: string;
  text: string;
};

export type SeedlingGrid = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  header: Header;
  stats: Stat[];
  seedlings: Seedling[];
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
  gridCells: (Seedling | null)[];
};
