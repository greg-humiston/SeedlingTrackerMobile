import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SeedlingGridOverview from '@/components/SeedlingGridOverview';
import { GARDEN_GREEN, SEEDLING_GRIDS } from '@/data/home';

export default function GridDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const grid = SEEDLING_GRIDS.find((g) => g.id === id);

  if (!grid) {
    return (
      <View style={styles.notFound}>
        <ThemedText style={styles.notFoundText}>Garden not found.</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return <SeedlingGridOverview {...grid} />;
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: '#888',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: GARDEN_GREEN,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
