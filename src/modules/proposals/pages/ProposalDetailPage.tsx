import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  PageContainer,
  PageHeader,
  LoadingState,
  StatusBadge,
  MetricCard,
  MetricGrid,
} from '@/design-system/patterns';
import {
  useProposal,
  useDeleteProposal,
  useDuplicateProposal,
  useUpdateProposal,
} from '@/hooks/use-proposals';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/core/config/app.config';
import { formatCurrency, formatDate, downloadTextFile } from '@/shared/utils/utils';
import { toast } from '@/shared/components/ui/use-toast';
import { Copy, Trash2, Send, Clock, Code2 } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { ProposalStatus } from '@/types/domain';
import { gerarCartaProposta } from '@/modules/proposals/components/CartaProposta';
import type { DadosProjeto, ResultadoOrcamento } from '@/modules/calculator/domain/calculadora';
import { gerarContrato } from '@/modules/calculator/domain/calculadora';

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: proposal, isLoading } = useProposal(id!);
  const remove = useDeleteProposal();
  const duplicate = useDuplicateProposal();
  const update = useUpdateProposal();

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState fullPage />
      </PageContainer>
    );
  }

  if (!proposal) {
    return (
      <PageContainer>
        <PageHeader title="Proposta não encontrada" />
        <Button asChild variant="outline">
          <Link to={ROUTES.app.proposals}>Voltar</Link>
        </Button>
      </PageContainer>
    );
  }

  const hasSnapshot =
    proposal.projectSnapshot && proposal.resultSnapshot;

  return (
    <PageContainer>
      <PageHeader
        title={proposal.title}
        description={`${proposal.clientName} · atualizada em ${formatDate(proposal.updatedAt)}`}
        breadcrumbs={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={ROUTES.app.proposals}>Propostas</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detalhe</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Select
              value={proposal.status}
              onValueChange={async (v) => {
                await update.mutateAsync({
                  id: proposal.id,
                  patch: {
                    status: v as ProposalStatus,
                    sentAt:
                      v === 'sent'
                        ? new Date().toISOString()
                        : proposal.sentAt,
                  },
                });
                toast({ title: 'Status atualizado' });
              }}
            >
              <SelectTrigger className="w-40 bg-black/20 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
                <SelectItem value="viewed">Visualizada</SelectItem>
                <SelectItem value="accepted">Aceita</SelectItem>
                <SelectItem value="rejected">Recusada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={async () => {
                const copy = await duplicate.mutateAsync(proposal.id);
                if (copy) {
                  toast({ title: 'Duplicada' });
                  navigate(ROUTES.app.proposalDetail(copy.id));
                }
              }}
            >
              <Copy className="w-4 h-4" />
              Duplicar
            </Button>
            <Button
              variant="outline"
              className="text-rose-400"
              onClick={async () => {
                await remove.mutateAsync(proposal.id);
                toast({ title: 'Excluída' });
                navigate(ROUTES.app.proposals);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <StatusBadge kind="proposal" status={proposal.status} />
        <Badge variant="outline" className="capitalize">
          Modelo {proposal.model}
        </Badge>
      </div>

      <MetricGrid columns={4} className="mb-8">
        <MetricCard
          label="Valor total"
          value={formatCurrency(proposal.totalValue, proposal.currency)}
        />
        <MetricCard label="Horas" value={`${proposal.totalHours}h`} icon={Clock} />
        <MetricCard label="Prazo" value={`${proposal.totalDays} dias`} />
        <MetricCard
          label="Tecnologias"
          value={String(proposal.technologies.length)}
          icon={Code2}
        />
      </MetricGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Tecnologias
          </h3>
          <div className="flex flex-wrap gap-2">
            {proposal.technologies.length === 0 && (
              <span className="text-sm text-muted-foreground">Nenhuma registrada</span>
            )}
            {proposal.technologies.map((t) => (
              <Badge key={t} variant="secondary" className="bg-primary/10 text-violet-300">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Exportar
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={!hasSnapshot}
              onClick={() => {
                if (!hasSnapshot) return;
                const text = gerarCartaProposta(
                  proposal.projectSnapshot as DadosProjeto,
                  proposal.resultSnapshot as ResultadoOrcamento
                );
                downloadTextFile(
                  text,
                  `proposta-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.txt`
                );
                toast({ title: 'Carta proposta baixada' });
              }}
            >
              <Send className="w-4 h-4" />
              Carta proposta
            </Button>
            <Button
              variant="outline"
              disabled={!hasSnapshot}
              onClick={() => {
                if (!hasSnapshot) return;
                const text = gerarContrato(
                  proposal.projectSnapshot as DadosProjeto,
                  proposal.resultSnapshot as ResultadoOrcamento
                );
                downloadTextFile(
                  text,
                  `contrato-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.txt`
                );
                toast({ title: 'Contrato baixado' });
              }}
            >
              Contrato (.txt)
            </Button>
          </div>
          {!hasSnapshot && (
            <p className="text-xs text-muted-foreground mt-3">
              Exportação completa disponível para propostas geradas pela calculadora.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
