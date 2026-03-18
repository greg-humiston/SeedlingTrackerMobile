import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Seedling } from '@/types/home';
import { SEEDLINGS } from '@/data/seedlings';

const STORAGE_KEY = '@seedling_tracker/seedlings';

// ─── Write-Through Cache ──────────────────────────────────────────────────────

// In-memory array as a write-through cache — reads are instant after init;
// every mutation also writes through to AsyncStorage so data survives restarts.
let cache: Seedling[] | null = null;

// Single init promise; concurrent callers share the same read.
let initPromise: Promise<void> | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function persist(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('[seedlingDb] persist failed', e);
  }
}

function ensureInit(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        cache = JSON.parse(raw) as Seedling[];
      } else {
        // First run — seed with catalog data and persist immediately.
        cache = [...SEEDLINGS];
        await persist();
      }
    } catch (e) {
      console.warn('[seedlingDb] init failed, falling back to seed data', e);
      cache = [...SEEDLINGS];
    }
  })();
  return initPromise;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function dbGetSeedlings(): Promise<Seedling[]> {
  await ensureInit();
  return cache!;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function dbAddSeedling(seedling: Seedling): Promise<Seedling> {
  await ensureInit();
  cache = [...cache!, seedling];
  await persist();
  return seedling;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function dbUpdateSeedling(id: number, updates: Partial<Seedling>): Promise<Seedling> {
  await ensureInit();
  const idx = cache!.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error(`Seedling ${id} not found`);
  cache![idx] = { ...cache![idx], ...updates };
  await persist();
  return cache![idx];
}

// ─── ID Utility ───────────────────────────────────────────────────────────────

export async function dbNextSeedlingId(): Promise<number> {
  await ensureInit();
  if (!cache || cache.length === 0) return 1;
  return Math.max(...cache.map((s) => s.id)) + 1;
}
