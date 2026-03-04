import type { Seedling } from '@/types/home';
import { dbGetSeedlings, dbAddSeedling, dbNextSeedlingId } from '@/services/seedlingDb';

// ─── Delay Simulation ─────────────────────────────────────────────────────────

const LATENCY_MS = 300;
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getSeedlings(): Promise<Seedling[]> {
  await delay(LATENCY_MS);
  return dbGetSeedlings();
}

export async function addSeedling(seedling: Seedling): Promise<Seedling> {
  await delay(LATENCY_MS);
  return dbAddSeedling(seedling);
}

export async function nextSeedlingId(): Promise<number> {
  return dbNextSeedlingId();
}
