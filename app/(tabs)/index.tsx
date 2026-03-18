import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
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
import { getGridsNeedingWater, countCellsNeedingWater } from '@/utils/wateringUtils';
import { useState } from 'react';

// ─── WaterNotificationBadge ───────────────────────────────────────────────────

function WaterNotificationBadge({ grids }: { grids: SeedlingGrid[] }) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const thirstyGrids = getGridsNeedingWater(grids);
  const hasThirsty = thirstyGrids.length > 0;

  return (
    <>
      <TouchableOpacity
        style={[
          badgeStyles.badge,
          hasThirsty ? badgeStyles.badgeActive : badgeStyles.badgeInactive,
        ]}
        onPress={() => hasThirsty && setModalVisible(true)}
        activeOpacity={hasThirsty ? 0.8 : 1}
        disabled={!hasThirsty}
      >
        <ThemedText style={[badgeStyles.badgeText, !hasThirsty && badgeStyles.badgeTextInactive]}>
          {hasThirsty
            ? `💧 ${thirstyGrids.length} garden${thirstyGrids.length > 1 ? 's' : ''} need water`
            : '✓ All seedlings are watered'}
        </ThemedText>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={badgeStyles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity style={badgeStyles.popup} activeOpacity={1} onPress={() => {}}>
            <ThemedText style={badgeStyles.popupTitle}>💧 Gardens Needing Water</ThemedText>
            <View style={badgeStyles.divider} />
            {thirstyGrids.map((grid) => {
              const count = countCellsNeedingWater(grid.gridCells);
              return (
                <TouchableOpacity
                  key={grid.id}
                  style={badgeStyles.gardenRow}
                  activeOpacity={0.75}
                  onPress={() => {
                    setModalVisible(false);
                    router.push({
                      pathname: '/(tabs)/grid/[id]',
                      params: { id: grid.id, mode: 'watering' },
                    });
                  }}
                >
                  <ThemedText style={badgeStyles.gardenEmoji}>{grid.emoji}</ThemedText>
                  <View style={badgeStyles.gardenInfo}>
                    <ThemedText style={badgeStyles.gardenName}>{grid.name}</ThemedText>
                    <ThemedText style={badgeStyles.gardenCount}>
                      {count} seedling{count !== 1 ? 's' : ''} need water
                    </ThemedText>
                  </View>
                  <ThemedText style={badgeStyles.gardenChevron}>›</ThemedText>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={badgeStyles.closeButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <ThemedText style={badgeStyles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const badgeStyles = {
  badge: {
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center' as const,
    borderWidth: 1.5,
  },
  badgeActive: {
    backgroundColor: '#E8F5E9',
    borderColor: GARDEN_GREEN,
  },
  badgeInactive: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CCCCCC',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: GARDEN_GREEN,
  },
  badgeTextInactive: {
    color: '#999999',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%' as const,
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EFE9',
    marginVertical: 14,
  },
  gardenRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F7F2',
  },
  gardenEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  gardenInfo: {
    flex: 1,
  },
  gardenName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#1A1A1A',
  },
  gardenCount: {
    fontSize: 12,
    color: '#3A86FF',
    marginTop: 2,
  },
  gardenChevron: {
    fontSize: 22,
    color: GARDEN_GREEN,
    marginLeft: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center' as const,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700' as const,
  },
};

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

      {/* Water Notification Badge */}
      {grids && <WaterNotificationBadge grids={grids} />}

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

