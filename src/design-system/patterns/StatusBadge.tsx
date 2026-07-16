import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/utils';
import type {
  ClientStatus,
  ContractStatus,
  ProposalStatus,
} from '@/types/domain';

const proposalMap: Record<ProposalStatus, { label: string; className: string }> = {
  draft: {
    label: 'Rascunho',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  sent: {
    label: 'Enviada',
    className: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  viewed: {
    label: 'Visualizada',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  accepted: {
    label: 'Aceita',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Recusada',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  expired: {
    label: 'Expirada',
    className: 'bg-slate-50 text-slate-500 border-slate-200',
  },
};

const clientMap: Record<ClientStatus, { label: string; className: string }> = {
  active: {
    label: 'Ativo',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-slate-50 text-slate-500 border-slate-200',
  },
  lead: {
    label: 'Lead',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
};

const contractMap: Record<ContractStatus, { label: string; className: string }> = {
  draft: {
    label: 'Rascunho',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  pending_signature: {
    label: 'Aguardando assinatura',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  active: {
    label: 'Ativo',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  completed: {
    label: 'Concluído',
    className: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
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
