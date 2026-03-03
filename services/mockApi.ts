import type { SeedlingGrid } from '@/types/home';
import {
  MOCK_USER_ID,
  dbGetGridsByUser,
  dbGetGridById,
  dbCreateGrid,
  dbUpdateGrid,
  dbDeleteGrid,
} from '@/services/mockDb';

// ─── Delay Simulation ─────────────────────────────────────────────────────────

const LATENCY_MS = 300;
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getGridsByUser(userId: string): Promise<SeedlingGrid[]> {
  await delay(LATENCY_MS);
  return dbGetGridsByUser(userId);
}

export async function getGridById(userId: string, gridId: string): Promise<SeedlingGrid | null> {
  await delay(LATENCY_MS);
  return dbGetGridById(userId, gridId);
}

export async function createGrid(
  userId: string,
  grid: Omit<SeedlingGrid, 'id'> & { id?: string },
): Promise<SeedlingGrid> {
  await delay(LATENCY_MS);
  const newGrid: SeedlingGrid = {
    ...grid,
    id: grid.id ?? `grid-${Date.now()}`,
  };
  return dbCreateGrid(userId, newGrid);
}

export async function updateGrid(
  userId: string,
  gridId: string,
  updates: Partial<Omit<SeedlingGrid, 'id'>>,
): Promise<SeedlingGrid> {
  await delay(LATENCY_MS);
  return dbUpdateGrid(userId, gridId, updates);
}

export async function deleteGrid(userId: string, gridId: string): Promise<void> {
  await delay(LATENCY_MS);
  await dbDeleteGrid(userId, gridId);
}

// Re-export MOCK_USER_ID for convenience so callers only need one import.
export { MOCK_USER_ID };
