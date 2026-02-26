/**
 * SeedlingGridPreview
 *
 * Read-only 2-D grid display.  Renders occupied cells (with emoji, name and
 * stage badge) alongside dashed empty-cell placeholders.  Scrolls horizontally
 * when the grid is wider than the screen.
 *
 * This component is intentionally presentation-only — it does not support
 * drag-and-drop.  The editable variant in create_grid.tsx wraps this concept
 * with gesture handlers during grid creation.
 */

import { ThemedText } from '@/components/themed-text';
import { LEAF_GREEN, LIGHT_GREEN } from '@/data/home';
import type { Seedling } from '@/types/home';
import { ScrollView, StyleSheet, View } from 'react-native';

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_SIZE = 72;
const CELL_GAP  = 8; // 4px margin on each side

// ─── Sub-components ───────────────────────────────────────────────────────────

function OccupiedCell({ seedling }: { seedling: Seedling }) {
  return (
    <View style={[styles.cell, styles.cellOccupied]}>
      <ThemedText style={styles.cellEmoji}>{seedling.emoji}</ThemedText>
      <ThemedText style={styles.cellName} numberOfLines={1}>
        {seedling.name}
      </ThemedText>
      <View style={styles.cellStageBadge}>
        <ThemedText style={styles.cellStageBadgeText}>
          {seedling.stage.split(' ')[0]}
        </ThemedText>
      </View>
    </View>
  );
}

function EmptyCell() {
  return <View style={[styles.cell, styles.cellEmpty]} />;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type SeedlingGridPreviewProps = {
  rows: number;
  cols: number;
  /** Flat cells array (length === rows * cols). null = empty cell. */
  gridCells: (Seedling | null)[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SeedlingGridPreview({
  rows,
  cols,
  gridCells,
}: SeedlingGridPreviewProps) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={[
        styles.scrollContent,
        { width: cols * (CELL_SIZE + CELL_GAP) + CELL_GAP },
      ]}
      showsHorizontalScrollIndicator={false}
    >
      <View>
        {Array.from({ length: rows }).map((_, r) => (
          <View key={r} style={styles.row}>
            {Array.from({ length: cols }).map((_, c) => {
              const idx      = r * cols + c;
              const seedling = gridCells[idx] ?? null;
              return seedling ? (
                <OccupiedCell key={idx} seedling={seedling} />
              ) : (
                <EmptyCell key={idx} />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: CELL_GAP / 2,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellOccupied: {
    backgroundColor: '#F0F7F2',
    borderWidth: 2,
    borderColor: '#D6EAD9',
  },
  cellEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#C8D8CC',
    borderStyle: 'dashed',
  },
  cellEmoji: {
    fontSize: 26,
    marginBottom: 2,
  },
  cellName: {
    fontSize: 9,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  cellStageBadge: {
    marginTop: 2,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  cellStageBadgeText: {
    fontSize: 7,
    fontWeight: '700',
    color: LEAF_GREEN,
  },
});
