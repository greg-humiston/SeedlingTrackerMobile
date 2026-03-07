import {
  PLANTS,
  ZONE_BANDS,
  getPlantsForZoneAndMonth,
  type ZoneBand,
} from '@/data/planting-calendar';
import { useAddSeedling, useSeedlings } from '@/hooks/useSeedlings';
import { styles } from '@/styles/create-grid';
import { selectorStyles as s } from '@/styles/seedling-selector';
import type { Seedling } from '@/types/home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddCustomSeedlingModal } from './AddCustomSeedlingModal';
import { ThemedText } from './themed-text';

const ZONE_STORAGE_KEY = '@seedling_tracker/zone';

function getStartLocation(whereToStart: string): 'Indoors' | 'Outdoors' | 'Both' {
  const v = whereToStart.toLowerCase();
  if (v.startsWith('indoors or') || v.startsWith('indoors and')) return 'Both';
  if (v.startsWith('indoors')) return 'Indoors';
  return 'Outdoors';
}

function getPlantingStatus(
  variety: string,
  zone: ZoneBand | null,
  inSeasonNames: Set<string>,
  allCalendarNames: Set<string>,
): 'ready' | 'not-in-season' | 'no-zone' | null {
  const key = variety.toLowerCase();
  if (!allCalendarNames.has(key)) return null;
  if (!zone) return 'no-zone';
  return inSeasonNames.has(key) ? 'ready' : 'not-in-season';
}

export function SeedlingSelector({
  onSelect,
}: {
  onSelect: (s: Seedling) => void;
}) {
  const { data: seedlings } = useSeedlings();
  const addSeedlingMutation = useAddSeedling();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [zone, setZone] = useState<ZoneBand | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ZONE_STORAGE_KEY).then((stored) => {
      if (stored && ZONE_BANDS.includes(stored as ZoneBand)) {
        setZone(stored as ZoneBand);
      }
    });
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  const allCalendarNames = new Set(PLANTS.map((p) => p.name.toLowerCase()));
  const inSeasonNames = zone
    ? new Set(getPlantsForZoneAndMonth(zone, currentMonth).map((p) => p.name.toLowerCase()))
    : new Set<string>();

  const catalog = seedlings ?? [];

  const filtered = query.trim()
    ? catalog.filter((s) => s.variety?.toLowerCase().includes(query.toLowerCase()))
    : catalog;

  const nextId = catalog.length > 0 ? Math.max(...catalog.map((s) => s.id)) + 1 : 1;
  const existingVarieties = catalog.map((s) => s.variety);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (text.length > 0) setOpen(true);
  };

  const handleClear = () => setQuery('');

  const handleSaveCustom = (seedling: Seedling) => {
    addSeedlingMutation.mutate(seedling);
    setModalVisible(false);
  };

  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>Seedling</ThemedText>
      <View style={styles.dropdownTrigger}>
        <TextInput
          style={styles.dropdownSearchInput}
          value={query}
          onChangeText={handleChangeText}
          placeholder={'Search seeds to choose…'}
          placeholderTextColor={'#aaa'}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.dropdownClearBtn} activeOpacity={0.7}>
            <ThemedText style={styles.dropdownClearBtnText}>✕</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setOpen((o) => !o)} activeOpacity={0.7}>
          <ThemedText style={styles.dropdownChevron}>{open ? '▲' : '▼'}</ThemedText>
        </TouchableOpacity>
      </View>

      {open && (
        <View style={styles.dropdownList}>
          {filtered.length === 0 ? (
            <View style={styles.dropdownItem}>
              <ThemedText style={styles.dropdownPlaceholder}>{'No results for "' + query + '"'}</ThemedText>
            </View>
          ) : (
            filtered.map((item) => {
              const status = getPlantingStatus(item.variety, zone, inSeasonNames, allCalendarNames);
              return (
                <TouchableOpacity
                  key={item.variety}
                  style={[styles.dropdownItem, status === 'ready' && styles.plantingReadyItem]}
                  onPress={() => {
                    setOpen(false);
                    setQuery('');
                    onSelect(item);
                  }}
                  activeOpacity={0.75}
                >
                  <ThemedText style={styles.dropdownItemEmoji}>{item.emoji}</ThemedText>
                  <View style={styles.dropdownItemText}>
                    <ThemedText style={styles.dropdownItemName}>{item.variety}</ThemedText>
                  </View>
                  <View style={styles.plantingBadgeLocation}>
                    <ThemedText style={styles.plantingBadgeText}>
                      {getStartLocation(item.whereToStart)}
                    </ThemedText>
                  </View>
                  {status === 'ready' && (
                    <View style={styles.plantingBadgeReady}>
                      <ThemedText style={styles.plantingBadgeText}>Plant now</ThemedText>
                    </View>
                  )}
                  {status === 'not-in-season' && (
                    <View style={styles.plantingBadgeWait}>
                      <ThemedText style={styles.plantingBadgeText}>Not in season</ThemedText>
                    </View>
                  )}
                  {status === 'no-zone' && (
                    <View style={styles.plantingBadgeNoZone}>
                      <ThemedText style={styles.plantingBadgeText}>Set zone</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      <TouchableOpacity
        style={s.addCustomBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.75}
      >
        <ThemedText style={s.addCustomBtnText}>+ Add Custom Seedling</ThemedText>
      </TouchableOpacity>

      <AddCustomSeedlingModal
        visible={modalVisible}
        existingVarieties={existingVarieties}
        nextId={nextId}
        onSave={handleSaveCustom}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}

export default SeedlingSelector;
