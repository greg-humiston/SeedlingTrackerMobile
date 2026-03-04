import { styles } from '@/styles/create-grid';
import { selectorStyles as s } from '@/styles/seedling-selector';
import type { Seedling } from '@/types/home';
import { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AddCustomSeedlingModal } from './AddCustomSeedlingModal';
import { ThemedText } from './themed-text';
import { useSeedlings, useAddSeedling } from '@/hooks/useSeedlings';

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
            filtered.map((item) => (
              <TouchableOpacity
                key={item.variety}
                style={[styles.dropdownItem]}
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
              </TouchableOpacity>
            ))
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
