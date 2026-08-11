import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageContainer, LoadingState, StatusBadge } from '@/design-system/patterns';
import { useProposal, useDeleteProposal, useDuplicateProposal, useUpdateProposal } from '@/hooks/use-proposals';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/core/config/app.config';
import { formatCurrency, formatDate, downloadTextFile } from '@/shared/utils/utils';
import { toast } from '@/shared/components/ui/use-toast';
import { ArrowLeft, ArrowUpRight, Copy, Download, FileSignature, Send, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
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

  if (isLoading) return <PageContainer><LoadingState fullPage /></PageContainer>;
  if (!proposal) return <PageContainer><Button asChild variant="ghost" className="rounded-full"><Link to={ROUTES.app.proposals}><ArrowLeft className="mr-2 size-4" />Voltar para propostas</Link></Button></PageContainer>;

  const hasSnapshot = Boolean(proposal.projectSnapshot && proposal.resultSnapshot);

  const exportProposal = () => {
    if (!hasSnapshot) return;
    const text = gerarCartaProposta(proposal.projectSnapshot as DadosProjeto, proposal.resultSnapshot as ResultadoOrcamento);
    downloadTextFile(text, `proposta-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.txt`);
    toast({ title: 'Proposta exportada' });
  };

  const exportContract = () => {
    if (!hasSnapshot) return;
    const text = gerarContrato(proposal.projectSnapshot as DadosProjeto, proposal.resultSnapshot as ResultadoOrcamento);
    downloadTextFile(text, `contrato-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.txt`);
    toast({ title: 'Contrato exportado' });
  };

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to={ROUTES.app.proposals} className="inline-flex items-center gap-2 text-xs font-semibold text-black/45 transition hover:text-black"><ArrowLeft className="size-3.5" />Propostas</Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="rounded-full bg-white/55 text-xs" onClick={async () => { const copy = await duplicate.mutateAsync(proposal.id); if (copy) { toast({ title: 'Nova versão criada' }); navigate(ROUTES.app.proposalDetail(copy.id)); } }}><Copy className="mr-1.5 size-3.5" />Nova versão</Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-full text-black/28 hover:bg-rose-50 hover:text-rose-600" onClick={async () => { await remove.mutateAsync(proposal.id); toast({ title: 'Proposta excluída' }); navigate(ROUTES.app.proposals); }}><Trash2 className="size-3.5" /></Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
        <section className="overflow-hidden rounded-[30px] border border-black/[0.06] bg-[#fbfaf7] shadow-[0_28px_80px_rgba(38,31,24,.07)]">
          <div className="bg-[#171614] px-6 py-7 text-white sm:px-8 sm:py-9 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2"><StatusBadge kind="proposal" status={proposal.status} /><span className="text-[10px] uppercase tracking-[0.14em] text-white/28">Modelo {proposal.model}</span></div>
              <p className="text-[10px] uppercase tracking-[0.13em] text-white/28">Atualizada {formatDate(proposal.updatedAt)}</p>
            </div>

            <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">Proposta comercial</p>
            <h1 className="mt-3 max-w-[13ch] text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">{proposal.title}</h1>
            <p className="mt-4 text-sm text-white/48">Preparada para {proposal.clientName || 'cliente não vinculado'}</p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] bg-[#ece7df] p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/30">Investimento</p><p className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#171614]">{formatCurrency(proposal.totalValue, proposal.currency)}</p></div>
              <div className="rounded-[20px] bg-[#ece7df] p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/30">Prazo</p><p className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#171614]">{proposal.totalDays} dias</p></div>
              <div className="rounded-[20px] bg-[#ece7df] p-4"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/30">Esforço</p><p className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#171614]">{proposal.totalHours}h</p></div>
            </div>

            <div className="mt-9 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">Stack prevista</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {proposal.technologies.length ? proposal.technologies.map((technology) => <span key={technology} className="rounded-full bg-[#ece7df] px-3 py-1.5 text-[11px] font-medium text-black/58">{technology}</span>) : <span className="text-sm text-black/35">Nenhuma tecnologia registrada</span>}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">Leitura comercial</p>
                <p className="mt-3 text-lg leading-8 tracking-[-0.025em] text-black/66">Esta proposta reúne investimento, prazo e escopo técnico em uma única decisão. O próximo passo é validar condições e transformar o aceite em contrato.</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[26px] bg-[#171614] p-5 text-white sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">Etapa da negociação</p>
            <Select value={proposal.status} onValueChange={async (value) => { await update.mutateAsync({ id: proposal.id, patch: { status: value as ProposalStatus, sentAt: value === 'sent' ? new Date().toISOString() : proposal.sentAt } }); toast({ title: 'Status atualizado' }); }}>
              <SelectTrigger className="mt-4 h-11 rounded-full border-white/10 bg-white/[0.07] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="draft">Rascunho</SelectItem><SelectItem value="sent">Enviada</SelectItem><SelectItem value="viewed">Visualizada</SelectItem><SelectItem value="accepted">Aceita</SelectItem><SelectItem value="rejected">Recusada</SelectItem><SelectItem value="expired">Expirada</SelectItem></SelectContent>
            </Select>
            <p className="mt-4 text-xs leading-6 text-white/38">Mantenha o status alinhado ao que aconteceu com o cliente para o pipeline continuar útil.</p>
          </section>

          <section className="rounded-[26px] border border-black/[0.06] bg-white/68 p-5 sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">Materiais</p>
            <div className="mt-4 space-y-2">
              <Button onClick={exportProposal} disabled={!hasSnapshot} className="h-11 w-full justify-between rounded-full bg-[#f26522] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#df5b1d]"><span className="flex items-center"><Send className="mr-2 size-3.5" />Exportar proposta</span><ArrowUpRight className="size-3.5" /></Button>
              <Button onClick={exportContract} disabled={!hasSnapshot} variant="ghost" className="h-11 w-full justify-between rounded-full bg-[#ece7df] px-4 text-xs font-semibold text-black/60 hover:bg-[#e5ded4]"><span className="flex items-center"><FileSignature className="mr-2 size-3.5" />Gerar contrato</span><Download className="size-3.5" /></Button>
            </div>
            {!hasSnapshot && <p className="mt-4 text-[11px] leading-5 text-black/35">A exportação completa fica disponível para propostas geradas pela precificação.</p>}
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}
