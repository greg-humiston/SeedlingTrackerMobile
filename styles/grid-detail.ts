import { StyleSheet } from 'react-native';
import { GARDEN_GREEN } from '@/data/home';

export const styles = StyleSheet.create({
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
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 12,
    marginTop: 4,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
