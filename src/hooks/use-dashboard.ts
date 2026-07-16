import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { activitiesService } from '@/services/activities.service';
import { proposalsService } from '@/services/proposals.service';
import { contractsService } from '@/services/contracts.service';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => dashboardService.getMetricsAsync(),
  });
}

export function useRevenueSeries() {
  return useQuery({
    queryKey: ['dashboard', 'revenue-series'],
    queryFn: () => dashboardService.getRevenueSeries(),
  });
}

export function useRecentActivities(limit = 8) {
  return useQuery({
    queryKey: ['activities', limit],
    queryFn: () => activitiesService.listAsync(limit),
  });
}

export function useRecentProposals(limit = 5) {
  return useQuery({
    queryKey: ['proposals', 'recent', limit],
    queryFn: async () => {
      const page = await proposalsService.listAsync({
        page: 1,
        pageSize: limit,
        sortBy: 'updatedAt',
        sortDir: 'desc',
      });
      return page.data;
    },
  });
}

export function useContractStatuses() {
  return useQuery({
    queryKey: ['contracts', 'status-summary'],
    queryFn: async () => {
      const all = await contractsService.getAllAsync();
      const groups = ['draft', 'pending_signature', 'active', 'completed', 'cancelled'] as const;
      return groups.map((status) => ({
        status,
        count: all.filter((c) => c.status === status).length,
      }));
    },
  });
}
