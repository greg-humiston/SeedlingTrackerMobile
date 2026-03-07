import { GARDEN_GREEN, WATER_BLUE } from '@/data/home';
import type { SeedlingGrid } from '@/types/home';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from './themed-text';

// ─── Types ────────────────────────────────────────────────────────────────────

type WateringAlert = {
  gridId: string;
  gridName: string;
  cellIndex: number;
  seedlingName: string;
  seedlingEmoji: string;
  daysOverdue: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDaysFromFrequency(freq: string): number {
  const s = freq.toLowerCase();
  if (s.includes('daily') || s.includes('every day')) return 1;
  if (s.includes('twice a week')) return 3;
  if (s.includes('weekly') || s.includes('once a week')) return 7;

  // "every X-Y days" → use the upper bound (lenient)
  const rangeEvery = s.match(/every\s+(\d+)\s*[-–]\s*(\d+)\s*day/);
  if (rangeEvery) return parseInt(rangeEvery[2], 10);

  // "every X days"
  const singleEvery = s.match(/every\s+(\d+)\s*day/);
  if (singleEvery) return parseInt(singleEvery[1], 10);

  // "X-Y days"
  const plainRange = s.match(/(\d+)\s*[-–]\s*(\d+)\s*day/);
  if (plainRange) return parseInt(plainRange[2], 10);

  // any lone number followed by "day"
  const plain = s.match(/(\d+)\s*day/);
  if (plain) return parseInt(plain[1], 10);

  return 3; // sensible default for unstructured instructions
}

function computeAlerts(grids: SeedlingGrid[] | undefined): WateringAlert[] {
  if (!grids) return [];
  const now = Date.now();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const alerts: WateringAlert[] = [];

  for (const grid of grids) {
    for (let i = 0; i < grid.gridCells.length; i++) {
      const cell = grid.gridCells[i];
      if (!cell) continue;

      const freqDays = parseDaysFromFrequency(cell.wateringFrequency);
      const thresholdMs = freqDays * MS_PER_DAY;

      const lastMs = cell.lastWateredAt
        ? new Date(cell.lastWateredAt).getTime()
        : cell.plantedAt
          ? new Date(cell.plantedAt).getTime()
          : now - thresholdMs - 1; // no data → treat as overdue

      const overdueMs = now - lastMs - thresholdMs;
      if (overdueMs > 0) {
        alerts.push({
          gridId: grid.id,
          gridName: grid.name,
          cellIndex: i,
          seedlingName: cell.variety,
          seedlingEmoji: cell.emoji,
          daysOverdue: Math.max(1, Math.floor(overdueMs / MS_PER_DAY)),
        });
      }
    }
  }

  return alerts.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = { grids: SeedlingGrid[] | undefined };

export function WateringNotificationBar({ grids }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const alerts = useMemo(() => computeAlerts(grids), [grids]);
  const hasAlerts = alerts.length > 0;

  const handleAlertPress = (alert: WateringAlert) => {
    setOpen(false);
    router.push({
      pathname: '/(tabs)/grid/[id]',
      params: { id: alert.gridId, highlight: String(alert.cellIndex) },
    });
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Bell button */}
      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.75}
      >
        <ThemedText style={styles.bellIcon}>{hasAlerts ? '🔔' : '🔕'}</ThemedText>
        {hasAlerts && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>
              {alerts.length > 9 ? '9+' : alerts.length}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>

      {/* Dropdown popup */}
      {open && (
        <View style={styles.dropdown}>
          {!hasAlerts ? (
            <ThemedText style={styles.emptyText}>No notifications right now 🌿</ThemedText>
          ) : (
            <ScrollView style={styles.alertList} showsVerticalScrollIndicator={false}>
              {alerts.map((alert, idx) => (
                <TouchableOpacity
                  key={`${alert.gridId}-${alert.cellIndex}-${idx}`}
                  style={[styles.alertItem, idx < alerts.length - 1 && styles.alertItemBorder]}
                  onPress={() => handleAlertPress(alert)}
                  activeOpacity={0.75}
                >
                  <ThemedText style={styles.alertEmoji}>{alert.seedlingEmoji}</ThemedText>
                  <View style={styles.alertBody}>
                    <ThemedText style={styles.alertName}>{alert.seedlingName}</ThemedText>
                    <ThemedText style={styles.alertMeta}>
                      {alert.gridName} · {alert.daysOverdue}d overdue
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.alertChevron}>›</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 100,
    alignItems: 'flex-end',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  dropdown: {
    marginTop: 6,
    width: 280,
    maxHeight: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    overflow: 'hidden',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    padding: 16,
    textAlign: 'center',
  },
  alertList: {
    maxHeight: 320,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  alertItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  alertEmoji: {
    fontSize: 26,
    width: 32,
    textAlign: 'center',
  },
  alertBody: {
    flex: 1,
  },
  alertName: {
    fontSize: 14,
    fontWeight: '600',
    color: GARDEN_GREEN,
  },
  alertMeta: {
    fontSize: 11,
    color: WATER_BLUE,
    marginTop: 2,
  },
  alertChevron: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 4,
  },
});

export default WateringNotificationBar;
