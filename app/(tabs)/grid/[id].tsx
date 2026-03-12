import GridEdit from '@/components/GridEdit';
import GridPreview from '@/components/GridPreview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EMOJI_MAP, EMOJI_OPTIONS, EMOJI_OVERVIEW } from '@/constants/icons';
import { GARDEN_GREEN } from '@/data/home';
import { useGrid, useUpdateGrid } from '@/hooks/useGrids';
import { exportGrid } from '@/services/gridExport';
import { editFormStyles } from '@/styles/grid-edit-form';
import { editStyles, styles } from '@/styles/grid-detail';
import type { SeedlingGrid, SelectedSeedling, Stat } from '@/types/home';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
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

  // ── Edit mode state ────────────────────────────────────────────────────────

  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Editable metadata
  const [editName, setEditName]               = useState('');
  const [editEmoji, setEditEmoji]             = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Editable grid data (controlled by GridEdit)
  const [editCells, setEditCells]         = useState<(SelectedSeedling | null)[]>([]);
  const [editSeedlings, setEditSeedlings] = useState<SelectedSeedling[]>([]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleEditStart = () => {
    setEditName(grid.name);
    setEditEmoji(grid.emoji);
    setEditDescription(grid.description);
    setEditCells([...grid.gridCells]);
    setEditSeedlings([...grid.seedlings]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    updateGrid(
      {
        gridId: grid.id,
        updates: {
          name:        editName.trim() || grid.name,
          emoji:       editEmoji,
          description: editDescription.trim() || grid.description,
          header: {
            ...grid.header,
            title: `${editEmoji} ${editName.trim() || grid.name}`,
          },
          gridCells: editCells,
          seedlings:  editSeedlings,
          stats: [
            { ...grid.stats[0], value: String(editSeedlings.length) },
            ...grid.stats.slice(1),
          ],
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleGridChange = (
    newCells: (SelectedSeedling | null)[],
    newSeedlings: SelectedSeedling[],
  ) => {
    setEditCells(newCells);
    setEditSeedlings(newSeedlings);
  };

  // ── Last-watered update (view mode only) ───────────────────────────────────

  const handleUpdateLastWatered = (cellIndex: number, date: string) => {
    const targetCell = grid.gridCells[cellIndex];
    if (!targetCell) return;
    const updatedGridCells = grid.gridCells.map((cell, i) =>
      i === cellIndex && cell !== null ? { ...cell, lastWateredAt: date } : cell,
    );
    const updatedSeedlings = grid.seedlings.map((s) =>
      s.variety === targetCell.variety ? { ...s, lastWateredAt: date } : s,
    );
    updateGrid({ gridId: grid.id, updates: { gridCells: updatedGridCells, seedlings: updatedSeedlings } });
  };

  // ── Export ─────────────────────────────────────────────────────────────────

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportGrid(grid);
    } catch (err) {
      Alert.alert('Export failed', err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const displayName  = isEditing ? editName  : grid.name;
  const displayEmoji = isEditing ? editEmoji : grid.emoji;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <ThemedText style={styles.headerGreeting}>{grid.header.greeting}</ThemedText>
        </View>
        <ThemedText style={styles.headerTitle}>
          {displayEmoji} {displayName}
        </ThemedText>
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

      {/* ── Edit Mode ───────────────────────────────────────────────────────── */}
      {isEditing ? (
        <>
          {/* Editable Metadata */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>✏️ Edit Details</ThemedText>

            <ThemedText style={editFormStyles.fieldLabel}>Garden Name</ThemedText>
            <TextInput
              style={editFormStyles.fieldInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Garden name"
              placeholderTextColor="#aaa"
            />

            <ThemedText style={editFormStyles.fieldLabel}>Description</ThemedText>
            <TextInput
              style={editFormStyles.fieldInput}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Short description"
              placeholderTextColor="#aaa"
            />

            <ThemedText style={editFormStyles.fieldLabel}>Emoji</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={editFormStyles.emojiRow}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[editFormStyles.emojiChip, editEmoji === emoji && editFormStyles.emojiChipSelected]}
                  onPress={() => setEditEmoji(emoji)}
                  activeOpacity={0.75}
                >
                  <ThemedText style={editFormStyles.emojiChipText}>{emoji}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>

          {/* Editable Grid (GridEdit) */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{EMOJI_MAP} Seedling Grid</ThemedText>
            <ThemedText style={styles.sectionHint}>
              {grid.cols} col{grid.cols !== 1 ? 's' : ''} ×{' '}
              {grid.rows} row{grid.rows !== 1 ? 's' : ''} ·{' '}
              {editSeedlings.length} seedling{editSeedlings.length !== 1 ? 's' : ''} placed
            </ThemedText>
          </ThemedView>

          <GridEdit
            rows={grid.rows}
            cols={grid.cols}
            cells={editCells}
            seedlings={editSeedlings}
            onChange={handleGridChange}
          />

          {/* Save / Cancel */}
          <View style={[editStyles.editActions, { marginHorizontal: 16 }]}>
            <TouchableOpacity style={editStyles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
              <ThemedText style={editStyles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={editStyles.saveButton} onPress={handleSave} activeOpacity={0.8}>
              <ThemedText style={editStyles.saveButtonText}>💾 Save Changes</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Read-only Grid (GridPreview) */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{EMOJI_MAP} Seedling Grid</ThemedText>
            <ThemedText style={styles.sectionHint}>
              {grid.cols} col{grid.cols !== 1 ? 's' : ''} ×{' '}
              {grid.rows} row{grid.rows !== 1 ? 's' : ''} ·{' '}
              {grid.seedlings.length} seedling{grid.seedlings.length !== 1 ? 's' : ''} placed
            </ThemedText>
          </ThemedView>

          <GridPreview
            rows={grid.rows}
            cols={grid.cols}
            cells={grid.gridCells}
            createdAt={grid.createdAt}
            onUpdateLastWatered={handleUpdateLastWatered}
          />

          {/* Edit button */}
          <TouchableOpacity
            style={[editStyles.editButton, { marginHorizontal: 16 }]}
            onPress={handleEditStart}
            activeOpacity={0.8}
          >
            <ThemedText style={editStyles.editButtonText}>✏️ Edit Garden</ThemedText>
          </TouchableOpacity>
        </>
      )}

      {/* Export */}
      {!isEditing && (
        <TouchableOpacity
          style={editStyles.exportButton}
          onPress={handleExport}
          disabled={isExporting}
          activeOpacity={0.8}
        >
          <ThemedText style={editStyles.exportButtonText}>
            {isExporting ? 'Exporting…' : '📤 Export Garden'}
          </ThemedText>
        </TouchableOpacity>
      )}

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
