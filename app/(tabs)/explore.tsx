import { useState } from 'react';
import {
  StyleSheet, View, ScrollView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Seedling, SeedlingGrid } from '@/types/home';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN,
  PETAL_YELLOW, SOIL_BROWN, WATER_BLUE,
} from '@/data/home';
import { useCreateGrid } from '@/hooks/useGrids';

// ─── Validation ───────────────────────────────────────────────────────────────

const ERROR_RED = '#C0392B';
const ERROR_BG  = '#FDF0EF';
const ERROR_BORDER = '#E8A09A';

// ─── Types ────────────────────────────────────────────────────────────────────

type SeedlingDraft = Omit<Seedling, 'daysOld'> & { daysOld: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGE_OPTIONS: Seedling['stage'][] = [
  'Germinating',
  'Sprouting',
  'First Leaves',
  'Established',
];

const EMOJI_OPTIONS: string[] = [
  '🌱', '🌿', '🍃', '🍅', '🌻', '💜',
  '🌸', '🌼', '🌺', '🥬', '🌽', '🥕',
];

const EMPTY_SEEDLING: SeedlingDraft = {
  name: '',
  stage: 'Germinating',
  daysOld: '',
  emoji: '🌱',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

type LabeledInputProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  submitted?: boolean;
  error?: string;
  keyboardType?: 'default' | 'numeric';
};

function LabeledInput({ label, value, placeholder, onChangeText, submitted, error, keyboardType = 'default' }: LabeledInputProps) {
  const hasError = submitted && !!error;
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {hasError && (
        <ThemedText style={styles.errorText}>⚠ {error}</ThemedText>
      )}
    </View>
  );
}

type StageSelectorProps = {
  selected: Seedling['stage'];
  onSelect: (stage: Seedling['stage']) => void;
};

