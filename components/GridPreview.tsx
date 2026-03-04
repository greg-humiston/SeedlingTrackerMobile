/**
 * GridPreview
 *
 * Interactive 2-D grid renderer shared between the grid-creation screen and
 * the garden detail screen.
 *
 * - canEdit={true} (default): both drag-and-drop AND tap-to-select are active.
 *   - Quick tap a populated cell to select it, then tap another cell to swap /
 *     move it (pass `onSwap` so the parent can update cell order).
 *   - Drag a populated cell and release over another to swap via hit-detection
 *     (pass `cellRefs` and `onDragEnd` so the parent can update cell order).
 * - canEdit={false}: gestures are disabled and cells render as static views.
 *
 * Long-pressing any occupied cell for 1 500 ms opens a SeedlingPreviewPopup
 * with in-depth information about that seedling.
 *
 * The `cells` prop accepts any object with `name`, `emoji`, and `stage` fields
 * so it works with both `SeedlingDraft` (daysOld: string) from the creation
 * screen and `Seedling` (daysOld: number) from the data layer.
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EMOJI_MAP } from '@/constants/icons';
import { styles } from '@/styles/create-grid';
import { popupStyles } from '@/styles/grid-preview';
import { useRef, useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
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

// Grid cells are flex-based and fill the parent width — no fixed pixel size needed.

const LONG_PRESS_MS = 1500;

// ─── Types ────────────────────────────────────────────────────────────────────

/** Minimal shape required to display a cell — compatible with both SeedlingDraft and Seedling. */
export type CellData = {
  name: string;
  emoji: string;
  stage: string;
  /** Accepts both numeric (Seedling) and string (SeedlingDraft) values. */
  daysOld?: number | string;
  /** ISO 8601 date the seedling was last watered. */
  lastWateredAt?: string;
};

/** Ref shape for a cell View, used for screen-space hit detection during drag. */
export type CellRef = {
  measure: (
    cb: (fx: number, fy: number, w: number, h: number, px: number, py: number) => void,
  ) => void;
} | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | undefined): string {
  if (!iso) return 'Not recorded';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function healthFromStage(stage: string): string {
  if (stage === 'Germinating')  return '🌱 Getting started';
  if (stage === 'Sprouting')    return '💪 Growing well';
  if (stage === 'First Leaves') return '🌿 Thriving';
  if (stage === 'Established')  return '🌳 Flourishing';
  return '🟢 Healthy';
}

// ─── SeedlingPreviewPopup ─────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={popupStyles.infoRow}>
      <ThemedText style={popupStyles.infoLabel}>{label}</ThemedText>
      <ThemedText style={popupStyles.infoValue}>{value}</ThemedText>
    </View>
  );
}

