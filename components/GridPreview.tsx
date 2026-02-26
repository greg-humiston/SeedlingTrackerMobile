/**
 * GridPreview
 *
 * Interactive 2-D grid renderer shared between the grid-creation screen and
 * the garden detail screen.
 *
 * - canEdit={true} (default): drag-and-drop is active; pass `cellRefs` and
 *   `onDragEnd` so the parent can update cell order on drop.
 * - canEdit={false}: gestures are disabled and cells render as static views.
 *
 * The `cells` prop accepts any object with `name`, `emoji`, and `stage` fields
 * so it works with both `SeedlingDraft` (daysOld: string) from the creation
 * screen and `Seedling` (daysOld: number) from the data layer.
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { styles } from '@/styles/create-grid';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
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

// ─── Constants ────────────────────────────────────────────────────────────────

export const CELL_SIZE = 72;
export const CELL_GAP  = 8; // 4px margin on each side

// ─── Types ────────────────────────────────────────────────────────────────────

/** Minimal shape required to display a cell — compatible with both SeedlingDraft and Seedling. */
export type CellData = {
  name: string;
  emoji: string;
  stage: string;
};

/** Ref shape for a cell View, used for screen-space hit detection during drag. */
export type CellRef = {
  measure: (
    cb: (fx: number, fy: number, w: number, h: number, px: number, py: number) => void,
  ) => void;
} | null;

// ─── EmptyCell ────────────────────────────────────────────────────────────────

function EmptyCell({
  index,
  cellRefs,
}: {
  index: number;
  cellRefs: React.MutableRefObject<CellRef[]>;
}) {
  return (
    <View
      ref={(r) => { cellRefs.current[index] = r as unknown as CellRef; }}
      style={[styles.cell, styles.cellEmpty]}
    />
  );
}

// ─── DraggableCell ────────────────────────────────────────────────────────────

type DraggableCellProps = {
  index: number;
  cell: CellData;
  canEdit: boolean;
  cellRefs: React.MutableRefObject<CellRef[]>;
  onDragEnd: (fromIndex: number, absoluteX: number, absoluteY: number) => void;
};

function DraggableCell({ index, cell, canEdit, cellRefs, onDragEnd }: DraggableCellProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale      = useSharedValue(1);

  const pan = Gesture.Pan()
    .enabled(canEdit)
    .onBegin(() => {
      scale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      scale.value      = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(onDragEnd)(index, event.absoluteX, event.absoluteY);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: scale.value > 1 ? 10 : 1,
    shadowOpacity: scale.value > 1 ? 0.2 : 0,
    shadowRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    elevation: scale.value > 1 ? 8 : 0,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        ref={(r) => { cellRefs.current[index] = r as unknown as CellRef; }}
        style={[styles.cell, styles.cellOccupied, animatedStyle]}
      >
        <ThemedText style={styles.cellEmoji}>{cell.emoji}</ThemedText>
        <ThemedText style={styles.cellName} numberOfLines={1}>
          {cell.name}
        </ThemedText>
        <View style={styles.cellStageBadge}>
          <ThemedText style={styles.cellStageBadgeText}>
            {cell.stage.split(' ')[0]}
          </ThemedText>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── GridPreview ──────────────────────────────────────────────────────────────

export type GridPreviewProps = {
  rows: number;
  cols: number;
  /** Flat cells array (length === rows * cols). null = empty cell. */
  cells: (CellData | null)[];
  /**
   * Whether drag-and-drop rearrangement is enabled.
   * Defaults to true. Set to false for read-only display.
   */
  canEdit?: boolean;
  /**
   * Ref array for each cell View, used by the drag handler for screen-space
   * hit detection. Required when canEdit is true.
   */
  cellRefs?: React.MutableRefObject<CellRef[]>;
  /**
   * Called when a drag gesture ends.
   * Signature: (fromIndex, absoluteX, absoluteY) => void
   * Required when canEdit is true.
   */
  onDragEnd?: (fromIndex: number, absoluteX: number, absoluteY: number) => void;
};

export default function GridPreview({
  rows,
  cols,
  cells,
  canEdit = true,
  cellRefs: externalCellRefs,
  onDragEnd,
}: GridPreviewProps) {
  // Provide a throwaway ref when used in read-only mode so EmptyCell /
  // DraggableCell always have a valid ref object to write into.
  const internalCellRefs = useRef<CellRef[]>([]);
  const cellRefs = externalCellRefs ?? internalCellRefs;

  // No-op drag handler used when canEdit is false or onDragEnd is not provided.
  const noop = (_fromIndex: number, _x: number, _y: number) => {};
  const dragEnd = onDragEnd ?? noop;

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>🗺 Grid Preview</ThemedText>
      <ThemedText style={[styles.cellCountHint, { marginBottom: 8 }]}>
        {canEdit ? 'Drag seedlings to rearrange' : 'Seedling positions'}
      </ThemedText>
      <ScrollView
        horizontal
        contentContainerStyle={[
          styles.gridScrollContent,
          { width: cols * (CELL_SIZE + CELL_GAP) + CELL_GAP },
        ]}
        showsHorizontalScrollIndicator={false}
      >
        <View>
          {Array.from({ length: rows }).map((_, r) => (
            <View key={r} style={styles.gridRow}>
              {Array.from({ length: cols }).map((_, c) => {
                const idx  = r * cols + c;
                const cell = cells[idx] ?? null;
                return cell ? (
                  <DraggableCell
                    key={`${idx}-${cell.name}`}
                    index={idx}
                    cell={cell}
                    canEdit={canEdit}
                    cellRefs={cellRefs}
                    onDragEnd={dragEnd}
                  />
                ) : (
                  <EmptyCell
                    key={idx}
                    index={idx}
                    cellRefs={cellRefs}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
