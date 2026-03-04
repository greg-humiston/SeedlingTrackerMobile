import { StyleSheet } from 'react-native';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN,
  PETAL_YELLOW, SOIL_BROWN,
} from '@/data/home';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header
  headerBanner: {
    backgroundColor: GARDEN_GREEN,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 16,
    color: LIGHT_GREEN,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: LIGHT_GREEN,
    marginTop: 4,
    marginBottom: 16,
  },
  plantRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  plantIcon: {
    fontSize: 22,
  },

  // Stats
  statsContainer: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F9F6',
    borderRadius: 16,
    paddingVertical: 14,
    borderTopWidth: 4,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: LEAF_GREEN,
    marginBottom: 2,
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },

  // Seedling Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '30%',
    backgroundColor: '#F0F7F2',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gridItemSelected: {
    borderColor: GARDEN_GREEN,
    backgroundColor: '#E2F0E8',
  },
  gridEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  gridName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  gridStage: {
    fontSize: 10,
    color: GARDEN_GREEN,
    textAlign: 'center',
    marginTop: 2,
  },
  gridDaysBadge: {
    marginTop: 6,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gridDaysText: {
    fontSize: 10,
    fontWeight: '700',
    color: LEAF_GREEN,
  },

  // Seedling Summary
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: GARDEN_GREEN,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryEmoji: {
    fontSize: 40,
  },
  summaryHeaderText: {
    flex: 1,
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: LEAF_GREEN,
  },
  summaryStage: {
    fontSize: 13,
    color: GARDEN_GREEN,
    marginTop: 2,
  },
  summaryDaysBadge: {
    alignItems: 'center',
    backgroundColor: '#EAF4EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryDaysValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GARDEN_GREEN,
  },
  summaryDaysLabel: {
    fontSize: 10,
    color: '#888',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0EDE4',
    marginVertical: 12,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryDetailItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryDetailLabel: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Tip card
  tipCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: PETAL_YELLOW,
    borderRadius: 16,
    padding: 16,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: SOIL_BROWN,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6B5E4E',
    lineHeight: 22,
  },

  // Soil footer
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
