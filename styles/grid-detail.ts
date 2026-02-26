import { StyleSheet } from 'react-native';
import {
  CREAM, GARDEN_GREEN, LEAF_GREEN, LIGHT_GREEN,
  PETAL_YELLOW, SOIL_BROWN,
} from '@/data/home';

export const styles = StyleSheet.create({
  // ── Loading / error states ───────────────────────────────────────────────────
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  statusText: {
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C0392B',
  },
  errorDetail: {
    fontSize: 12,
    color: '#888',
  },
  errorBackButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 12,
    marginTop: 4,
  },
  errorBackButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  // ── Main scroll ──────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // ── Header ───────────────────────────────────────────────────────────────────
  headerBanner: {
    backgroundColor: GARDEN_GREEN,
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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

  // ── Stats ────────────────────────────────────────────────────────────────────
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

  // ── Section ──────────────────────────────────────────────────────────────────
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

  // ── Tip card ─────────────────────────────────────────────────────────────────
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

  // ── Soil footer ──────────────────────────────────────────────────────────────
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
