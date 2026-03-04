import { StyleSheet } from 'react-native';
import { GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN, WATER_BLUE } from '@/data/home';

export const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerEmoji: {
    fontSize: 44,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  stageBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: LIGHT_GREEN,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stageBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: LEAF_GREEN,
  },
  closeX: {
    fontSize: 18,
    color: '#999',
    paddingLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EFE9',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  editableSection: {
    paddingVertical: 7,
  },
  dateEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  adjustBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: LEAF_GREEN,
    lineHeight: 24,
  },
  dateEditorValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    minWidth: 110,
    textAlign: 'center',
  },
  todayButton: {
    marginTop: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BDD7FF',
  },
  todayButtonText: {
    color: WATER_BLUE,
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
