import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import GridPreview from '@/components/GridPreview';
import { GARDEN_GREEN } from '@/data/home';
import { useGrid } from '@/hooks/useGrids';
import { styles } from '@/styles/grid-detail';
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
          canEdit={false}
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

