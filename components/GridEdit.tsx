/**
 * GridEdit — interactive 2-D grid editor.
 *
 * Wraps the drag-and-drop / tap-to-select cell grid together with a
 * SeedlingSelector for adding new seedlings and a "Remove" button for
 * removing the currently selected cell.
 *
 * This is a controlled component: `cells` and `seedlings` are owned by
 * the parent. Every mutation calls `onChange(newCells, newSeedlings)` so
 * the parent can update its state and re-render.
 */

import SeedlingSelector from '@/components/SeedlingSelector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EMOJI_MAP, EMOJI_SEEDLING } from '@/constants/icons';
import { styles } from '@/styles/create-grid';
import type { Seedling, SelectedSeedling } from '@/types/home';
import { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Ref shape for a cell View — used for screen-space hit detection during drag. */
export type CellRef = {
  measure: (
    cb: (fx: number, fy: number, w: number, h: number, px: number, py: number) => void,
  ) => void;
} | null;

// ─── DraggableCell ────────────────────────────────────────────────────────────

type DraggableCellProps = {
  index: number;
  cell: SelectedSeedling;
  isSelected: boolean;
  cellRefs: React.MutableRefObject<CellRef[]>;
  onDragEnd: (fromIndex: number, absoluteX: number, absoluteY: number) => void;
  onDragStart: () => void;
  onTap: (index: number) => void;
};

function DraggableCell({
  index, cell, isSelected, cellRefs, onDragEnd, onDragStart, onTap,
}: DraggableCellProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale      = useSharedValue(1);

  const tap = Gesture.Tap()
    .maxDuration(500)
    .onEnd(() => { runOnJS(onTap)(index); });

  const pan = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.1);
      runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      runOnJS(onDragEnd)(index, event.absoluteX, event.absoluteY);
    })
    .onFinalize(() => {
      scale.value      = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const gesture = Gesture.Race(tap, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: scale.value > 1 ? 9999 : 1,
    shadowOpacity: scale.value > 1 ? 0.2 : 0,
    shadowRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    elevation: scale.value > 1 ? 999 : 0,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={(r) => { cellRefs.current[index] = r as unknown as CellRef; }}
        style={[styles.cell, styles.cellOccupied, isSelected && styles.cellSelected, animatedStyle]}
      >
        <ThemedText style={styles.cellEmoji}>{cell.emoji}</ThemedText>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── EmptyCell ────────────────────────────────────────────────────────────────

function EmptyCell({
  index,
  cellRefs,
  onTap,
}: {
  index: number;
  cellRefs: React.MutableRefObject<CellRef[]>;
  onTap: (index: number) => void;
}) {
  return (
    <TouchableOpacity
      ref={(r) => { cellRefs.current[index] = r as unknown as CellRef; }}
      style={[styles.cell, styles.cellEmpty]}
      onPress={() => onTap(index)}
      activeOpacity={0.7}
    />
  );
}

// ─── GridEdit ─────────────────────────────────────────────────────────────────

export type GridEditProps = {
  rows: number;
  cols: number;
  cells: (SelectedSeedling | null)[];
  seedlings: SelectedSeedling[];
  onChange: (newCells: (SelectedSeedling | null)[], newSeedlings: SelectedSeedling[]) => void;
};

export default function GridEdit({ rows, cols, cells, seedlings, onChange }: GridEditProps) {
  const cellRefs = useRef<CellRef[]>([]);
  const trashRef = useRef<CellRef>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Derive the canonical seedlings list from a cells array. */
  function deriveSeedlings(newCells: (SelectedSeedling | null)[]): SelectedSeedling[] {
    const seen = new Set<string>();
    const result: SelectedSeedling[] = [];
    for (const c of newCells) {
      if (c && !seen.has(c.variety)) {
        seen.add(c.variety);
        result.push(c);
      }
    }
    return result;
  }

  // ── Tap-to-select / swap ─────────────────────────────────────────────────

  const handleCellTap = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (index === selectedIndex) {
      setSelectedIndex(null);
    } else {
      const next = [...cells];
      const temp        = next[selectedIndex];
      next[selectedIndex] = next[index];
      next[index]         = temp;
      setSelectedIndex(null);
      onChange(next, deriveSeedlings(next));
    }
  };

  const handleEmptyTap = (index: number) => {
    if (selectedIndex === null) return;
    const next = [...cells];
    const temp          = next[selectedIndex];
    next[selectedIndex] = next[index];
    next[index]         = temp;
    setSelectedIndex(null);
    onChange(next, deriveSeedlings(next));
  };

  // ── Drag-and-drop ────────────────────────────────────────────────────────

  const doSwap = (fromIndex: number, absoluteX: number, absoluteY: number) => {
    const total = cellRefs.current.length;
    if (total === 0) return;

    let remaining = total;
    let toIndex: number | null = null;

    const checkDone = () => {
      remaining -= 1;
      if (remaining > 0) return;
      if (toIndex === null || toIndex === fromIndex) return;
      const next = [...cells];
      const temp      = next[fromIndex];
      next[fromIndex] = next[toIndex!];
      next[toIndex!]  = temp;
      onChange(next, deriveSeedlings(next));
    };

    cellRefs.current.forEach((ref, i) => {
      if (!ref) { remaining -= 1; return; }
      ref.measure((_fx, _fy, width, height, pageX, pageY) => {
        if (
          absoluteX >= pageX && absoluteX <= pageX + width &&
          absoluteY >= pageY && absoluteY <= pageY + height
        ) {
          toIndex = i;
        }
        checkDone();
      });
    });
  };

  const handleDragEnd = (fromIndex: number, absoluteX: number, absoluteY: number) => {
    setIsDragging(false);

    if (!trashRef.current) {
      doSwap(fromIndex, absoluteX, absoluteY);
      return;
    }

    trashRef.current.measure((_fx, _fy, w, h, px, py) => {
      if (absoluteX >= px && absoluteX <= px + w && absoluteY >= py && absoluteY <= py + h) {
        const next = [...cells];
        next[fromIndex] = null;
        onChange(next, deriveSeedlings(next));
      } else {
        doSwap(fromIndex, absoluteX, absoluteY);
      }
    });
  };

  // ── Add seedling ─────────────────────────────────────────────────────────

  const handleAddSeedling = (seedling: Seedling) => {
    const firstEmpty = cells.findIndex((c) => c === null);
    if (firstEmpty === -1) return; // grid full — SeedlingSelector won't show if full

    const placed: SelectedSeedling = {
      ...seedling,
      stage: 'Germinating',
      plantedAt: new Date().toISOString(),
    };

    const next = [...cells];
    next[firstEmpty] = placed;
    onChange(next, deriveSeedlings(next));
  };

  // ── Remove selected ──────────────────────────────────────────────────────

  const handleRemove = () => {
    if (selectedIndex === null) return;
    const next = [...cells];
    next[selectedIndex] = null;
    setSelectedIndex(null);
    onChange(next, deriveSeedlings(next));
  };

  // ── Derived ──────────────────────────────────────────────────────────────

  const totalCells    = rows * cols;
  const seedlingCount = cells.filter(Boolean).length;
  const gridFull      = seedlingCount === totalCells;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View>
      {/* Add Seedling */}
      {!gridFull && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{EMOJI_SEEDLING} Add a Seedling</ThemedText>
          <SeedlingSelector onSelect={handleAddSeedling} />
        </ThemedView>
      )}
      {/* Grid */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{EMOJI_MAP} Grid Preview</ThemedText>
        <ThemedText style={[styles.cellCountHint, { marginBottom: 8 }]}>
          Tap to select · Tap another to swap · Drag to rearrange
        </ThemedText>
        <View style={[styles.gridContainer, isDragging && { zIndex: 20, elevation: 20 }]}>
          {Array.from({ length: rows }).map((_, r) => (
            <View key={r} style={styles.gridRow}>
              {Array.from({ length: cols }).map((_, c) => {
                const idx  = r * cols + c;
                const cell = cells[idx] ?? null;
                return cell ? (
                  <DraggableCell
                    key={`${idx}-${cell.variety}`}
                    index={idx}
                    cell={cell}
                    isSelected={selectedIndex === idx}
                    cellRefs={cellRefs}
                    onDragEnd={handleDragEnd}
                    onDragStart={() => { setSelectedIndex(null); setIsDragging(true); }}
                    onTap={handleCellTap}
                  />
                ) : (
                  <EmptyCell
                    key={idx}
                    index={idx}
                    cellRefs={cellRefs}
                    onTap={handleEmptyTap}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* Trash drop zone — drag to drop, or tap when a cell is selected */}
        <TouchableOpacity
          ref={(r) => { trashRef.current = r as unknown as CellRef; }}
          style={[
            styles.trashZone,
            isDragging && styles.trashZoneActive,
            selectedIndex !== null && cells[selectedIndex] !== null && styles.trashZoneActive,
          ]}
          onPress={handleRemove}
          activeOpacity={0.75}
        >
          <ThemedText style={styles.trashZoneText}>🗑</ThemedText>
          <ThemedText style={styles.trashZoneText}>
            {isDragging ? 'Drop here to remove' : 'Drag or tap to remove'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}
