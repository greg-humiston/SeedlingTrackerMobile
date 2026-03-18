import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EMOJI_OPTIONS } from '@/constants/icons';
import { CREAM, GARDEN_GREEN, LEAF_GREEN, SOIL_BROWN } from '@/data/home';
import { useSeedlings, useUpdateSeedling } from '@/hooks/useSeedlings';
import { selectorStyles as s } from '@/styles/seedling-selector';
import type { DraftSeedling, Seedling } from '@/types/home';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_OPTIONS    = ['Herb', 'Vegetable', 'Leafy Green', 'Flower', 'Fruit', 'Root Vegetable', 'Lettuce', 'Other'];
const WHERE_OPTIONS   = ['Indoors', 'Outdoors', 'Indoors or Outdoors'];
const SEASON_OPTIONS  = ['Warm', 'Cool', 'Cool to Warm'];
const FOOTER_SOIL_BAR = ['🪨', '🌱', '🪱', '🌱', '🪨'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seedlingToDraft(s: Seedling): DraftSeedling {
  return {
    variety:                      s.variety,
    type:                         s.type,
    emoji:                        s.emoji,
    whereToStart:                 s.whereToStart,
    whenToStart:                  s.whenToStart,
    soilTemperatureForGermination: s.soilTemperatureForGermination,
    spacing:                      s.spacing,
    depth:                        s.depth,
    daysToGerminate:              s.daysToGerminate,
    wateringFrequency:            s.wateringFrequency,
    season:                       s.season,
    frostTolerance:               s.frostTolerance,
    height:                       s.height,
    daysToHarvest:                s.daysToHarvest,
    soilAcidity:                  s.soilAcidity,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label, value, placeholder, multiline, onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  multiline?: boolean;
  onChangeText: (v: string) => void;
}) {
  return (
    <View style={s.inputGroup}>
      <ThemedText style={s.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[s.input, multiline && { minHeight: 60, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        multiline={multiline}
      />
    </View>
  );
}

function ChipRow({
  label, options, selected, onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={s.inputGroup}>
      <ThemedText style={s.inputLabel}>{label}</ThemedText>
      <View style={s.optionRow}>
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[s.optionChip, active && s.optionChipSelected]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.75}
            >
              <ThemedText style={[s.optionChipText, active && s.optionChipTextSelected]}>
                {opt}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Search View ──────────────────────────────────────────────────────────────

function SearchView({
  seedlings,
  onSelect,
}: {
  seedlings: Seedling[];
  onSelect: (s: Seedling) => void;
}) {
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);

  const filtered = query.trim()
    ? seedlings.filter((s) => s.variety.toLowerCase().includes(query.toLowerCase()))
    : seedlings;

  return (
    <ScrollView
      style={screenStyles.container}
      contentContainerStyle={screenStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={screenStyles.headerBanner}>
        <ThemedText style={screenStyles.headerLabel}>Seedling Catalog</ThemedText>
        <ThemedText style={screenStyles.headerTitle}>✏️ Edit Seedlings</ThemedText>
        <ThemedText style={screenStyles.headerSubtitle}>
          Search for a seedling and update its details.
        </ThemedText>
      </View>

      {/* Search Section */}
      <ThemedView style={screenStyles.section}>
        <ThemedText style={screenStyles.sectionTitle}>🌱 Select a Seedling</ThemedText>
        <ThemedText style={screenStyles.sectionHint}>
          Tap a result to open it for editing
        </ThemedText>

        {/* Search input */}
        <View style={screenStyles.dropdownTrigger}>
          <TextInput
            style={screenStyles.dropdownSearchInput}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search seedlings…"
            placeholderTextColor="#aaa"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => { setQuery(''); setOpen(false); }}
              style={screenStyles.clearBtn}
              activeOpacity={0.7}
            >
              <ThemedText style={screenStyles.clearBtnText}>✕</ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setOpen((o) => !o)} activeOpacity={0.7}>
            <ThemedText style={screenStyles.chevron}>{open ? '▲' : '▼'}</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Results list */}
        {open && (
          <View style={screenStyles.dropdownList}>
            {filtered.length === 0 ? (
              <View style={screenStyles.dropdownItem}>
                <ThemedText style={screenStyles.noResults}>
                  {'No results for "' + query + '"'}
                </ThemedText>
              </View>
            ) : (
              filtered.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={screenStyles.dropdownItem}
                  onPress={() => {
                    setOpen(false);
                    setQuery('');
                    onSelect(item);
                  }}
                  activeOpacity={0.75}
                >
                  <ThemedText style={screenStyles.dropdownItemEmoji}>{item.emoji}</ThemedText>
                  <View style={screenStyles.dropdownItemBody}>
                    <ThemedText style={screenStyles.dropdownItemName}>{item.variety}</ThemedText>
                    <ThemedText style={screenStyles.dropdownItemType}>{item.type}</ThemedText>
                  </View>
                  <ThemedText style={screenStyles.dropdownItemChevron}>›</ThemedText>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ThemedView>

      {/* Footer */}
      <View style={screenStyles.soilBar}>
        {FOOTER_SOIL_BAR.map((icon, i) => (
          <ThemedText key={i} style={screenStyles.soilEmoji}>{icon}</ThemedText>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Edit View ────────────────────────────────────────────────────────────────

function EditView({
  seedling,
  allVarieties,
  onSave,
  onCancel,
  isSaving,
}: {
  seedling: Seedling;
  allVarieties: string[];
  onSave: (draft: DraftSeedling) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [draft, setDraft] = useState<DraftSeedling>(() => seedlingToDraft(seedling));

  const set = (key: keyof DraftSeedling, value: string | boolean | null) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const trimmedVariety = draft.variety.trim();

  // Duplicate check excludes the original seedling's own name
  const isDuplicate =
    trimmedVariety.length > 0 &&
    trimmedVariety.toLowerCase() !== seedling.variety.toLowerCase() &&
    allVarieties.some((v) => v.toLowerCase() === trimmedVariety.toLowerCase());

  const canSave =
    trimmedVariety.length > 0 &&
    draft.type.length > 0 &&
    draft.emoji.length > 0 &&
    draft.whereToStart.length > 0 &&
    draft.whenToStart.trim().length > 0 &&
    draft.soilTemperatureForGermination.trim().length > 0 &&
    draft.spacing.trim().length > 0 &&
    draft.depth.trim().length > 0 &&
    draft.daysToGerminate.trim().length > 0 &&
    draft.wateringFrequency.trim().length > 0 &&
    draft.season.length > 0 &&
    draft.frostTolerance !== null &&
    draft.height.trim().length > 0 &&
    draft.daysToHarvest.trim().length > 0 &&
    draft.soilAcidity.trim().length > 0 &&
    !isDuplicate;

  return (
    <ScrollView
      style={screenStyles.container}
      contentContainerStyle={screenStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={screenStyles.headerBanner}>
        <ThemedText style={screenStyles.headerLabel}>Editing</ThemedText>
        <ThemedText style={screenStyles.headerTitle}>
          {draft.emoji || seedling.emoji} {draft.variety || seedling.variety}
        </ThemedText>
        <ThemedText style={screenStyles.headerSubtitle}>
          Update the fields below, then tap Save.
        </ThemedText>
      </View>

      {/* ── Basic Info ── */}
      <ThemedView style={screenStyles.section}>
        <ThemedText style={screenStyles.sectionTitle}>Basic Info</ThemedText>

        {/* Variety Name */}
        <View style={s.inputGroup}>
          <ThemedText style={s.inputLabel}>Variety Name</ThemedText>
          <TextInput
            style={[s.input, isDuplicate && s.inputError]}
            value={draft.variety}
            onChangeText={(v) => set('variety', v)}
            placeholder="e.g. Cherokee Purple Tomato"
            placeholderTextColor="#aaa"
          />
          {isDuplicate && (
            <ThemedText style={s.errorText}>
              {'A seedling named "' + trimmedVariety + '" already exists.'}
            </ThemedText>
          )}
        </View>

        <ChipRow label="Type" options={TYPE_OPTIONS} selected={draft.type} onSelect={(v) => set('type', v)} />

        {/* Emoji */}
        <View style={s.inputGroup}>
          <ThemedText style={s.inputLabel}>Emoji</ThemedText>
          <View style={s.emojiRow}>
            {EMOJI_OPTIONS.map((emoji) => {
              const active = draft.emoji === emoji;
              return (
                <TouchableOpacity
                  key={emoji}
                  style={[s.emojiChip, active && s.emojiChipSelected]}
                  onPress={() => set('emoji', emoji)}
                  activeOpacity={0.75}
                >
                  <ThemedText style={s.emojiChipText}>{emoji}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ThemedView>

      {/* ── Planting ── */}
      <ThemedView style={screenStyles.section}>
        <ThemedText style={screenStyles.sectionTitle}>Planting</ThemedText>
        <ChipRow label="Where to Start" options={WHERE_OPTIONS} selected={draft.whereToStart} onSelect={(v) => set('whereToStart', v)} />
        <Field label="When to Start" value={draft.whenToStart} placeholder="e.g. 6-8 weeks before last frost" onChangeText={(v) => set('whenToStart', v)} />
        <Field label="Soil Temp for Germination (°F)" value={draft.soilTemperatureForGermination} placeholder="e.g. 65-75" onChangeText={(v) => set('soilTemperatureForGermination', v)} />
      </ThemedView>

      {/* ── Spacing & Depth ── */}
      <ThemedView style={screenStyles.section}>
        <ThemedText style={screenStyles.sectionTitle}>Spacing & Depth</ThemedText>
        <Field label="Spacing" value={draft.spacing} placeholder="e.g. 12-18 inches" onChangeText={(v) => set('spacing', v)} />
        <Field label="Depth" value={draft.depth} placeholder="e.g. 1/4 inch" onChangeText={(v) => set('depth', v)} />
      </ThemedView>

      {/* ── Growth ── */}
      <ThemedView style={screenStyles.section}>
        <ThemedText style={screenStyles.sectionTitle}>Growth</ThemedText>
        <Field label="Days to Germinate" value={draft.daysToGerminate} placeholder="e.g. 7-14" onChangeText={(v) => set('daysToGerminate', v)} />
        <Field label="Watering Frequency" value={draft.wateringFrequency} placeholder="e.g. Keep soil moist, water when top inch is dry" multiline onChangeText={(v) => set('wateringFrequency', v)} />
        <ChipRow label="Season" options={SEASON_OPTIONS} selected={draft.season} onSelect={(v) => set('season', v)} />

        {/* Frost Tolerance */}
        <View style={s.inputGroup}>
          <ThemedText style={s.inputLabel}>Frost Tolerant?</ThemedText>
          <View style={s.optionRow}>
            {([true, false] as const).map((val) => {
              const label = val ? 'Yes' : 'No';
              const active = draft.frostTolerance === val;
              return (
                <TouchableOpacity
                  key={label}
                  style={[s.boolChip, active && (val ? s.boolChipSelectedYes : s.boolChipSelectedNo)]}
                  onPress={() => set('frostTolerance', val)}
                  activeOpacity={0.75}
                >
                  <ThemedText style={[s.boolChipText, active && s.boolChipTextSelected]}>
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ThemedView>

      {/* ── Expected Results ── */}
      <ThemedView style={screenStyles.section}>
        <ThemedText style={screenStyles.sectionTitle}>Expected Results</ThemedText>
        <Field label="Height" value={draft.height} placeholder="e.g. 12-24 inches" onChangeText={(v) => set('height', v)} />
        <Field label="Days to Harvest" value={draft.daysToHarvest} placeholder="e.g. 60-90" onChangeText={(v) => set('daysToHarvest', v)} />
        <Field label="Soil Acidity" value={draft.soilAcidity} placeholder="e.g. 6.0-7.0 pH" onChangeText={(v) => set('soilAcidity', v)} />
      </ThemedView>

      {/* ── Footer buttons ── */}
      <View style={screenStyles.footer}>
        <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.75}>
          <ThemedText style={s.cancelBtnText}>Cancel</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.saveBtn, (!canSave || isSaving) && s.saveBtnDisabled]}
          onPress={() => canSave && onSave(draft)}
          disabled={!canSave || isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={[s.saveBtnText, !canSave && s.saveBtnTextDisabled]}>
              💾 Save Changes
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer decoration */}
      <View style={screenStyles.soilBar}>
        {FOOTER_SOIL_BAR.map((icon, i) => (
          <ThemedText key={i} style={screenStyles.soilEmoji}>{icon}</ThemedText>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EditSeedlingScreen() {
  const { data: seedlings, isLoading } = useSeedlings();
  const { mutate: updateSeedling, isPending } = useUpdateSeedling();

  const [selectedSeedling, setSelectedSeedling] = useState<Seedling | null>(null);

  const catalog = seedlings ?? [];
  const allVarieties = catalog.map((s) => s.variety);

  const handleSelect = (s: Seedling) => {
    setSelectedSeedling(s);
  };

  const handleSave = (draft: DraftSeedling) => {
    if (!selectedSeedling) return;
    const updates: Partial<Seedling> = {
      variety:                       draft.variety.trim(),
      type:                          draft.type,
      emoji:                         draft.emoji,
      whereToStart:                  draft.whereToStart,
      whenToStart:                   draft.whenToStart.trim(),
      soilTemperatureForGermination: draft.soilTemperatureForGermination.trim(),
      spacing:                       draft.spacing.trim(),
      depth:                         draft.depth.trim(),
      daysToGerminate:               draft.daysToGerminate.trim(),
      wateringFrequency:             draft.wateringFrequency.trim(),
      season:                        draft.season,
      frostTolerance:                draft.frostTolerance as boolean,
      height:                        draft.height.trim(),
      daysToHarvest:                 draft.daysToHarvest.trim(),
      soilAcidity:                   draft.soilAcidity.trim(),
    };
    updateSeedling(
      { id: selectedSeedling.id, updates },
      {
        onSuccess: () => setSelectedSeedling(null),
        onError: (err) => Alert.alert('Error', `Could not save: ${err.message}`),
      },
    );
  };

  const handleCancel = () => setSelectedSeedling(null);

  if (isLoading) {
    return (
      <View style={screenStyles.centered}>
        <ActivityIndicator size="large" color={GARDEN_GREEN} />
        <ThemedText style={screenStyles.loadingText}>Loading seedlings…</ThemedText>
      </View>
    );
  }

  if (selectedSeedling) {
    return (
      <EditView
        seedling={selectedSeedling}
        allVarieties={allVarieties}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isPending}
      />
    );
  }

  return <SearchView seedlings={catalog} onSelect={handleSelect} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: CREAM,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },

  // Header
  headerBanner: {
    backgroundColor: GARDEN_GREEN,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 13,
    color: '#A8D5BA',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#A8D5BA',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  // Section card
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    gap: 12,
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
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginTop: -4,
  },

  // Search dropdown
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
    gap: 6,
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  clearBtn: {
    paddingHorizontal: 4,
  },
  clearBtnText: {
    fontSize: 14,
    color: '#999',
  },
  chevron: {
    fontSize: 12,
    color: '#888',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F7F2',
  },
  dropdownItemEmoji: {
    fontSize: 24,
  },
  dropdownItemBody: {
    flex: 1,
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dropdownItemType: {
    fontSize: 11,
    color: GARDEN_GREEN,
    marginTop: 1,
  },
  dropdownItemChevron: {
    fontSize: 20,
    color: GARDEN_GREEN,
  },
  noResults: {
    fontSize: 14,
    color: '#aaa',
    flex: 1,
  },

  // Footer action buttons row
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 20,
  },

  // Soil decoration bar
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
