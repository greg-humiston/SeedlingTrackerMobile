import { useRef, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Seedling, SeedlingGrid } from '@/types/home';
import {
  GARDEN_GREEN, PETAL_YELLOW, WATER_BLUE,
} from '@/data/home';
import { useCreateGrid } from '@/hooks/useGrids';
import { styles } from '@/styles/create-grid';

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_SIZE    = 72;
const CELL_GAP     = 8;   // margin: 4 on each side = 8px gap
const DEFAULT_COLS = 4;
const DEFAULT_ROWS = 3;

const STAGE_OPTIONS: Seedling['stage'][] = [
  'Germinating',
  'Sprouting',
  'First Leaves',
  'Established',
];

const EMOJI_OPTIONS = [
  '🌱', '🌿', '🍃', '🍅', '🌻', '💜',
  '🌸', '🌼', '🌺', '🥬', '🌽', '🥕',
];

// ─── Types ────────────────────────────────────────────────────────────────────

type SeedlingDraft = Omit<Seedling, 'daysOld'> & { daysOld: string };

type CellLayout = { x: number; y: number; width: number; height: number };

const EMPTY_SEEDLING: SeedlingDraft = {
  name: '',
  stage: 'Germinating',
  daysOld: '',
  emoji: '🌱',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LabeledInput({
  label, value, placeholder, onChangeText, submitted, error, keyboardType = 'default',
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  submitted?: boolean;
  error?: string;
  keyboardType?: 'default' | 'numeric';
}) {
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
      {hasError && <ThemedText style={styles.errorText}>⚠ {error}</ThemedText>}
    </View>
  );
}

