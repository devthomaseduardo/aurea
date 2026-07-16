import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  proposalsService,
  type ProposalFilters,
} from '@/services/proposals.service';
import type { Proposal } from '@/types/domain';
import type { DadosProjeto, ResultadoOrcamento } from '@/modules/calculator/domain/calculadora';
import { activitiesService } from '@/services/activities.service';

export const proposalKeys = {
  all: ['proposals'] as const,
  list: (filters: ProposalFilters) => ['proposals', 'list', filters] as const,
  detail: (id: string) => ['proposals', 'detail', id] as const,
};

export function useProposals(filters: ProposalFilters = {}) {
  return useQuery({
    queryKey: proposalKeys.list(filters),
    queryFn: () => proposalsService.listAsync(filters),
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: () => proposalsService.getByIdAsync(id),
    enabled: Boolean(id),
  });
}

export function useCreateProposalFromCalculation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      projeto,
      resultado,
      extras,
    }: {
      projeto: DadosProjeto;
      resultado: ResultadoOrcamento;
      extras?: Partial<Pick<Proposal, 'clientId' | 'status' | 'notes'>>;
    }) => proposalsService.createFromCalculationAsync(projeto, resultado, extras),
    onSuccess: async (proposal) => {
      await activitiesService.addAsync({
        type: 'proposal',
        title: 'Proposta criada',
        description: `${proposal.title} — ${proposal.clientName}`,
        entityId: proposal.id,
      });
      qc.invalidateQueries({ queryKey: proposalKeys.all });
    },
  });
}

export function useUpdateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Proposal> }) =>
      proposalsService.updateAsync(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: proposalKeys.all }),
  });
}

export function useDuplicateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => proposalsService.duplicateAsync(id),
    onSuccess: async (proposal) => {
      if (proposal) {
        await activitiesService.addAsync({
          type: 'proposal',
          title: 'Proposta duplicada',
          description: proposal.title,
          entityId: proposal.id,
        });
      }
      qc.invalidateQueries({ queryKey: proposalKeys.all });
    },
  });
}

export function useDeleteProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => proposalsService.removeAsync(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: proposalKeys.all }),
  });
}
