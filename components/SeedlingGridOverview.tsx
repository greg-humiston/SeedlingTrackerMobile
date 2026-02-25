import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Header, Seedling, SeedlingGrid, Stat, Tip } from '@/types/home';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN,
  PETAL_YELLOW, SOIL_BROWN,
} from '@/data/home';

// ─── Sub-components ───────────────────────────────────────────────────────────

type StatCardProps = Stat;

function StatCard({ emoji, label, value, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <ThemedText style={styles.statEmoji}>{emoji}</ThemedText>
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

type SeedlingGridItemProps = Seedling & {
  isSelected: boolean;
  onPress: () => void;
};

function SeedlingGridItem({ name, stage, daysOld, emoji, isSelected, onPress }: SeedlingGridItemProps) {
  return (
    <TouchableOpacity
      style={[styles.gridItem, isSelected && styles.gridItemSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <ThemedText style={styles.gridEmoji}>{emoji}</ThemedText>
      <ThemedText style={styles.gridName} numberOfLines={1}>{name}</ThemedText>
      <ThemedText style={styles.gridStage} numberOfLines={1}>{stage}</ThemedText>
      <View style={styles.gridDaysBadge}>
        <ThemedText style={styles.gridDaysText}>{daysOld}d</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

type SeedlingSummaryProps = Seedling;

function SeedlingSummary({ name, stage, daysOld, emoji }: SeedlingSummaryProps) {
  return (
    <ThemedView style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <ThemedText style={styles.summaryEmoji}>{emoji}</ThemedText>
        <View style={styles.summaryHeaderText}>
          <ThemedText style={styles.summaryName}>{name}</ThemedText>
          <ThemedText style={styles.summaryStage}>{stage}</ThemedText>
        </View>
        <View style={styles.summaryDaysBadge}>
          <ThemedText style={styles.summaryDaysValue}>{daysOld}</ThemedText>
          <ThemedText style={styles.summaryDaysLabel}>days old</ThemedText>
        </View>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryDetails}>
        <View style={styles.summaryDetailItem}>
          <ThemedText style={styles.summaryDetailLabel}>Stage</ThemedText>
          <ThemedText style={styles.summaryDetailValue}>{stage}</ThemedText>
        </View>
        <View style={styles.summaryDetailItem}>
          <ThemedText style={styles.summaryDetailLabel}>Age</ThemedText>
          <ThemedText style={styles.summaryDetailValue}>{daysOld} days</ThemedText>
        </View>
        <View style={styles.summaryDetailItem}>
          <ThemedText style={styles.summaryDetailLabel}>Health</ThemedText>
          <ThemedText style={styles.summaryDetailValue}>🟢 Good</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type SeedlingGridOverviewProps = SeedlingGrid;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SeedlingGridOverview({
  header,
  stats,
  seedlings,
  tip,
  footerIcons,
}: SeedlingGridOverviewProps) {
  const [selectedSeedling, setSelectedSeedling] = useState<Seedling | null>(null);

  const handleGridItemPress = (seedling: Seedling) => {
    setSelectedSeedling(prev => prev?.name === seedling.name ? null : seedling);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.headerGreeting}>{header.greeting}</ThemedText>
        </View>
        <ThemedText style={styles.headerTitle}>{header.title}</ThemedText>
        <ThemedText style={styles.headerSubtitle}>{header.subtitle}</ThemedText>
        <View style={styles.plantRow}>
          {header.decorativeIcons.map((icon, index) => (
            <ThemedText key={index} style={styles.plantIcon}>{icon}</ThemedText>
          ))}
        </View>
      </View>

      {/* Stats Row */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText style={styles.sectionTitle}>📊 Garden Overview</ThemedText>
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </View>
      </ThemedView>

      {/* Seedling Grid */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>🌿 My Seedlings</ThemedText>
        <ThemedText style={styles.sectionHint}>Tap a seedling to view details</ThemedText>
        <View style={styles.grid}>
          {seedlings.map((seedling) => (
            <SeedlingGridItem
              key={seedling.name}
              {...seedling}
              isSelected={selectedSeedling?.name === seedling.name}
              onPress={() => handleGridItemPress(seedling)}
            />
          ))}
        </View>
      </ThemedView>

      {/* Seedling Summary (shown when a grid item is selected) */}
      {selectedSeedling && (
        <SeedlingSummary {...selectedSeedling} />
      )}

      {/* Tip of the Day */}
      <View style={styles.tipCard}>
        <ThemedText style={styles.tipTitle}>{tip.title}</ThemedText>
        <ThemedText style={styles.tipText}>{tip.text}</ThemedText>
      </View>

      {/* Soil footer decoration */}
      <View style={styles.soilBar}>
        {footerIcons.map((icon, index) => (
          <ThemedText key={index} style={styles.soilEmoji}>{icon}</ThemedText>
        ))}
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

  // Header
  headerBanner: {
    backgroundColor: GARDEN_GREEN,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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

  // Seedling Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '30%',
    backgroundColor: '#F0F7F2',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gridItemSelected: {
    borderColor: GARDEN_GREEN,
    backgroundColor: '#E2F0E8',
  },
  gridEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  gridName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  gridStage: {
    fontSize: 10,
    color: GARDEN_GREEN,
    textAlign: 'center',
    marginTop: 2,
  },
  gridDaysBadge: {
    marginTop: 6,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gridDaysText: {
    fontSize: 10,
    fontWeight: '700',
    color: LEAF_GREEN,
  },

  // Seedling Summary
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: GARDEN_GREEN,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryEmoji: {
    fontSize: 40,
  },
  summaryHeaderText: {
    flex: 1,
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: LEAF_GREEN,
  },
  summaryStage: {
    fontSize: 13,
    color: GARDEN_GREEN,
    marginTop: 2,
  },
  summaryDaysBadge: {
    alignItems: 'center',
    backgroundColor: '#EAF4EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryDaysValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GARDEN_GREEN,
  },
  summaryDaysLabel: {
    fontSize: 10,
    color: '#888',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0EDE4',
    marginVertical: 12,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryDetailItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryDetailLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
