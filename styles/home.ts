import { StyleSheet } from 'react-native';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN, SOIL_BROWN,
} from '@/data/home';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Branding header
  headerBanner: {
    backgroundColor: GARDEN_GREEN,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
  },
  brandingLabel: {
    fontSize: 14,
    color: LIGHT_GREEN,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6,
    textAlign: 'center',
  },
  brandingSubtitle: {
    fontSize: 14,
    color: LIGHT_GREEN,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  decorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  decorIcon: {
    fontSize: 24,
  },

  // Summary bar
  summaryBar: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: GARDEN_GREEN,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E0EDE4',
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
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: LEAF_GREEN,
  },
  importButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#EAF4FB',
    borderWidth: 1,
    borderColor: '#5BA4CF',
  },
  importButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2980B9',
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 14,
  },

  // Grid card
  gridCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F2',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#D6EAD9',
  },
  gridCardLeft: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  gridCardEmoji: {
    fontSize: 28,
  },
  gridCardBody: {
    flex: 1,
  },
  gridCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: LEAF_GREEN,
  },
  gridCardDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  gridCardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  gridCardMetaText: {
    fontSize: 11,
    color: GARDEN_GREEN,
    fontWeight: '500',
  },
  gridCardChevron: {
    fontSize: 26,
    color: GARDEN_GREEN,
    fontWeight: '300',
    marginLeft: 8,
  },

  // Loading / error states
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C0392B',
  },
  errorDetail: {
    fontSize: 12,
    color: '#888',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
