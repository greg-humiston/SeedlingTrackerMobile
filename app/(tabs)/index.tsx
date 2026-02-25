import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { SeedlingGrid } from '@/types/home';
import { SEEDLING_GRIDS } from '@/data/home';
import { styles } from '@/styles/home';

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