function StageSelector({
  selected, onSelect,
}: {
  selected: Seedling['stage'];
  onSelect: (s: Seedling['stage']) => void;
}) {
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

function EmojiSelector({
  selected, onSelect,
}: {
  selected: string;
  onSelect: (emoji: string) => void;
}) {
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

function ValidationRow({
  met, submitted, label,
}: {
  met: boolean;
  submitted: boolean;
  label: string;
}) {
  const showMet   = met;
  const showUnmet = submitted && !met;
  return (
    <View style={styles.validationRow}>
      <View style={[
        styles.validationDot,
        showMet ? styles.validationDotMet : showUnmet ? styles.validationDotUnmet : styles.validationDotPending,
      ]}>
        <ThemedText style={styles.validationDotText}>
          {showMet ? '✓' : showUnmet ? '✕' : '·'}
        </ThemedText>
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

function GridSizeControl({
  label, value, onIncrement, onDecrement, decrementDisabled,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  decrementDisabled: boolean;
}) {
  return (
    <View style={styles.sizeControlRow}>
      <ThemedText style={styles.sizeLabel}>{label}</ThemedText>
      <TouchableOpacity
        style={[styles.sizeButton, decrementDisabled && styles.sizeButtonDisabled]}
        onPress={onDecrement}
        disabled={decrementDisabled}
        activeOpacity={0.75}
      >
        <ThemedText style={styles.sizeButtonText}>−</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.sizeValue}>{value}</ThemedText>
      <TouchableOpacity
        style={styles.sizeButton}
        onPress={onIncrement}
        activeOpacity={0.75}
      >
        <ThemedText style={styles.sizeButtonText}>+</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

// ── EmptyCell ──────────────────────────────────────────────────────────────────

function EmptyCell({
  index,
  cellLayouts,
}: {
  index: number;
  cellLayouts: React.MutableRefObject<(CellLayout | null)[]>;
}) {
  return (
    <View
      style={[styles.cell, styles.cellEmpty]}
      onLayout={(e) => {
        cellLayouts.current[index] = e.nativeEvent.layout;
      }}
    />
  );
}

// ── DraggableCell ──────────────────────────────────────────────────────────────

type DraggableCellProps = {
  index: number;
  seedling: SeedlingDraft;
  cellLayouts: React.MutableRefObject<(CellLayout | null)[]>;
  scrollOffsetY: React.MutableRefObject<number>;
  onDragEnd: (fromIndex: number, absoluteX: number, absoluteY: number) => void;
};

function DraggableCell({
  index, seedling, cellLayouts, scrollOffsetY, onDragEnd,
}: DraggableCellProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale      = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(1.1);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      scale.value      = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(onDragEnd)(index, event.absoluteX, event.absoluteY + scrollOffsetY.current);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: scale.value > 1 ? 10 : 1,
    shadowOpacity: scale.value > 1 ? 0.2 : 0,
    shadowRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    elevation: scale.value > 1 ? 8 : 0,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[styles.cell, styles.cellOccupied, animatedStyle]}
        onLayout={(e) => {
          cellLayouts.current[index] = e.nativeEvent.layout;
        }}
      >
        <ThemedText style={styles.cellEmoji}>{seedling.emoji}</ThemedText>
        <ThemedText style={styles.cellName} numberOfLines={1}>
          {seedling.name}
        </ThemedText>
        <View style={styles.cellStageBadge}>
          <ThemedText style={styles.cellStageBadgeText}>
            {seedling.stage.split(' ')[0]}
          </ThemedText>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function GridBuilderScreen() {
  const router = useRouter();
  const { mutate: createGrid, isPending } = useCreateGrid();

  // Grid dimensions
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [rows, setRows] = useState(DEFAULT_ROWS);

  // Garden form
  const [gridName, setGridName]               = useState('');
  const [gridDescription, setGridDescription] = useState('');
  const [gridEmoji, setGridEmoji]             = useState('🌱');
  const [submitted, setSubmitted]             = useState(false);

  // Seedling draft
  const [draft, setDraft] = useState<SeedlingDraft>(EMPTY_SEEDLING);

  // Flat grid cells: index = row * cols + col
  const [cells, setCells] = useState<(SeedlingDraft | null)[]>(
    () => Array(DEFAULT_ROWS * DEFAULT_COLS).fill(null)
  );

  // Layout refs for drag-and-drop hit detection
  const cellLayouts  = useRef<(CellLayout | null)[]>([]);
  const scrollOffsetY = useRef(0);

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalCells    = rows * cols;
  const seedlingCount = cells.filter(Boolean).length;
  const gridFull      = seedlingCount === totalCells;

  const errors = {
    gridName:        !gridName.trim()        ? 'Garden name is required.'  : undefined,
    gridDescription: !gridDescription.trim() ? 'Description is required.'  : undefined,
    seedlings:       seedlingCount === 0     ? 'Add at least one seedling.' : undefined,
  };
  const canCreate = !errors.gridName && !errors.gridDescription && !errors.seedlings;

  // ── Grid resize ────────────────────────────────────────────────────────────

  const canDecrementCols = cols > 1 && seedlingCount < rows * (cols - 1);
  const canDecrementRows = rows > 1 && seedlingCount < (rows - 1) * cols;

  const resizeCells = (newRows: number, newCols: number, currentCells: (SeedlingDraft | null)[]) => {
    const result: (SeedlingDraft | null)[] = Array(newRows * newCols).fill(null);
    for (let r = 0; r < Math.min(rows, newRows); r++) {
      for (let c = 0; c < Math.min(cols, newCols); c++) {
        result[r * newCols + c] = currentCells[r * cols + c] ?? null;
      }
    }
    return result;
  };

  const handleIncrementCols = () => {
    const newCols = cols + 1;
    setCols(newCols);
    setCells((prev) => resizeCells(rows, newCols, prev));
  };

  const handleDecrementCols = () => {
    if (!canDecrementCols) return;
    const newCols = cols - 1;
    setCols(newCols);
    setCells((prev) => resizeCells(rows, newCols, prev));
  };

  const handleIncrementRows = () => {
    const newRows = rows + 1;
    setRows(newRows);
    setCells((prev) => resizeCells(newRows, cols, prev));
  };

  const handleDecrementRows = () => {
    if (!canDecrementRows) return;
    const newRows = rows - 1;
    setRows(newRows);
    setCells((prev) => resizeCells(newRows, cols, prev));
  };

  // ── Add seedling ───────────────────────────────────────────────────────────

  const updateDraft = (fields: Partial<SeedlingDraft>) =>
    setDraft((prev) => ({ ...prev, ...fields }));

  const handleAddSeedling = () => {
    if (!draft.name.trim()) {
      Alert.alert('Missing name', 'Please enter a name for the seedling.');
      return;
    }
    if (gridFull) return;
    const firstEmpty = cells.findIndex((c) => c === null);
    if (firstEmpty === -1) return;
    setCells((prev) => {
      const next = [...prev];
      next[firstEmpty] = draft;
      return next;
    });
    setDraft(EMPTY_SEEDLING);
  };

  // ── Drag-and-drop ──────────────────────────────────────────────────────────

  const handleDragEnd = (fromIndex: number, absoluteX: number, absoluteY: number) => {
    // Find which cell the finger landed on by checking layouts
    let toIndex: number | null = null;
    for (let i = 0; i < cellLayouts.current.length; i++) {
      const layout = cellLayouts.current[i];
      if (!layout) continue;
      if (
        absoluteX >= layout.x &&
        absoluteX <= layout.x + layout.width &&
        absoluteY >= layout.y &&
        absoluteY <= layout.y + layout.height
      ) {
        toIndex = i;
        break;
      }
    }

    if (toIndex === null || toIndex === fromIndex) return;

    setCells((prev) => {
      const next = [...prev];
      // Swap (works for both occupied→occupied and occupied→empty)
      const temp     = next[fromIndex];
      next[fromIndex] = next[toIndex!];
      next[toIndex!]  = temp;
      return next;
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleCreate = () => {
    setSubmitted(true);
    if (!canCreate) return;

    const filledSeedlings = cells
      .filter((c): c is SeedlingDraft => c !== null)
      .map((s) => ({
        name:    s.name.trim(),
        stage:   s.stage,
        daysOld: parseInt(s.daysOld, 10) || 0,
        emoji:   s.emoji,
      }));

    const newGrid: Omit<SeedlingGrid, 'id'> = {
      name:        gridName.trim(),
      emoji:       gridEmoji,
      description: gridDescription.trim(),
      header: {
        greeting:        'Good morning,',
        title:           `${gridEmoji} ${gridName.trim()}`,
        subtitle:        `Your ${gridName.trim()} is growing beautifully!`,
        decorativeIcons: ['🌿', '🌱', '🌿', '🍃', '🌱', '🌿'],
      },
      stats: [
        { emoji: '🌱', label: 'Seedlings', value: String(filledSeedlings.length), color: GARDEN_GREEN },
        { emoji: '💧', label: 'Need Water', value: '0',                           color: WATER_BLUE   },
        { emoji: '☀️', label: 'Days Active', value: '0',                          color: PETAL_YELLOW },
      ],
      seedlings: filledSeedlings,
      tip: {
        title: '🌸 Garden Tip of the Day',
        text:  'Water your seedlings in the early morning to reduce evaporation and prevent fungal growth.',
      },
      footerIcons: ['🪨', '🌱', '🪱', '🌱', '🪨'],
    };

    createGrid(newGrid, {
      onSuccess: (created) => {
        setGridName('');
        setGridDescription('');
        setGridEmoji('🌱');
        setSubmitted(false);
        setDraft(EMPTY_SEEDLING);
        setCols(DEFAULT_COLS);
        setRows(DEFAULT_ROWS);
        setCells(Array(DEFAULT_ROWS * DEFAULT_COLS).fill(null));
        router.push({ pathname: '/(tabs)/grid/[id]', params: { id: created.id } });
      },
      onError: (err) => {
        Alert.alert('Error', `Could not create garden: ${err.message}`);
      },
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScroll={(e) => {
          scrollOffsetY.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.headerBanner}>
          <ThemedText style={styles.headerLabel}>New Garden</ThemedText>
          <ThemedText style={styles.headerTitle}>🪴 Build Your Grid</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Set your grid size, add seedlings, and drag them into position.
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

        {/* Grid Size */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📐 Grid Size</ThemedText>
          <GridSizeControl
            label="Columns"
            value={cols}
            onIncrement={handleIncrementCols}
            onDecrement={handleDecrementCols}
            decrementDisabled={!canDecrementCols}
          />
          <GridSizeControl
            label="Rows"
            value={rows}
            onIncrement={handleIncrementRows}
            onDecrement={handleDecrementRows}
            decrementDisabled={!canDecrementRows}
          />
          <ThemedText style={styles.cellCountHint}>
            {totalCells} cells · {seedlingCount} filled · {totalCells - seedlingCount} empty
          </ThemedText>
        </ThemedView>

        {/* Grid Preview */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🗺 Grid Preview</ThemedText>
          <ThemedText style={[styles.cellCountHint, { marginBottom: 8 }]}>
            Drag seedlings to rearrange
          </ThemedText>
          <ScrollView
            horizontal
            contentContainerStyle={[
              styles.gridScrollContent,
              { width: cols * (CELL_SIZE + CELL_GAP) + CELL_GAP },
            ]}
            showsHorizontalScrollIndicator={false}
          >
            <View>
              {Array.from({ length: rows }).map((_, r) => (
                <View key={r} style={styles.gridRow}>
                  {Array.from({ length: cols }).map((_, c) => {
                    const idx      = r * cols + c;
                    const seedling = cells[idx];
                    return seedling ? (
                      <DraggableCell
                        key={`${idx}-${seedling.name}`}
                        index={idx}
                        seedling={seedling}
                        cellLayouts={cellLayouts}
                        scrollOffsetY={scrollOffsetY}
                        onDragEnd={handleDragEnd}
                      />
                    ) : (
                      <EmptyCell
                        key={idx}
                        index={idx}
                        cellLayouts={cellLayouts}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
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
          <TouchableOpacity
            style={[styles.addButton, gridFull && styles.addButtonDisabled]}
            onPress={handleAddSeedling}
            disabled={gridFull}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.addButtonText}>
              {gridFull ? '⛔ Grid Full — Increase Size to Add More' : '+ Add Seedling'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Validation Checklist */}
        <ThemedView style={styles.checklistCard}>
          <ThemedText style={styles.checklistTitle}>Requirements</ThemedText>
          <ValidationRow met={!errors.gridName}        submitted={submitted} label="Garden name filled in" />
          <ValidationRow met={!errors.gridDescription} submitted={submitted} label="Description filled in" />
          <ValidationRow met={!errors.seedlings}       submitted={submitted} label="At least one seedling placed" />
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
          {['🪨', '🌱', '🪱', '🌱', '🪨'].map((icon, i) => (
            <ThemedText key={i} style={styles.soilEmoji}>{icon}</ThemedText>
          ))}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
