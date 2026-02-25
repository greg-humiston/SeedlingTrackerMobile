import type { SeedlingGrid } from '@/types/home';
import { SEEDLING_GRIDS } from '@/data/home';

// ─── Mock User ────────────────────────────────────────────────────────────────

export const MOCK_USER_ID = 'user-1';

// ─── In-Memory Store ──────────────────────────────────────────────────────────

// Keyed by userId → SeedlingGrid[]. Module-level singleton that persists for
// the lifetime of the JS runtime (i.e. the app session).
type DbStore = Map<string, SeedlingGrid[]>;

// Deep-clone seed data so that mutations never affect the original exported constant.
const db: DbStore = new Map([
  [
    MOCK_USER_ID,
    SEEDLING_GRIDS.map((g) => ({
      ...g,
      stats: [...g.stats],
      seedlings: [...g.seedlings],
      header: { ...g.header, decorativeIcons: [...g.header.decorativeIcons] },
      footerIcons: [...g.footerIcons],
    })),
  ],
]);

// ─── Read ─────────────────────────────────────────────────────────────────────

export function dbGetGridsByUser(userId: string): SeedlingGrid[] {
  return db.get(userId) ?? [];
}

export function dbGetGridById(userId: string, gridId: string): SeedlingGrid | null {
  const grids = db.get(userId) ?? [];
  return grids.find((g) => g.id === gridId) ?? null;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export function dbCreateGrid(userId: string, grid: SeedlingGrid): SeedlingGrid {
  const grids = db.get(userId) ?? [];
  db.set(userId, [...grids, grid]);
  return grid;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function dbUpdateGrid(
  userId: string,
  gridId: string,
  updates: Partial<Omit<SeedlingGrid, 'id'>>,
): SeedlingGrid {
  const grids = db.get(userId) ?? [];
  const index = grids.findIndex((g) => g.id === gridId);
  if (index === -1) throw new Error(`Grid "${gridId}" not found for user "${userId}".`);
  const updated: SeedlingGrid = { ...grids[index], ...updates };
  db.set(userId, grids.map((g, i) => (i === index ? updated : g)));
  return updated;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function dbDeleteGrid(userId: string, gridId: string): void {
  const grids = db.get(userId) ?? [];
  const next = grids.filter((g) => g.id !== gridId);
  if (next.length === grids.length) throw new Error(`Grid "${gridId}" not found for user "${userId}".`);
  db.set(userId, next);
}
