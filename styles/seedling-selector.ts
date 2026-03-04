import { StyleSheet } from 'react-native';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN,
} from '@/data/home';

const ERROR_RED    = '#C0392B';
const ERROR_BG     = '#FDF0EF';
const ERROR_BORDER = '#E8A09A';

export const selectorStyles = StyleSheet.create({
  // ── Add Custom button ────────────────────────────────────────────────────────
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: GARDEN_GREEN,
    borderStyle: 'dashed',
  },
  addCustomBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: GARDEN_GREEN,
  },

  // ── Modal overlay ────────────────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: CREAM,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '95%',
    paddingBottom: 0,
  },
  cardHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D0D0',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EFE8',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: LEAF_GREEN,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },

  // ── Form sections ────────────────────────────────────────────────────────────
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
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

  // ── Option chips ─────────────────────────────────────────────────────────────
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

  // ── Emoji chips ──────────────────────────────────────────────────────────────
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiChip: {
    width: 44,
    height: 44,
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
    fontSize: 22,
  },

  // ── Footer buttons ───────────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8EFE8',
    backgroundColor: CREAM,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C8D8CC',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: GARDEN_GREEN,
    alignItems: 'center',
    shadowColor: GARDEN_GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  saveBtnDisabled: {
    backgroundColor: '#B0C4B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveBtnTextDisabled: {
    color: '#E8F0E9',
  },

  // ── Frost tolerance (boolean chips) ──────────────────────────────────────────
  boolChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F7F2',
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
  },
  boolChipSelectedYes: {
    backgroundColor: GARDEN_GREEN,
    borderColor: GARDEN_GREEN,
  },
  boolChipSelectedNo: {
    backgroundColor: '#C0392B',
    borderColor: '#C0392B',
  },
  boolChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  boolChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
