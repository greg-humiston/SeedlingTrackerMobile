import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { SeedlingGrid } from '@/types/home';
import { GARDEN_GREEN } from '@/data/home';
import {
  DECOR_ICONS_HOME,
  EMOJI_HERB,
  EMOJI_SEEDLING,
  EMOJI_WATER,
  FOOTER_SOIL,
} from '@/constants/icons';
import { styles } from '@/styles/home';
import { useGrids, useCreateGrid } from '@/hooks/useGrids';
import { importGridFromFile } from '@/services/gridExport';
import PlantingSlideshow from '@/components/PlantingSlideshow';

// ─── Sub-components ───────────────────────────────────────────────────────────

type GridCardProps = SeedlingGrid & {
  onPress: () => void;
};

function GridCard({ name, emoji, description, seedlings, stats, onPress }: GridCardProps) {
  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.gridCardLeft}>
        <ThemedText style={styles.gridCardEmoji}>{emoji}</ThemedText>
      </View>
      <View style={styles.gridCardBody}>
        <ThemedText style={styles.gridCardName}>{name}</ThemedText>
        <ThemedText style={styles.gridCardDescription}>{description}</ThemedText>
        <View style={styles.gridCardMeta}>
          <ThemedText style={styles.gridCardMetaText}>
            {EMOJI_SEEDLING} {seedlings.length} seedlings
          </ThemedText>
          <ThemedText style={styles.gridCardMetaText}>
            {EMOJI_WATER} {stats.find(s => s.label === 'Need Water')?.value ?? '0'} need water
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.gridCardChevron}>›</ThemedText>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { data: grids, isLoading, isError, error, refetch } = useGrids();
  const { mutate: createGrid } = useCreateGrid();

  const handleImport = async () => {
    const result = await importGridFromFile();
    if (result.ok === false) {
      if (result.reason === 'cancelled') return;
      Alert.alert('Import failed', result.message ?? 'Could not import garden.');
      return;
    }
    createGrid(result.grid as Omit<SeedlingGrid, 'id'>, {
      onSuccess: (created) => {
        router.push({ pathname: '/(tabs)/grid/[id]', params: { id: created.id } });
      },
      onError: () => {
        Alert.alert('Import failed', 'Could not save the imported garden.');
      },
    });
  };

  const totalSeedlings = (grids ?? []).reduce((sum, g) => sum + g.seedlings.length, 0);
  const totalNeedWater = (grids ?? []).reduce(
    (sum, g) => sum + Number(g.stats.find(s => s.label === 'Need Water')?.value ?? 0),
    0,
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Branding Header */}
      <View style={styles.headerBanner}>
        <ThemedText style={styles.brandingLabel}>Welcome to</ThemedText>
        <ThemedText style={styles.brandingTitle}>{EMOJI_SEEDLING} SeedlingTracker</ThemedText>
        <ThemedText style={styles.brandingSubtitle}>
          Track, nurture, and grow your seedlings with care.
        </ThemedText>
        <View style={styles.decorRow}>
          {DECOR_ICONS_HOME.map((icon, i) => (
            <ThemedText key={i} style={styles.decorIcon}>{icon}</ThemedText>
          ))}
        </View>
      </View>

      {/* Summary stats */}
      <ThemedView style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{grids?.length ?? '—'}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Gardens</ThemedText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{grids ? totalSeedlings : '—'}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Seedlings</ThemedText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{grids ? totalNeedWater : '—'}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Need Water</ThemedText>
        </View>
      </ThemedView>

      {/* Planting Slideshow */}
      <PlantingSlideshow />

      {/* Grid List */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{EMOJI_HERB} My Gardens</ThemedText>
          <TouchableOpacity style={styles.importButton} onPress={handleImport} activeOpacity={0.8}>
            <ThemedText style={styles.importButtonText}>📥 Import</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.sectionHint}>Tap a garden to view its seedlings</ThemedText>

        {isLoading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={GARDEN_GREEN} />
            <ThemedText style={styles.statusText}>Loading your gardens...</ThemedText>
          </View>
        )}

        {isError && (
          <View style={styles.statusContainer}>
            <ThemedText style={styles.errorText}>Could not load gardens.</ThemedText>
            <ThemedText style={styles.errorDetail}>{error?.message}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {grids?.map((grid) => (
          <GridCard
            key={grid.id}
            {...grid}
            onPress={() => router.push({ pathname: '/(tabs)/grid/[id]', params: { id: grid.id } })}
          />
        ))}
      </ThemedView>

      {/* Footer decoration */}
      <View style={styles.soilBar}>
        {FOOTER_SOIL.map((icon, i) => (
          <ThemedText key={i} style={styles.soilEmoji}>{icon}</ThemedText>
        ))}
      </View>
    </ScrollView>
  );
}

