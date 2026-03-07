import { StyleSheet } from 'react-native';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN, SOIL_BROWN,
} from '@/data/home';

const ERROR_RED    = '#C0392B';
const ERROR_BG     = '#FDF0EF';
const ERROR_BORDER = '#E8A09A';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
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

  // ── Section ─────────────────────────────────────────────────────────────────
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

  // ── Grid size controls ───────────────────────────────────────────────────────
  sizeControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    width: 72,
  },
  sizeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: GARDEN_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeButtonDisabled: {
    backgroundColor: '#C8D8CC',
  },
  sizeButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  sizeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: LEAF_GREEN,
    minWidth: 28,
    textAlign: 'center',
  },
  cellCountHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },

  // ── Grid preview ─────────────────────────────────────────────────────────────
  gridContainer: {
    gap: 8,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Base cell (shared) — flex: 1 + aspectRatio: 1 fills parent width per column
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Occupied cell
  cellOccupied: {
    backgroundColor: '#F0F7F2',
    borderWidth: 2,
    borderColor: '#D6EAD9',
  },
  // Selected cell (tap-to-select edit mode)
  cellSelected: {
    borderColor: GARDEN_GREEN,
    backgroundColor: '#DFF0E4',
    borderWidth: 2.5,
  },
  // Empty cell
  cellEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#C8D8CC',
    borderStyle: 'dashed',
  },
  cellEmoji: {
    fontSize: 38,
  },
  cellName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  cellStageBadge: {
    marginTop: 3,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cellStageBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: LEAF_GREEN,
  },

  // ── Inputs ───────────────────────────────────────────────────────────────────
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
  inputError: {
    borderColor: ERROR_BORDER,
    backgroundColor: ERROR_BG,
  },
  errorText: {
    fontSize: 12,
    color: ERROR_RED,
    marginTop: 2,
  },

  // ── Option chips (stage + emoji) ─────────────────────────────────────────────
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

  // ── Seedling dropdown ─────────────────────────────────────────────────────────
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
  },
  dropdownTriggerText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#aaa',
  },
  dropdownSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
  },
  dropdownClearBtn: {
    paddingHorizontal: 6,
  },
  dropdownClearBtnText: {
    fontSize: 14,
    color: '#999',
  },
  dropdownChevron: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F7F2',
  },
  dropdownItemSelected: {
    backgroundColor: '#EAF5EC',
  },
  dropdownItemEmoji: {
    fontSize: 22,
  },
  dropdownItemText: {
    flex: 1,
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dropdownItemStage: {
    fontSize: 11,
    color: GARDEN_GREEN,
    marginTop: 1,
  },
  dropdownItemCheck: {
    fontSize: 14,
    fontWeight: '700',
    color: GARDEN_GREEN,
  },
  plantingReadyItem: {
    backgroundColor: '#EAF7EC',
    borderBottomColor: '#C8E6C9',
  },
  plantingBadgeReady: {
    backgroundColor: '#C8E6C9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GARDEN_GREEN,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  plantingBadgeWait: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  plantingBadgeNoZone: {
    backgroundColor: '#F3F0FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9E86FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  plantingBadgeLocation: {
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#90A8E8',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  plantingBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#555',
  },

  // ── Add seedling button ───────────────────────────────────────────────────────
  addButton: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonDisabled: {
    opacity: 0.45,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: LEAF_GREEN,
  },

  // ── Validation checklist ──────────────────────────────────────────────────────
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

  // ── Create button ─────────────────────────────────────────────────────────────
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

  // ── Footer ────────────────────────────────────────────────────────────────────
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
