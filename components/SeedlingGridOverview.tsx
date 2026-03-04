import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { styles } from '@/styles/seedling-grid-overview';
import type { SeedlingGrid, SelectedSeedling, Stat } from '@/types/home';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

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

type SeedlingGridItemProps = SelectedSeedling & {
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

type SeedlingSummaryProps = SelectedSeedling;

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
  const [selectedSeedling, setSelectedSeedling] = useState<SelectedSeedling | null>(null);

  const handleGridItemPress = (seedling: SelectedSeedling) => {
    setSelectedSeedling(prev => prev?.variety === seedling.variety ? null : seedling);
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
              key={seedling.variety}
              {...seedling}
              isSelected={selectedSeedling?.variety === seedling.variety}
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