function StageSelector({ selected, onSelect }: StageSelectorProps) {
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>Stage</ThemedText>
      <View style={styles.optionRow}>
        {STAGE_OPTIONS.map((stage) => (
          <TouchableOpacity
            key={stage}
            style={[styles.optionChip, selected === stage && styles.optionChipSelected]}
            onPress={() => onSelect(stage)}
          >
            <ThemedText style={[styles.optionChipText, selected === stage && styles.optionChipTextSelected]}>
              {stage}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type EmojiSelectorProps = {
  selected: string;
  onSelect: (emoji: string) => void;
};

function EmojiSelector({ selected, onSelect }: EmojiSelectorProps) {
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>Emoji</ThemedText>
      <View style={styles.optionRow}>
        {EMOJI_OPTIONS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[styles.emojiChip, selected === emoji && styles.emojiChipSelected]}
            onPress={() => onSelect(emoji)}
          >
            <ThemedText style={styles.emojiChipText}>{emoji}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type ValidationRowProps = {
  met: boolean;
  submitted: boolean;
  label: string;
};

function ValidationRow({ met, submitted, label }: ValidationRowProps) {
  // Before first submit: always show neutral (pending) state
  const showMet = met;
  const showUnmet = submitted && !met;
  return (
    <View style={styles.validationRow}>
      <View style={[
        styles.validationDot,
        showMet ? styles.validationDotMet : showUnmet ? styles.validationDotUnmet : styles.validationDotPending,
      ]}>
        <ThemedText style={styles.validationDotText}>{showMet ? '✓' : showUnmet ? '✕' : '·'}</ThemedText>
      </View>
      <ThemedText style={[
        styles.validationLabel,
        showMet ? styles.validationLabelMet : showUnmet ? styles.validationLabelUnmet : styles.validationLabelPending,
      ]}>
        {label}
      </ThemedText>
    </View>
  );
}

type SeedlingCardProps = {
  seedling: SeedlingDraft;
  index: number;
  onRemove: () => void;
};

function SeedlingCard({ seedling, index, onRemove }: SeedlingCardProps) {
  return (
    <View style={styles.seedlingCard}>
      <ThemedText style={styles.seedlingCardEmoji}>{seedling.emoji}</ThemedText>
      <View style={styles.seedlingCardInfo}>
        <ThemedText style={styles.seedlingCardName}>{seedling.name || `Seedling ${index + 1}`}</ThemedText>
        <ThemedText style={styles.seedlingCardMeta}>
          {seedling.stage} · {seedling.daysOld || '0'}d old
        </ThemedText>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <ThemedText style={styles.removeButtonText}>✕</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreateGridScreen() {
  const router = useRouter();
  const { mutate: createGrid, isPending } = useCreateGrid();

  // Grid-level fields
  const [gridName, setGridName] = useState('');
  const [gridDescription, setGridDescription] = useState('');
  const [gridEmoji, setGridEmoji] = useState('🌱');

  // submitted — validation display is gated until the user first presses Create
  const [submitted, setSubmitted] = useState(false);

  // Seedling draft form
  const [draft, setDraft] = useState<SeedlingDraft>(EMPTY_SEEDLING);

  // Accumulated seedlings
  const [seedlings, setSeedlings] = useState<SeedlingDraft[]>([]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const errors = {
    gridName: gridName.trim().length < 1 ? 'Garden name is required.' : undefined,
    gridDescription: gridDescription.trim().length < 1 ? 'Description is required.' : undefined,
    seedlings: seedlings.length === 0 ? 'At least one seedling is required.' : undefined,
  };

  const canCreate = !errors.gridName && !errors.gridDescription && !errors.seedlings;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const updateDraft = (fields: Partial<SeedlingDraft>) =>
    setDraft((prev) => ({ ...prev, ...fields }));

  const handleAddSeedling = () => {
    if (!draft.name.trim()) {
      Alert.alert('Missing name', 'Please enter a name for the seedling.');
      return;
    }
    setSeedlings((prev) => [...prev, draft]);
    setDraft(EMPTY_SEEDLING);
  };

  const handleRemoveSeedling = (index: number) =>
    setSeedlings((prev) => prev.filter((_, i) => i !== index));

  const handleCreate = () => {
    // Activate validation display on first press
    setSubmitted(true);
    if (!canCreate) return;

    const newGrid: Omit<SeedlingGrid, 'id'> = {
      name: gridName.trim(),
      emoji: gridEmoji,
      description: gridDescription.trim() || 'A new seedling garden',
      header: {
        greeting: 'Good morning,',
        title: `${gridEmoji} ${gridName.trim()}`,
        subtitle: `Your ${gridName.trim()} is growing beautifully!`,
        decorativeIcons: ['🌿', '🌱', '🌿', '🍃', '🌱', '🌿'],
      },
      stats: [
        { emoji: '🌱', label: 'Seedlings', value: String(seedlings.length), color: GARDEN_GREEN },
        { emoji: '💧', label: 'Need Water', value: '0', color: WATER_BLUE },
        { emoji: '☀️', label: 'Days Active', value: '0', color: PETAL_YELLOW },
      ],
      seedlings: seedlings.map((s) => ({
        name: s.name.trim(),
        stage: s.stage,
        daysOld: parseInt(s.daysOld, 10) || 0,
        emoji: s.emoji,
      })),
      tip: {
        title: '🌸 Garden Tip of the Day',
        text: 'Water your seedlings in the early morning to reduce evaporation and prevent fungal growth.',
      },
      footerIcons: ['🪨', '🌱', '🪱', '🌱', '🪨'],
    };

    createGrid(newGrid, {
      onSuccess: (created) => {
        // Reset form
        setGridName('');
        setGridDescription('');
        setGridEmoji('🌱');
        setSeedlings([]);
        setSubmitted(false);
        // Navigate to the newly created grid's detail screen
        router.push({ pathname: '/(tabs)/grid/[id]', params: { id: created.id } });
      },
      onError: (err) => {
        Alert.alert('Error', `Could not create garden: ${err.message}`);
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.headerBanner}>
        <ThemedText style={styles.headerLabel}>New Garden</ThemedText>
        <ThemedText style={styles.headerTitle}>🌱 Create a Grid</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Name your garden, pick an emoji, and add your seedlings.
        </ThemedText>
      </View>

      {/* Garden Details */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>🌿 Garden Details</ThemedText>

        <LabeledInput
          label="Garden Name"
          value={gridName}
          placeholder="e.g. Herb Garden"
          onChangeText={setGridName}
          submitted={submitted}
          error={errors.gridName}
        />

        <LabeledInput
          label="Description"
          value={gridDescription}
          placeholder="e.g. Kitchen herbs and aromatics"
          onChangeText={setGridDescription}
          submitted={submitted}
          error={errors.gridDescription}
        />

        <EmojiSelector selected={gridEmoji} onSelect={setGridEmoji} />
      </ThemedView>

      {/* Add Seedling */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>🌱 Add a Seedling</ThemedText>

        <LabeledInput
          label="Seedling Name"
          value={draft.name}
          placeholder="e.g. Sweet Basil"
          onChangeText={(text) => updateDraft({ name: text })}
        />

        <LabeledInput
          label="Days Old"
          value={draft.daysOld}
          placeholder="e.g. 7"
          onChangeText={(text) => updateDraft({ daysOld: text })}
          keyboardType="numeric"
        />

        <StageSelector
          selected={draft.stage}
          onSelect={(stage) => updateDraft({ stage })}
        />

        <EmojiSelector
          selected={draft.emoji}
          onSelect={(emoji) => updateDraft({ emoji })}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddSeedling}>
          <ThemedText style={styles.addButtonText}>+ Add Seedling</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Seedling List */}
      {seedlings.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            🍃 Seedlings ({seedlings.length})
          </ThemedText>
          {seedlings.map((s, i) => (
            <SeedlingCard
              key={i}
              seedling={s}
              index={i}
              onRemove={() => handleRemoveSeedling(i)}
            />
          ))}
        </ThemedView>
      )}

      {/* Validation Checklist */}
      <ThemedView style={styles.checklistCard}>
        <ThemedText style={styles.checklistTitle}>Requirements</ThemedText>
        <ValidationRow met={!errors.gridName} submitted={submitted} label="Garden name filled in" />
        <ValidationRow met={!errors.gridDescription} submitted={submitted} label="Description filled in" />
        <ValidationRow met={!errors.seedlings} submitted={submitted} label="At least one seedling added" />
      </ThemedView>

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, (submitted && !canCreate) && styles.createButtonDisabled]}
        onPress={handleCreate}
        activeOpacity={0.8}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={[styles.createButtonText, (submitted && !canCreate) && styles.createButtonTextDisabled]}>
            🌱 Create Garden
          </ThemedText>
        )}
      </TouchableOpacity>

      {/* Footer */}
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 40,
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
    color: LIGHT_GREEN,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: LIGHT_GREEN,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: LEAF_GREEN,
  },

  // Inputs
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F0F7F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
  },

  // Option chips (stage + emoji)
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F7F2',
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
  },
  optionChipSelected: {
    backgroundColor: GARDEN_GREEN,
    borderColor: GARDEN_GREEN,
  },
  optionChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emojiChip: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0F7F2',
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiChipSelected: {
    borderColor: GARDEN_GREEN,
    backgroundColor: '#E2F0E8',
  },
  emojiChipText: {
    fontSize: 20,
  },

  // Add seedling button
  addButton: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: LEAF_GREEN,
  },

  // Seedling cards
  seedlingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F2',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
  },
  seedlingCardEmoji: {
    fontSize: 28,
  },
  seedlingCardInfo: {
    flex: 1,
  },
  seedlingCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: LEAF_GREEN,
  },
  seedlingCardMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 12,
    color: '#C0392B',
    fontWeight: '700',
  },

  // Input error state
  inputError: {
    borderColor: ERROR_BORDER,
    backgroundColor: ERROR_BG,
  },
  errorText: {
    fontSize: 12,
    color: ERROR_RED,
    marginTop: 2,
  },

  // Validation checklist
  checklistCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 10,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  validationDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationDotMet: {
    backgroundColor: GARDEN_GREEN,
  },
  validationDotUnmet: {
    backgroundColor: ERROR_RED,
  },
  validationDotPending: {
    backgroundColor: '#D0D0D0',
  },
  validationDotText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  validationLabel: {
    fontSize: 14,
  },
  validationLabelMet: {
    color: LEAF_GREEN,
    fontWeight: '500',
  },
  validationLabelUnmet: {
    color: ERROR_RED,
  },
  validationLabelPending: {
    color: '#999',
  },

  // Create button
  createButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: GARDEN_GREEN,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: '#B0C4B8',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  createButtonTextDisabled: {
    color: '#E8F0E9',
  },

  // Footer
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
