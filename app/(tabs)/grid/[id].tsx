import GridPreview, { CellRef } from '@/components/GridPreview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EMOJI_MAP, EMOJI_OVERVIEW } from '@/constants/icons';
import { GARDEN_GREEN } from '@/data/home';
import { useGrid, useUpdateGrid } from '@/hooks/useGrids';
import { editStyles, styles } from '@/styles/grid-detail';
import type { SeedlingGrid, SelectedSeedling, Stat } from '@/types/home';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ emoji, label, value, color }: Stat) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <ThemedText style={styles.statEmoji}>{emoji}</ThemedText>
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

// ─── Grid Detail View ─────────────────────────────────────────────────────────

function GridDetailView({ grid }: { grid: SeedlingGrid }) {
  const router = useRouter();
  const { mutate: updateGrid } = useUpdateGrid();

  // ── Edit mode ──────────────────────────────────────────────────────────────

  const [isEditing, setIsEditing] = useState(false);
  const [editCells, setEditCells] = useState<(SelectedSeedling | null)[]>([]);
  const cellRefs = useRef<CellRef[]>([]);

  const handleEditStart = () => {
    setEditCells([...grid.gridCells]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditCells([]);
    setIsEditing(false);
  };

  const handleSave = () => {
    updateGrid(
      { gridId: grid.id, updates: { gridCells: editCells } },
      // Exit edit mode only after the mutation-level onSuccess has already
      // written the updated grid into the detail cache via setQueryData.
      { onSuccess: () => setIsEditing(false) },
    );
  };

  // ── Tap-to-select swap ─────────────────────────────────────────────────────

  const handleSwap = (fromIndex: number, toIndex: number) => {
    setEditCells((prev) => {
      const next = [...prev];
      const temp      = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex]   = temp;
      return next;
    });
  };

  // ── Drag-and-drop ──────────────────────────────────────────────────────────

  const handleDragEnd = (fromIndex: number, absoluteX: number, absoluteY: number) => {
    const total = cellRefs.current.length;
    if (total === 0) return;

    let remaining = total;
    let toIndex: number | null = null;

    const checkDone = () => {
      remaining -= 1;
      if (remaining > 0) return;
      if (toIndex === null || toIndex === fromIndex) return;
      setEditCells((prev) => {
        const next = [...prev];
        const temp      = next[fromIndex];
        next[fromIndex] = next[toIndex!];
        next[toIndex!]  = temp;
        return next;
      });
    };

    cellRefs.current.forEach((ref, i) => {
      if (!ref) { remaining -= 1; return; }
      ref.measure((_fx, _fy, width, height, pageX, pageY) => {
        if (
          absoluteX >= pageX &&
          absoluteX <= pageX + width &&
          absoluteY >= pageY &&
          absoluteY <= pageY + height
        ) {
          toIndex = i;
        }
        checkDone();
      });
    });
  };

  // ── Last-watered update (view mode only) ───────────────────────────────────

  const handleUpdateLastWatered = (cellIndex: number, date: string) => {
    const targetCell = grid.gridCells[cellIndex];
    if (!targetCell) return;
    const updatedGridCells = grid.gridCells.map((cell, i) =>
      i === cellIndex && cell !== null ? { ...cell, lastWateredAt: date } : cell,
    );
    const updatedSeedlings = grid.seedlings.map((s) =>
      s.name === targetCell.name ? { ...s, lastWateredAt: date } : s,
    );
    updateGrid({ gridId: grid.id, updates: { gridCells: updatedGridCells, seedlings: updatedSeedlings } });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <ThemedText style={styles.headerGreeting}>{grid.header.greeting}</ThemedText>
        </View>
        <ThemedText style={styles.headerTitle}>{grid.header.title}</ThemedText>
        <ThemedText style={styles.headerSubtitle}>{grid.header.subtitle}</ThemedText>
        <View style={styles.plantRow}>
          {grid.header.decorativeIcons.map((icon, i) => (
            <ThemedText key={i} style={styles.plantIcon}>{icon}</ThemedText>
          ))}
        </View>
      </View>

      {/* Stats Row */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText style={styles.sectionTitle}>{EMOJI_OVERVIEW} Garden Overview</ThemedText>
        <View style={styles.statsRow}>
          {grid.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </View>
      </ThemedView>

      {/* 2-D Grid Preview */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{EMOJI_MAP} Seedling Grid</ThemedText>
        <ThemedText style={styles.sectionHint}>
          {grid.cols} col{grid.cols !== 1 ? 's' : ''} ×{' '}
          {grid.rows} row{grid.rows !== 1 ? 's' : ''} ·{' '}
          {grid.seedlings.length} seedling{grid.seedlings.length !== 1 ? 's' : ''} placed
        </ThemedText>
        <GridPreview
          rows={grid.rows}
          cols={grid.cols}
          cells={isEditing ? editCells : grid.gridCells}
          canEdit={isEditing}
          cellRefs={cellRefs}
          onDragEnd={handleDragEnd}
          onSwap={isEditing ? handleSwap : undefined}
          createdAt={grid.createdAt}
          onUpdateLastWatered={isEditing ? undefined : handleUpdateLastWatered}
        />

        {/* Edit / Save / Cancel controls */}
        {!isEditing ? (
          <TouchableOpacity
            style={editStyles.editButton}
            onPress={handleEditStart}
            activeOpacity={0.8}
          >
            <ThemedText style={editStyles.editButtonText}>✏️ Edit Layout</ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={editStyles.editActions}>
            <TouchableOpacity
              style={editStyles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <ThemedText style={editStyles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={editStyles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <ThemedText style={editStyles.saveButtonText}>💾 Save Layout</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>

      {/* Tip of the Day */}
      <View style={styles.tipCard}>
        <ThemedText style={styles.tipTitle}>{grid.tip.title}</ThemedText>
        <ThemedText style={styles.tipText}>{grid.tip.text}</ThemedText>
      </View>

      {/* Soil footer decoration */}
      <View style={styles.soilBar}>
        {grid.footerIcons.map((icon, i) => (
          <ThemedText key={i} style={styles.soilEmoji}>{icon}</ThemedText>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function GridDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const { data: grid, isLoading, isError, error } = useGrid(id ?? '');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={GARDEN_GREEN} />
          <ThemedText style={styles.statusText}>Loading garden...</ThemedText>
        </View>
      )}

      {isError && (
        <View style={styles.center}>
          <ThemedText style={styles.errorText}>Could not load garden.</ThemedText>
          <ThemedText style={styles.errorDetail}>{error?.message}</ThemedText>
          <TouchableOpacity onPress={() => router.back()} style={styles.errorBackButton}>
            <ThemedText style={styles.errorBackButtonText}>← Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && !grid && (
        <View style={styles.center}>
          <ThemedText style={styles.statusText}>Garden not found.</ThemedText>
          <TouchableOpacity onPress={() => router.back()} style={styles.errorBackButton}>
            <ThemedText style={styles.errorBackButtonText}>← Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {grid && <GridDetailView grid={grid} />}
    </GestureHandlerRootView>
  );
}

