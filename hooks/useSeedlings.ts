import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Seedling } from '@/types/home';
import { getSeedlings, addSeedling } from '@/services/seedlingApi';

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const seedlingKeys = {
  all: ['seedlings'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetches all seedlings from the catalog. */
export function useSeedlings() {
  return useQuery({
    queryKey: seedlingKeys.all,
    queryFn: getSeedlings,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Adds a new seedling to the catalog and invalidates the list cache. */
export function useAddSeedling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (seedling: Seedling) => addSeedling(seedling),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seedlingKeys.all });
    },
  });
}
