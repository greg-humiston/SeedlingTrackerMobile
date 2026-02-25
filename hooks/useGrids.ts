import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SeedlingGrid } from '@/types/home';
import {
  getGridsByUser,
  getGridById,
  createGrid,
  updateGrid,
  deleteGrid,
  MOCK_USER_ID,
} from '@/services/mockApi';

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const gridKeys = {
  all: ['grids'] as const,
  detail: (id: string) => ['grids', id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetches all seedling grids for the current mock user. */
export function useGrids() {
  return useQuery({
    queryKey: gridKeys.all,
    queryFn: () => getGridsByUser(MOCK_USER_ID),
  });
}

/** Fetches a single seedling grid by id. */
export function useGrid(id: string) {
  return useQuery({
    queryKey: gridKeys.detail(id),
    queryFn: () => getGridById(MOCK_USER_ID, id),
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Creates a new seedling grid and invalidates the list cache. */
export function useCreateGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grid: Omit<SeedlingGrid, 'id'>) =>
      createGrid(MOCK_USER_ID, grid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gridKeys.all });
    },
  });
}

/** Updates an existing grid and invalidates both the list and detail caches. */
export function useUpdateGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      gridId,
      updates,
    }: {
      gridId: string;
      updates: Partial<Omit<SeedlingGrid, 'id'>>;
    }) => updateGrid(MOCK_USER_ID, gridId, updates),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: gridKeys.all });
      queryClient.invalidateQueries({ queryKey: gridKeys.detail(variables.gridId) });
    },
  });
}

/** Deletes a grid, invalidates the list, and removes the detail cache entry. */
export function useDeleteGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gridId: string) => deleteGrid(MOCK_USER_ID, gridId),
    onSuccess: (_data, gridId) => {
      queryClient.invalidateQueries({ queryKey: gridKeys.all });
      queryClient.removeQueries({ queryKey: gridKeys.detail(gridId) });
    },
  });
}
