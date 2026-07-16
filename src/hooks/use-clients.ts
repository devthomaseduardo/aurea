import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService, type ClientFilters } from '@/services/clients.service';
import type { Client } from '@/types/domain';
import { activitiesService } from '@/services/activities.service';

export const clientKeys = {
  all: ['clients'] as const,
  list: (filters: ClientFilters) => ['clients', 'list', filters] as const,
  detail: (id: string) => ['clients', 'detail', id] as const,
};

export function useClients(filters: ClientFilters = {}) {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => clientsService.listAsync(filters),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsService.getByIdAsync(id),
    enabled: Boolean(id),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) =>
      clientsService.createAsync(input),
    onSuccess: async (client) => {
      await activitiesService.addAsync({
        type: 'client',
        title: 'Cliente criado',
        description: client.name,
        entityId: client.id,
      });
      qc.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Client> }) =>
      clientsService.updateAsync(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientKeys.all }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientsService.removeAsync(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: clientKeys.all }),
  });
}
