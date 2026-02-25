import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import SeedlingGridOverview from '@/components/SeedlingGridOverview';
import { GARDEN_GREEN } from '@/data/home';
import { useGrid } from '@/hooks/useGrids';
import { styles } from '@/styles/grid-detail';

export default function GridDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: grid, isLoading, isError, error } = useGrid(id ?? '');

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={GARDEN_GREEN} />
        <ThemedText style={styles.statusText}>Loading garden...</ThemedText>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.errorText}>Could not load garden.</ThemedText>
        <ThemedText style={styles.errorDetail}>{error?.message}</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (!grid) {
    return (
      <View style={styles.center}>
        <ThemedText style={styles.statusText}>Garden not found.</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return <SeedlingGridOverview {...grid} />;
}

