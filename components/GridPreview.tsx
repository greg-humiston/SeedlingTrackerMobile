/**
 * GridPreview — read-only 2-D grid renderer.
 *
 * Displays a flat cell array as a grid. Each occupied cell shows only its
 * emoji. Long-pressing an occupied cell for 1 500 ms opens a
 * SeedlingPreviewPopup with detail information.
 *
 * For interactive editing (drag-and-drop, tap-to-select, add/remove) use
 * GridEdit instead.
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EMOJI_MAP } from '@/constants/icons';
import { styles } from '@/styles/create-grid';
import { popupStyles } from '@/styles/grid-preview';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

// ─── Constants ────────────────────────────────────────────────────────────────

const LONG_PRESS_MS = 1500;

// ─── Types ────────────────────────────────────────────────────────────────────

/** Minimal shape required to display a cell. */
export type CellData = {
  variety: string;
  emoji: string;
  stage: string;
  daysOld?: number | string;
  lastWateredAt?: string;
};

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
      <TouchableOpacity style={popupStyles.overlay} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity style={popupStyles.card} onPress={() => {}} activeOpacity={1}>

          <View style={popupStyles.header}>
            <ThemedText style={popupStyles.headerEmoji}>{cell.emoji}</ThemedText>
            <View style={popupStyles.headerText}>
              <ThemedText style={popupStyles.headerName}>{cell.variety}</ThemedText>
              <View style={popupStyles.stageBadge}>
                <ThemedText style={popupStyles.stageBadgeText}>{cell.stage}</ThemedText>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
              <ThemedText style={popupStyles.closeX}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={popupStyles.divider} />

          {ageDisplay !== 'Unknown' ? <InfoRow label="Age" value={ageDisplay} /> : null}
          <InfoRow label="Planted" value={formatDate(createdAt)} />
          <InfoRow label="Health"  value={healthFromStage(cell.stage)} />

          <View style={popupStyles.editableSection}>
            <ThemedText style={popupStyles.infoLabel}>Last watered</ThemedText>
            <View style={popupStyles.dateEditor}>
              <TouchableOpacity onPress={() => handleAdjust(-1)} style={popupStyles.adjustBtn} activeOpacity={0.75}>
                <ThemedText style={popupStyles.adjustBtnText}>−</ThemedText>
              </TouchableOpacity>
              <ThemedText style={popupStyles.dateEditorValue}>{formatDate(localLastWatered)}</ThemedText>
              <TouchableOpacity onPress={() => handleAdjust(1)} style={popupStyles.adjustBtn} activeOpacity={0.75}>
                <ThemedText style={popupStyles.adjustBtnText}>+</ThemedText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={popupStyles.todayButton} onPress={handleMarkToday} activeOpacity={0.8}>
              <ThemedText style={popupStyles.todayButtonText}>💧 Mark as watered today</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={popupStyles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <ThemedText style={popupStyles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── GridPreview ──────────────────────────────────────────────────────────────

export type GridPreviewProps = {
  rows: number;
  cols: number;
  cells: (CellData | null)[];
  createdAt?: string;
  onUpdateLastWatered?: (cellIndex: number, date: string) => void;
};

export default function GridPreview({
  rows,
  cols,
  cells,
  createdAt,
  onUpdateLastWatered,
}: GridPreviewProps) {
  const [previewEntry, setPreviewEntry] = useState<{ cell: CellData; index: number } | null>(null);

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{EMOJI_MAP} Grid Preview</ThemedText>
      <ThemedText style={[styles.cellCountHint, { marginBottom: 8 }]}>
        Hold a seedling to inspect
      </ThemedText>
      <View style={styles.gridContainer}>
        {Array.from({ length: rows }).map((_, r) => (
          <View key={r} style={styles.gridRow}>
            {Array.from({ length: cols }).map((_, c) => {
              const idx  = r * cols + c;
              const cell = cells[idx] ?? null;
              if (cell) {
                return (
                  <TouchableOpacity
                    key={`${idx}-${cell.variety}`}
                    style={[styles.cell, styles.cellOccupied]}
                    onLongPress={() => setPreviewEntry({ cell, index: idx })}
                    delayLongPress={LONG_PRESS_MS}
                    activeOpacity={0.9}
                  >
                    <ThemedText style={styles.cellEmoji}>{cell.emoji}</ThemedText>
                  </TouchableOpacity>
                );
              }
              return <View key={idx} style={[styles.cell, styles.cellEmpty]} />;
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
