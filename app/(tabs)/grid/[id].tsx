import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GridPreview from '@/components/GridPreview';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN,
  PETAL_YELLOW, SOIL_BROWN,
} from '@/data/home';
import { useGrid } from '@/hooks/useGrids';
import type { SeedlingGrid, Stat } from '@/types/home';

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
        <ThemedText style={styles.sectionTitle}>📊 Garden Overview</ThemedText>
        <View style={styles.statsRow}>
          {grid.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </View>
      </ThemedView>

      {/* 2-D Grid Preview */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>🗺 Seedling Grid</ThemedText>
        <ThemedText style={styles.sectionHint}>
          {grid.cols} col{grid.cols !== 1 ? 's' : ''} ×{' '}
          {grid.rows} row{grid.rows !== 1 ? 's' : ''} ·{' '}
          {grid.seedlings.length} seedling{grid.seedlings.length !== 1 ? 's' : ''} placed
        </ThemedText>
        <GridPreview
          rows={grid.rows}
          cols={grid.cols}
          cells={grid.gridCells}
        />
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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={GARDEN_GREEN} />
        <ThemedText style={styles.statusText}>Loading garden...</ThemedText>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.errorText}>Could not load garden.</ThemedText>
        <ThemedText style={styles.errorDetail}>{error?.message}</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBackButton}>
          <ThemedText style={styles.errorBackButtonText}>← Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (!grid) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.statusText}>Garden not found.</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBackButton}>
          <ThemedText style={styles.errorBackButtonText}>← Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return <GridDetailView grid={grid} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Loading / error states
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  statusText: {
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C0392B',
  },
  errorDetail: {
    fontSize: 12,
    color: '#888',
  },
  errorBackButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 12,
    marginTop: 4,
  },
  errorBackButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  // Main scroll
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header
  headerBanner: {
    backgroundColor: GARDEN_GREEN,
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 16,
    color: LIGHT_GREEN,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: LIGHT_GREEN,
    marginTop: 4,
    marginBottom: 16,
  },
  plantRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  plantIcon: {
    fontSize: 22,
  },

  // Stats
  statsContainer: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F9F6',
    borderRadius: 16,
    paddingVertical: 14,
    borderTopWidth: 4,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
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
    marginBottom: 12,
  },

  // Tip card
  tipCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: PETAL_YELLOW,
    borderRadius: 16,
    padding: 16,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: SOIL_BROWN,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6B5E4E',
    lineHeight: 22,
  },

  // Soil footer
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
