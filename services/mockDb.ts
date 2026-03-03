import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SeedlingGrid } from '@/types/home';
import { SEEDLING_GRIDS } from '@/data/home';

// ─── Mock User ────────────────────────────────────────────────────────────────

export const MOCK_USER_ID = 'user-1';
const STORAGE_KEY = '@seedling_tracker/grids';

// ─── Write-Through Cache ──────────────────────────────────────────────────────

// In-memory Map as a write-through cache — reads are instant after init;
// every mutation also writes through to AsyncStorage so data survives restarts.
type DbStore = Map<string, SeedlingGrid[]>;
const db: DbStore = new Map();

// Single init promise; concurrent callers share the same read.
let initPromise: Promise<void> | null = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function seedClone(): SeedlingGrid[] {
  return SEEDLING_GRIDS.map((g) => ({
    ...g,
    stats: [...g.stats],
    seedlings: [...g.seedlings],
    header: { ...g.header, decorativeIcons: [...g.header.decorativeIcons] },
    footerIcons: [...g.footerIcons],
  }));
}

async function persist(): Promise<void> {
  try {
    const plain: Record<string, SeedlingGrid[]> = {};
    db.forEach((grids, userId) => { plain[userId] = grids; });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plain));
  } catch (e) {
    console.warn('[mockDb] persist failed', e);
  }
}

function ensureInit(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, SeedlingGrid[]>;
        for (const [userId, grids] of Object.entries(parsed)) {
          db.set(userId, grids);
        }
      } else {
        // First run — seed with initial data and persist immediately.
        db.set(MOCK_USER_ID, seedClone());
        await persist();
      }
    } catch (e) {
      console.warn('[mockDb] init failed, falling back to seed data', e);
      db.set(MOCK_USER_ID, seedClone());
    }
  })();
  return initPromise;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function dbGetGridsByUser(userId: string): Promise<SeedlingGrid[]> {
  await ensureInit();
  return db.get(userId) ?? [];
}

export async function dbGetGridById(userId: string, gridId: string): Promise<SeedlingGrid | null> {
  await ensureInit();
  return (db.get(userId) ?? []).find((g) => g.id === gridId) ?? null;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function dbCreateGrid(userId: string, grid: SeedlingGrid): Promise<SeedlingGrid> {
  await ensureInit();
  db.set(userId, [...(db.get(userId) ?? []), grid]);
  await persist();
  return grid;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function dbUpdateGrid(
  userId: string,
  gridId: string,
  updates: Partial<Omit<SeedlingGrid, 'id'>>,
): Promise<SeedlingGrid> {
  await ensureInit();
  const grids = db.get(userId) ?? [];
  const index = grids.findIndex((g) => g.id === gridId);
  if (index === -1) throw new Error(`Grid "${gridId}" not found for user "${userId}".`);
  const updated: SeedlingGrid = { ...grids[index], ...updates };
  db.set(userId, grids.map((g, i) => (i === index ? updated : g)));
  await persist();
  return updated;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function dbDeleteGrid(userId: string, gridId: string): Promise<void> {
  await ensureInit();
  const grids = db.get(userId) ?? [];
  const next = grids.filter((g) => g.id !== gridId);
  if (next.length === grids.length) throw new Error(`Grid "${gridId}" not found for user "${userId}".`);
  db.set(userId, next);
  await persist();
}
