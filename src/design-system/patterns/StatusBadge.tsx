import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/utils';
import type {
  ClientStatus,
  ContractStatus,
  ProposalStatus,
} from '@/types/domain';

const proposalMap: Record<ProposalStatus, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'bg-white/5 text-white/60 border-white/10' },
  sent: { label: 'Enviada', className: 'bg-sky-400/10 text-sky-400 border-sky-400/20' },
  viewed: { label: 'Visualizada', className: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  accepted: { label: 'Aceita', className: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  rejected: { label: 'Recusada', className: 'bg-rose-400/10 text-rose-400 border-rose-400/20' },
  expired: { label: 'Expirada', className: 'bg-white/5 text-white/40 border-white/10' },
};

const clientMap: Record<ClientStatus, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  inactive: { label: 'Inativo', className: 'bg-white/5 text-white/40 border-white/10' },
  lead: { label: 'Lead', className: 'bg-violet-400/10 text-violet-400 border-violet-400/20' },
};

const contractMap: Record<ContractStatus, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'bg-white/5 text-white/60 border-white/10' },
  pending_signature: {
    label: 'Aguardando assinatura',
    className: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  },
  active: { label: 'Ativo', className: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  completed: { label: 'Concluído', className: 'bg-sky-400/10 text-sky-400 border-sky-400/20' },
  cancelled: { label: 'Cancelado', className: 'bg-rose-400/10 text-rose-400 border-rose-400/20' },
};

type StatusBadgeProps =
  | { kind: 'proposal'; status: ProposalStatus; className?: string }
  | { kind: 'client'; status: ClientStatus; className?: string }
  | { kind: 'contract'; status: ContractStatus; className?: string };

export function StatusBadge(props: StatusBadgeProps) {
  const map =
    props.kind === 'proposal'
      ? proposalMap[props.status]
      : props.kind === 'client'
        ? clientMap[props.status]
        : contractMap[props.status];

  return (
    <Badge
      variant="outline"
      className={cn('font-medium capitalize', map.className, props.className)}
    >
      {map.label}
    </Badge>
  );
}
