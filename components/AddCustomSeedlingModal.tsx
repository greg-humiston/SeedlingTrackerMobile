import { EMOJI_OPTIONS } from '@/constants/icons';
import { selectorStyles as s } from '@/styles/seedling-selector';
import type { DraftSeedling, Seedling } from '@/types/home';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SeedPacketPicker from './SeedPacketPicker';
import { ThemedText } from './themed-text';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = ['Herb', 'Vegetable', 'Leafy Green', 'Flower', 'Fruit', 'Root Vegetable', 'Lettuce', 'Other'];
const WHERE_OPTIONS = ['Indoors', 'Outdoors', 'Both'];
const SEASON_OPTIONS = ['Warm', 'Cool', 'Cool to Warm'];

const EMPTY_DRAFT: DraftSeedling = {
  variety: '',
  type: '',
  emoji: '',
  whereToStart: '',
  whenToStart: '',
  soilTemperatureForGermination: '',
  spacing: '',
  depth: '',
  daysToGerminate: '',
  wateringFrequency: '',
  season: '',
  frostTolerance: null,
  height: '',
  daysToHarvest: '',
  soilAcidity: '',
};

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  existingVarieties: string[];
  nextId: number;
  onSave: (seedling: Seedling) => void;
  onCancel: () => void;
};

// ─── Sub-components (defined outside to prevent focus loss on re-render) ──────

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
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
  label,
  options,
  selected,
  onSelect,
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

// ─── Component ────────────────────────────────────────────────────────────────

export function AddCustomSeedlingModal({ visible, existingVarieties, nextId, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<DraftSeedling>(EMPTY_DRAFT);

  const set = (key: keyof DraftSeedling, value: string | boolean | null) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSeedlingExtracted = (extracted: DraftSeedling) =>
    setDraft((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(extracted) as (keyof DraftSeedling)[]) {
        const val = extracted[key];
        if (val !== '' && val !== null) {
          (next as any)[key] = val;
        }
      }
      return next;
    });

  // ── Validation ──────────────────────────────────────────────────────────────

  const trimmedVariety = draft.variety.trim();
  const isDuplicate =
    trimmedVariety.length > 0 &&
    existingVarieties.some((v) => v.toLowerCase() === trimmedVariety.toLowerCase());

  const allFilled =
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
    draft.soilAcidity.trim().length > 0;

  const canSave = allFilled && !isDuplicate;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (!canSave) return;
    const seedling: Seedling = {
      id: nextId,
      variety: trimmedVariety,
      type: draft.type,
      emoji: draft.emoji,
      whereToStart: draft.whereToStart,
      whenToStart: draft.whenToStart.trim(),
      soilTemperatureForGermination: draft.soilTemperatureForGermination.trim(),
      spacing: draft.spacing.trim(),
      depth: draft.depth.trim(),
      daysToGerminate: draft.daysToGerminate.trim(),
      wateringFrequency: draft.wateringFrequency.trim(),
      season: draft.season,
      frostTolerance: draft.frostTolerance as boolean,
      height: draft.height.trim(),
      daysToHarvest: draft.daysToHarvest.trim(),
      soilAcidity: draft.soilAcidity.trim(),
    };
    setDraft(EMPTY_DRAFT);
    onSave(seedling);
  };

  const handleCancel = () => {
    setDraft(EMPTY_DRAFT);
    onCancel();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={s.overlay}>

        <View style={s.card}>
          <View style={s.cardHandle} />
          <View style={s.cardHeader}>
            <ThemedText style={s.cardTitle}>Add Custom Seedling</ThemedText>
            <ThemedText style={s.cardSubtitle}>Fill in all fields to save your variety</ThemedText>
          </View>
          <View>
            <SeedPacketPicker onSeedlingExtracted={handleSeedlingExtracted} />
          </View>

          <ScrollView
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Basic Info ── */}
            <View style={s.section}>
              <ThemedText style={s.sectionTitle}>Basic Info</ThemedText>

              {/* Variety */}
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

              <ChipRow
                label="Type"
                options={TYPE_OPTIONS}
                selected={draft.type}
                onSelect={(v) => set('type', v)}
              />

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
            </View>

            {/* ── Planting ── */}
            <View style={s.section}>
              <ThemedText style={s.sectionTitle}>Planting</ThemedText>
              <ChipRow
                label="Where to Start"
                options={WHERE_OPTIONS}
                selected={draft.whereToStart}
                onSelect={(v) => set('whereToStart', v)}
              />
              <Field label="When to Start" value={draft.whenToStart} onChangeText={(v) => set('whenToStart', v)} placeholder="e.g. 6-8 weeks before last frost" />
              <Field
                label="Soil Temp for Germination (°C)"
                value={draft.soilTemperatureForGermination}
                onChangeText={(v) => set('soilTemperatureForGermination', v)}
                placeholder="e.g. 18-24"
              />
            </View>

            {/* ── Spacing & Depth ── */}
            <View style={s.section}>
              <ThemedText style={s.sectionTitle}>Spacing & Depth</ThemedText>
              <Field label="Spacing" value={draft.spacing} onChangeText={(v) => set('spacing', v)} placeholder="e.g. 12-18 inches" />
              <Field label="Depth" value={draft.depth} onChangeText={(v) => set('depth', v)} placeholder="e.g. 1/4 inch" />
            </View>

            {/* ── Growth ── */}
            <View style={s.section}>
              <ThemedText style={s.sectionTitle}>Growth</ThemedText>
              <Field label="Days to Germinate" value={draft.daysToGerminate} onChangeText={(v) => set('daysToGerminate', v)} placeholder="e.g. 7-14" />
              <Field
                label="Watering Frequency"
                value={draft.wateringFrequency}
                onChangeText={(v) => set('wateringFrequency', v)}
                placeholder="e.g. Keep soil moist, water when top inch is dry"
                multiline
              />
              <ChipRow
                label="Season"
                options={SEASON_OPTIONS}
                selected={draft.season}
                onSelect={(v) => set('season', v)}
              />

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
                        style={[
                          s.boolChip,
                          active && (val ? s.boolChipSelectedYes : s.boolChipSelectedNo),
                        ]}
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
            </View>

            {/* ── Expected Results ── */}
            <View style={s.section}>
              <ThemedText style={s.sectionTitle}>Expected Results</ThemedText>
              <Field label="Height" value={draft.height} onChangeText={(v) => set('height', v)} placeholder="e.g. 12-24 inches" />
              <Field label="Days to Harvest" value={draft.daysToHarvest} onChangeText={(v) => set('daysToHarvest', v)} placeholder="e.g. 60-90" />
              <Field label="Soil Acidity" value={draft.soilAcidity} onChangeText={(v) => set('soilAcidity', v)} placeholder="e.g. 6.0-7.0 pH" />
            </View>
          </ScrollView>

          {/* ── Footer ── */}
          <View style={s.footer}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleCancel} activeOpacity={0.75}>
              <ThemedText style={s.cancelBtnText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, !canSave && s.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!canSave}
              activeOpacity={0.8}
            >
              <ThemedText style={[s.saveBtnText, !canSave && s.saveBtnTextDisabled]}>
                Save Seedling
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AddCustomSeedlingModal;