function SeedlingPreviewPopup({
  cell,
  cellIndex,
  createdAt,
  onClose,
  onUpdateLastWatered,
}: {
  cell: CellData;
  cellIndex: number;
  createdAt?: string;
  onClose: () => void;
  onUpdateLastWatered?: (cellIndex: number, date: string) => void;
}) {
  const daysNum =
    typeof cell.daysOld === 'string'
      ? parseInt(cell.daysOld, 10)
      : (cell.daysOld ?? 0);
  const ageDisplay = daysNum > 0 ? `${daysNum} day${daysNum === 1 ? '' : 's'}` : 'Unknown';

  const [localLastWatered, setLocalLastWatered] = useState<string | undefined>(cell.lastWateredAt);

  const handleAdjust = (days: number) => {
    const base = localLastWatered ? new Date(localLastWatered) : new Date();
    base.setDate(base.getDate() + days);
    const iso = base.toISOString();
    setLocalLastWatered(iso);
    onUpdateLastWatered?.(cellIndex, iso);
  };

  const handleMarkToday = () => {
    const iso = new Date().toISOString();
    setLocalLastWatered(iso);
    onUpdateLastWatered?.(cellIndex, iso);
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      {/* Tapping the dim overlay dismisses the popup */}
      <TouchableOpacity style={popupStyles.overlay} onPress={onClose} activeOpacity={1}>
        {/* Inner touchable absorbs taps so they don't bubble to the overlay */}
        <TouchableOpacity style={popupStyles.card} onPress={() => {}} activeOpacity={1}>

          {/* Header row: emoji · name · stage badge · × */}
          <View style={popupStyles.header}>
            <ThemedText style={popupStyles.headerEmoji}>{cell.emoji}</ThemedText>
            <View style={popupStyles.headerText}>
              <ThemedText style={popupStyles.headerName}>{cell.name}</ThemedText>
              <View style={popupStyles.stageBadge}>
                <ThemedText style={popupStyles.stageBadgeText}>{cell.stage}</ThemedText>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
            >
              <ThemedText style={popupStyles.closeX}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={popupStyles.divider} />

          {/* Static detail rows */}
          <InfoRow label="Age"     value={ageDisplay} />
          <InfoRow label="Planted" value={formatDate(createdAt)} />
          <InfoRow label="Health"  value={healthFromStage(cell.stage)} />

          {/* Editable last-watered section */}
          <View style={popupStyles.editableSection}>
            <ThemedText style={popupStyles.infoLabel}>Last watered</ThemedText>
            <View style={popupStyles.dateEditor}>
              <TouchableOpacity
                onPress={() => handleAdjust(-1)}
                style={popupStyles.adjustBtn}
                activeOpacity={0.75}
              >
                <ThemedText style={popupStyles.adjustBtnText}>−</ThemedText>
              </TouchableOpacity>
              <ThemedText style={popupStyles.dateEditorValue}>
                {formatDate(localLastWatered)}
              </ThemedText>
              <TouchableOpacity
                onPress={() => handleAdjust(1)}
                style={popupStyles.adjustBtn}
                activeOpacity={0.75}
              >
                <ThemedText style={popupStyles.adjustBtnText}>+</ThemedText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={popupStyles.todayButton}
              onPress={handleMarkToday}
              activeOpacity={0.8}
            >
              <ThemedText style={popupStyles.todayButtonText}>💧 Mark as watered today</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Close button */}
          <TouchableOpacity style={popupStyles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <ThemedText style={popupStyles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
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
  onTap?: (index: number) => void;
}) {
  if (onTap) {
    return (
      <TouchableOpacity
        ref={(r) => { cellRefs.current[index] = r as unknown as CellRef; }}
        style={[styles.cell, styles.cellEmpty]}
        onPress={() => onTap(index)}
        activeOpacity={0.7}
      />
    );
  }
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
  isSelected: boolean;
  cellRefs: React.MutableRefObject<CellRef[]>;
  onDragEnd: (fromIndex: number, absoluteX: number, absoluteY: number) => void;
  onDragStart: () => void;
  onTap: (index: number) => void;
  onLongPress: (cell: CellData, index: number) => void;
};

function DraggableCell({
  index, cell, canEdit, isSelected,
  cellRefs, onDragEnd, onDragStart, onTap, onLongPress,
}: DraggableCellProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale      = useSharedValue(1);

  // Quick tap (< 500 ms) fires the tap handler for selection.
  const tap = Gesture.Tap()
    .maxDuration(500)
    .onEnd(() => { runOnJS(onTap)(index); });

  // Pan for drag-and-drop. Scale up on activation, reset when done (success or fail).
  const pan = Gesture.Pan()
    .enabled(canEdit)
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
      // Runs after onEnd (success) or on failure — always resets animation.
      scale.value      = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  // Long hold (1 500 ms) opens the seedling popup.
  // Tap fails at 500 ms maxDuration, Pan fails with no movement — LongPress wins.
  const longPress = Gesture.LongPress()
    .minDuration(LONG_PRESS_MS)
    .onStart(() => {
      scale.value      = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(onLongPress)(cell, index);
    });

  // In edit mode: all three compete; quick tap → tap, drag → pan, long hold → longPress.
  // In view mode: only long-press is relevant.
  const gesture = canEdit ? Gesture.Race(tap, pan, longPress) : longPress;

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
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={(r) => { cellRefs.current[index] = r as unknown as CellRef; }}
        style={[styles.cell, styles.cellOccupied, isSelected && styles.cellSelected, animatedStyle]}
      >
        <ThemedText style={styles.cellEmoji}>{cell.emoji}</ThemedText>
        <ThemedText style={styles.cellName} numberOfLines={1}>
          {cell.name}
        </ThemedText>
        <View style={styles.cellStageBadge}>
          <ThemedText style={styles.cellStageBadgeText}>
            {cell.stage}
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
   * Whether drag-and-drop and tap-to-select rearrangement are enabled.
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
   */
  onDragEnd?: (fromIndex: number, absoluteX: number, absoluteY: number) => void;
  /**
   * Called when a tap-to-select swap is resolved.
   * Signature: (fromIndex, toIndex) => void
   */
  onSwap?: (fromIndex: number, toIndex: number) => void;
  /**
   * ISO 8601 creation date of the parent grid.
   * Displayed as the "Planted" date in the seedling preview popup.
   */
  createdAt?: string;
  /**
   * Called when the user adjusts the last-watered date for a cell.
   * Signature: (cellIndex, isoDate) => void
   */
  onUpdateLastWatered?: (cellIndex: number, date: string) => void;
};

export default function GridPreview({
  rows,
  cols,
  cells,
  canEdit = true,
  cellRefs: externalCellRefs,
  onDragEnd,
  onSwap,
  createdAt,
  onUpdateLastWatered,
}: GridPreviewProps) {
  const internalCellRefs = useRef<CellRef[]>([]);
  const cellRefs = externalCellRefs ?? internalCellRefs;

  const noop = (_fromIndex: number, _x: number, _y: number) => {};
  const dragEnd = onDragEnd ?? noop;

  // Popup state — null means closed.
  const [previewEntry, setPreviewEntry] = useState<{ cell: CellData; index: number } | null>(null);

  // Tap-to-select state — null means nothing selected.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCellTap = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (index === selectedIndex) {
      setSelectedIndex(null); // deselect same cell
    } else {
      onSwap?.(selectedIndex, index);
      setSelectedIndex(null);
    }
  };

  // Only fires when canEdit is true; only acts if a cell is already selected.
  const handleEmptyTap = (index: number) => {
    if (selectedIndex === null) return;
    onSwap?.(selectedIndex, index);
    setSelectedIndex(null);
  };

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{EMOJI_MAP} Grid Preview</ThemedText>
      <ThemedText style={[styles.cellCountHint, { marginBottom: 8 }]}>
        {canEdit
          ? 'Tap to select · Tap another to swap · Drag to rearrange · Hold to inspect'
          : 'Hold a seedling to inspect'}
      </ThemedText>
      <View style={styles.gridContainer}>
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
                  isSelected={selectedIndex === idx}
                  cellRefs={cellRefs}
                  onDragEnd={dragEnd}
                  onDragStart={() => setSelectedIndex(null)}
                  onTap={handleCellTap}
                  onLongPress={(c, i) => setPreviewEntry({ cell: c, index: i })}
                />
              ) : (
                <EmptyCell
                  key={idx}
                  index={idx}
                  cellRefs={cellRefs}
                  onTap={canEdit ? handleEmptyTap : undefined}
                />
              );
            })}
          </View>
        ))}
      </View>

      {previewEntry && (
        <SeedlingPreviewPopup
          cell={previewEntry.cell}
          cellIndex={previewEntry.index}
          createdAt={createdAt}
          onClose={() => setPreviewEntry(null)}
          onUpdateLastWatered={onUpdateLastWatered}
        />
      )}
    </ThemedView>
  );
}

