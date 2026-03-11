/**
 * services/gridExport.ts
 *
 * Utilities for exporting a SeedlingGrid to a shareable file and importing
 * one back.
 *
 * Export: writes a `.seedgarden` JSON file to the app cache, then opens the
 *         native share/save sheet via expo-sharing so the user can save it to
 *         Files, AirDrop it, send it, etc.
 * Import: uses expo-document-picker to select a file, then reads it via
 *         fetch() (handles file:// URIs natively in React Native).
 */

import * as DocumentPicker from 'expo-document-picker';
import { cacheDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { SeedlingGrid } from '@/types/home';

// ─── Format ───────────────────────────────────────────────────────────────────

const FORMAT_VERSION = 1;

type GridExportFile = {
  version: number;
  exportedAt: string;
  /** Grid data without the local `id` — a new one is assigned on import. */
  grid: Omit<SeedlingGrid, 'id'>;
};

// ─── Export ───────────────────────────────────────────────────────────────────

/**
 * Serialises `grid` to a `.seedgarden` JSON file in the app cache directory,
 * then opens the native share/save sheet so the user can save or send it.
 *
 * Throws if sharing is unavailable or the file cannot be written.
 */
export async function exportGrid(grid: SeedlingGrid): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device.');
  }

  const { id: _id, ...gridData } = grid;

  const payload: GridExportFile = {
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    grid: gridData,
  };

  const json = JSON.stringify(payload, null, 2);
  const safeName = grid.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filePath = `${cacheDirectory}${safeName}.seedgarden`;

  await writeAsStringAsync(filePath, json, { encoding: 'utf8' });

  await Sharing.shareAsync(filePath, {
    mimeType: 'application/json',
    dialogTitle: `Save or share "${grid.name}"`,
    UTI: 'public.json',
  });
}

// ─── Import ───────────────────────────────────────────────────────────────────

export type ImportResult =
  | { ok: true; grid: Omit<SeedlingGrid, 'id'> }
  | { ok: false; reason: 'cancelled' | 'invalid' | 'error'; message?: string };

/**
 * Opens the system document picker, reads the selected file, validates its
 * structure, and returns the grid data ready to be passed to createGrid.
 *
 * Always resolves (never throws). Check `result.ok` to determine success.
 */
export async function importGridFromFile(): Promise<ImportResult> {
  let pickerResult: DocumentPicker.DocumentPickerResult;

  try {
    pickerResult = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
    });
  } catch {
    return { ok: false, reason: 'error', message: 'Could not open file picker.' };
  }

  if (pickerResult.canceled) {
    return { ok: false, reason: 'cancelled' };
  }

  const uri = pickerResult.assets[0]?.uri;
  if (!uri) {
    return { ok: false, reason: 'error', message: 'No file selected.' };
  }

  let raw: string;
  try {
    const response = await fetch(uri);
    raw = await response.text();
  } catch {
    return { ok: false, reason: 'error', message: 'Could not read the selected file.' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'invalid', message: 'File is not valid JSON.' };
  }

  const validated = validateExportFile(parsed);
  if (!validated) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'File does not appear to be a valid SeedlingTracker garden export.',
    };
  }

  return { ok: true, grid: validated.grid };
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateExportFile(data: unknown): GridExportFile | null {
  if (typeof data !== 'object' || data === null) return null;

  const obj = data as Record<string, unknown>;

  if (obj['version'] !== FORMAT_VERSION) return null;
  if (typeof obj['exportedAt'] !== 'string') return null;

  const grid = obj['grid'];
  if (typeof grid !== 'object' || grid === null) return null;

  const g = grid as Record<string, unknown>;

  const requiredStrings: (keyof SeedlingGrid)[] = ['name', 'emoji', 'description', 'createdAt'];
  for (const field of requiredStrings) {
    if (typeof g[field] !== 'string') return null;
  }

  if (typeof g['rows'] !== 'number' || typeof g['cols'] !== 'number') return null;

  if (!Array.isArray(g['seedlings'])) return null;
  if (!Array.isArray(g['gridCells'])) return null;
  if (!Array.isArray(g['stats'])) return null;
  if (!Array.isArray(g['footerIcons'])) return null;
  if (typeof g['header'] !== 'object' || g['header'] === null) return null;

  return data as GridExportFile;
}
