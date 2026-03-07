import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { GARDEN_GREEN } from '@/data/home';
import {
  ZONE_BAND_LABELS,
  ZONE_BANDS,
  getPlantsForZoneAndMonth,
  type PlantEntry,
  type ZoneBand,
} from '@/data/planting-calendar';
import { ThemedText } from './themed-text';

const STORAGE_KEY = '@seedling_tracker/zone';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SOW_METHOD_COLORS: Record<string, string> = {
  'Direct sow':    '#4CAF50',
  'Start indoors': '#FF9800',
  'Transplant':    '#2196F3',
};

// ─── Plant detail popup ────────────────────────────────────────────────────────

function PlantDetailModal({
  plant,
  onClose,
}: {
  plant: PlantEntry;
  onClose: () => void;
}) {
  const badgeColor = SOW_METHOD_COLORS[plant.sowMethod] ?? GARDEN_GREEN;

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={modalStyles.backdrop} onPress={onClose}>
        <Pressable style={modalStyles.card} onPress={() => {}}>
          <View style={modalStyles.header}>
            <ThemedText style={modalStyles.emoji}>{plant.emoji}</ThemedText>
            <View style={modalStyles.headerText}>
              <ThemedText style={modalStyles.name}>{plant.name}</ThemedText>
              <ThemedText style={modalStyles.tagline}>{plant.tagline}</ThemedText>
            </View>
          </View>

          <ThemedText style={modalStyles.description}>{plant.description}</ThemedText>

          <View style={modalStyles.statsRow}>
            <View style={modalStyles.statItem}>
              <ThemedText style={modalStyles.statLabel}>Days to Harvest</ThemedText>
              <ThemedText style={modalStyles.statValue}>{plant.daysToHarvest}</ThemedText>
            </View>
            <View style={modalStyles.statDivider} />
            <View style={modalStyles.statItem}>
              <ThemedText style={modalStyles.statLabel}>Spacing</ThemedText>
              <ThemedText style={modalStyles.statValue}>{plant.spacing}</ThemedText>
            </View>
            <View style={modalStyles.statDivider} />
            <View style={modalStyles.statItem}>
              <ThemedText style={modalStyles.statLabel}>Method</ThemedText>
              <ThemedText style={[modalStyles.statValue, { color: badgeColor }]}>
                {plant.sowMethod}
              </ThemedText>
            </View>
          </View>

          <View style={modalStyles.tipBox}>
            <ThemedText style={modalStyles.tipTitle}>Pro Tip</ThemedText>
            <ThemedText style={modalStyles.tipText}>{plant.tip}</ThemedText>
          </View>

          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose} activeOpacity={0.8}>
            <ThemedText style={modalStyles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Zone picker popup ─────────────────────────────────────────────────────────

function ZonePickerModal({
  current,
  onSelect,
  onClose,
}: {
  current: ZoneBand | null;
  onSelect: (zone: ZoneBand) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={modalStyles.backdrop} onPress={onClose}>
        <Pressable style={[modalStyles.card, { paddingBottom: 16 }]} onPress={() => {}}>
          <ThemedText style={modalStyles.name}>Select Your Growing Zone</ThemedText>
          <ThemedText style={[modalStyles.tagline, { marginBottom: 16 }]}>
            This determines which plants are in season for you
          </ThemedText>
          {ZONE_BANDS.map((band) => (
            <TouchableOpacity
              key={band}
              style={[
                zoneStyles.option,
                current === band && zoneStyles.optionSelected,
              ]}
              onPress={() => onSelect(band)}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  zoneStyles.optionText,
                  current === band && zoneStyles.optionTextSelected,
                ]}
              >
                {ZONE_BAND_LABELS[band]}
              </ThemedText>
              {current === band && (
                <ThemedText style={zoneStyles.checkmark}>✓</ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Slideshow card ────────────────────────────────────────────────────────────

function PlantCard({ plant, onPress }: { plant: PlantEntry; onPress: () => void }) {
  const badgeColor = SOW_METHOD_COLORS[plant.sowMethod] ?? GARDEN_GREEN;

  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.85}>
      <ThemedText style={cardStyles.emoji}>{plant.emoji}</ThemedText>
      <ThemedText style={cardStyles.name}>{plant.name}</ThemedText>
      <ThemedText style={cardStyles.tagline} numberOfLines={2}>
        {plant.tagline}
      </ThemedText>
      <View style={[cardStyles.badge, { backgroundColor: badgeColor + '22', borderColor: badgeColor }]}>
        <ThemedText style={[cardStyles.badgeText, { color: badgeColor }]}>
          {plant.sowMethod}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PlantingSlideshow() {
  const [zone, setZone] = useState<ZoneBand | null>(null);
  const [zoneLoaded, setZoneLoaded] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantEntry | null>(null);
  const [zonePickerOpen, setZonePickerOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  const monthName = MONTH_NAMES[now.getMonth()];

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored && ZONE_BANDS.includes(stored as ZoneBand)) {
        setZone(stored as ZoneBand);
      }
      setZoneLoaded(true);
    });
  }, []);

  const handleZoneSelect = async (selected: ZoneBand) => {
    setZone(selected);
    setZonePickerOpen(false);
    await AsyncStorage.setItem(STORAGE_KEY, selected);
  };

  if (!zoneLoaded) return null;

  const plants = zone ? getPlantsForZoneAndMonth(zone, currentMonth) : [];

  return (
    <View style={slideshowStyles.wrapper}>
      {/* Section header */}
      <View style={slideshowStyles.headerRow}>
        <View>
          <ThemedText style={slideshowStyles.sectionTitle}>🌱 Plant Now</ThemedText>
          <ThemedText style={slideshowStyles.sectionHint}>
            {zone
              ? `${monthName} picks for ${ZONE_BAND_LABELS[zone]}`
              : 'Set your zone to see recommendations'}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={slideshowStyles.zoneButton}
          onPress={() => setZonePickerOpen(true)}
          activeOpacity={0.8}
        >
          <ThemedText style={slideshowStyles.zoneButtonText}>
            {zone ? ZONE_BAND_LABELS[zone] : 'Set zone'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* No zone set */}
      {!zone && (
        <TouchableOpacity
          style={slideshowStyles.noZoneCard}
          onPress={() => setZonePickerOpen(true)}
          activeOpacity={0.8}
        >
          <ThemedText style={slideshowStyles.noZoneEmoji}>📍</ThemedText>
          <ThemedText style={slideshowStyles.noZoneText}>
            Tap to set your growing zone and see what to plant this month
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* No plants for this zone/month */}
      {zone && plants.length === 0 && (
        <View style={slideshowStyles.noZoneCard}>
          <ThemedText style={slideshowStyles.noZoneEmoji}>😴</ThemedText>
          <ThemedText style={slideshowStyles.noZoneText}>
            No planting recommendations for {monthName} in {ZONE_BAND_LABELS[zone]}. Check back next month!
          </ThemedText>
        </View>
      )}

      {/* Horizontal carousel — extends edge-to-edge so scroll is not clipped */}
      {zone && plants.length > 0 && (
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={slideshowStyles.carousel}
          style={slideshowStyles.carouselScroll}
        >
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onPress={() => setSelectedPlant(plant)}
            />
          ))}
        </ScrollView>
      )}

      {/* Modals */}
      {selectedPlant && (
        <PlantDetailModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}
      {zonePickerOpen && (
        <ZonePickerModal
          current={zone}
          onSelect={handleZoneSelect}
          onClose={() => setZonePickerOpen(false)}
        />
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const slideshowStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
  },
  zoneButton: {
    backgroundColor: GARDEN_GREEN,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  zoneButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  carouselScroll: {
    marginHorizontal: -16,
  },
  carousel: {
    gap: 12,
    paddingHorizontal: 16,
  },
  noZoneCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  noZoneEmoji: {
    fontSize: 32,
  },
  noZoneText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 19,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: '#F0F7F2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 36,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    lineHeight: 15,
  },
  badge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  emoji: {
    fontSize: 48,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1B5E20',
  },
  tagline: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 21,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F9F5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#DDE8DD',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  tipBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F57F17',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
  },
  closeButton: {
    backgroundColor: GARDEN_GREEN,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

const zoneStyles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: GARDEN_GREEN,
  },
  optionText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: GARDEN_GREEN,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 16,
    color: GARDEN_GREEN,
    fontWeight: '700',
  },
});
