import { StyleSheet } from 'react-native';
import { GARDEN_GREEN } from '@/data/home';

export const editFormStyles = StyleSheet.create({
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#F0F7F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
    marginBottom: 8,
  },
  emojiRow: {
    marginBottom: 4,
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
    marginRight: 8,
  },
  emojiChipSelected: {
    borderColor: GARDEN_GREEN,
    backgroundColor: '#E2F0E8',
  },
  emojiChipText: {
    fontSize: 20,
  },
});
