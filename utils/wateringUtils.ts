import type { SelectedSeedling, SeedlingGrid } from '@/types/home';

/**
 * Parse a watering frequency text description into an approximate number of
 * days between waterings.
 */
export function parseWateringDays(wateringFrequency: string): number {
  const f = wateringFrequency.toLowerCase();
  if (f.includes('daily') || f.includes('every day')) return 1;
  if (f.includes('twice')) return 2;
  if (f.includes('per week') || f.includes('weekly') || f.includes('once a week')) return 7;
  if (f.includes('consistently moist') || f.includes('evenly moist')) return 2;
  if (f.includes('moist')) return 3;
  return 3;
}

/** Returns true when a seedling is overdue for watering. */
export function seedlingNeedsWater(seedling: SelectedSeedling): boolean {
  if (!seedling.lastWateredAt) return true;
  const dayInterval = parseWateringDays(seedling.wateringFrequency);
  const msSinceWatered = Date.now() - new Date(seedling.lastWateredAt).getTime();
  const daysSinceWatered = msSinceWatered / 86_400_000;
  return daysSinceWatered >= dayInterval;
}

/** Returns the set of gridCell indices that are overdue for watering. */
export function getCellIndicesNeedingWater(
  cells: (SelectedSeedling | null)[],
): Set<number> {
  const result = new Set<number>();
  cells.forEach((cell, i) => {
    if (cell && seedlingNeedsWater(cell)) result.add(i);
  });
  return result;
}

/** Returns only grids that have at least one seedling overdue for watering. */
export function getGridsNeedingWater(grids: SeedlingGrid[]): SeedlingGrid[] {
  return grids.filter((g) => g.gridCells.some((c) => c && seedlingNeedsWater(c)));
}

/** Count how many cells in a grid are overdue for watering. */
export function countCellsNeedingWater(cells: (SelectedSeedling | null)[]): number {
  return cells.filter((c) => c && seedlingNeedsWater(c)).length;
}
