import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { SeedlingGrid } from '@/types/home';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN,
  SEEDLING_GRIDS, SOIL_BROWN,
} from '@/data/home';

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
            🌱 {seedlings.length} seedlings
          </ThemedText>
          <ThemedText style={styles.gridCardMetaText}>
            💧 {stats.find(s => s.label === 'Need Water')?.value ?? '0'} need water
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Branding Header */}
      <View style={styles.headerBanner}>
        <ThemedText style={styles.brandingLabel}>Welcome to</ThemedText>
        <ThemedText style={styles.brandingTitle}>🌱 SeedlingTracker</ThemedText>
        <ThemedText style={styles.brandingSubtitle}>
          Track, nurture, and grow your seedlings with care.
        </ThemedText>
        <View style={styles.decorRow}>
          <ThemedText style={styles.decorIcon}>🌿</ThemedText>
          <ThemedText style={styles.decorIcon}>🌸</ThemedText>
          <ThemedText style={styles.decorIcon}>🍃</ThemedText>
          <ThemedText style={styles.decorIcon}>🌻</ThemedText>
          <ThemedText style={styles.decorIcon}>🌿</ThemedText>
        </View>
      </View>

      {/* Summary stats */}
      <ThemedView style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{SEEDLING_GRIDS.length}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Gardens</ThemedText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>
            {SEEDLING_GRIDS.reduce((sum, g) => sum + g.seedlings.length, 0)}
          </ThemedText>
          <ThemedText style={styles.summaryLabel}>Seedlings</ThemedText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>
            {SEEDLING_GRIDS.reduce(
              (sum, g) => sum + Number(g.stats.find(s => s.label === 'Need Water')?.value ?? 0),
              0
            )}
          </ThemedText>
          <ThemedText style={styles.summaryLabel}>Need Water</ThemedText>
        </View>
      </ThemedView>

      {/* Grid List */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>🌿 My Gardens</ThemedText>
        <ThemedText style={styles.sectionHint}>Tap a garden to view its seedlings</ThemedText>
        {SEEDLING_GRIDS.map((grid) => (
          <GridCard
            key={grid.id}
            {...grid}
            onPress={() => router.push({ pathname: '/grid/[id]', params: { id: grid.id } })}
          />
        ))}
      </ThemedView>

      {/* Footer decoration */}
      <View style={styles.soilBar}>
        <ThemedText style={styles.soilEmoji}>🪨</ThemedText>
        <ThemedText style={styles.soilEmoji}>🌱</ThemedText>
        <ThemedText style={styles.soilEmoji}>🪱</ThemedText>
        <ThemedText style={styles.soilEmoji}>🌱</ThemedText>
        <ThemedText style={styles.soilEmoji}>🪨</ThemedText>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Branding header
  headerBanner: {
    backgroundColor: GARDEN_GREEN,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
  },
  brandingLabel: {
    fontSize: 14,
    color: LIGHT_GREEN,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6,
    textAlign: 'center',
  },
  brandingSubtitle: {
    fontSize: 14,
    color: LIGHT_GREEN,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  decorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  decorIcon: {
    fontSize: 24,
  },

  // Summary bar
  summaryBar: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: GARDEN_GREEN,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E0EDE4',
  },

  // Section
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: LEAF_GREEN,
    marginBottom: 2,
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 14,
  },

  // Grid card
  gridCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F2',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
  },
  gridCardLeft: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  gridCardEmoji: {
    fontSize: 28,
  },
  gridCardBody: {
    flex: 1,
  },
  gridCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: LEAF_GREEN,
  },
  gridCardDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  gridCardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  gridCardMetaText: {
    fontSize: 11,
    color: GARDEN_GREEN,
    fontWeight: '500',
  },
  gridCardChevron: {
    fontSize: 26,
    color: GARDEN_GREEN,
    fontWeight: '300',
    marginLeft: 8,
  },

  // Footer
  soilBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 3,
    borderTopColor: SOIL_BROWN,
    marginHorizontal: 16,
  },
  soilEmoji: {
    fontSize: 20,
  },
});
