import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Users, ArrowUpRight, Building2, Mail } from 'lucide-react';
import { PageContainer, PageHeader, SearchBar, EmptyState, LoadingState, StatusBadge } from '@/design-system/patterns';
import { useClients, useDeleteClient } from '@/hooks/use-clients';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shared/components/ui/alert-dialog';
import { ROUTES } from '@/core/config/app.config';
import { formatDate } from '@/shared/utils/utils';
import { toast } from '@/shared/components/ui/use-toast';
import type { ClientStatus } from '@/types/domain';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClientStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const filters = useMemo(() => ({ search, status, sortBy: 'updatedAt' as const, sortDir: 'desc' as const, page, pageSize: 12 }), [search, status, page]);
  const { data, isLoading } = useClients(filters);
  const remove = useDeleteClient();

  const handleDelete = async () => {
    if (!deleteId) return;
    await remove.mutateAsync(deleteId);
    toast({ title: 'Cliente removido' });
    setDeleteId(null);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Relacionamentos, não cadastros."
        description="Clientes e leads com contexto suficiente para você saber quem é, o que está sendo negociado e quando agir."
        actions={
          <Button asChild className="rounded-full bg-[#171614] px-4 text-xs font-semibold text-white shadow-none hover:bg-[#f26522]">
            <Link to={ROUTES.app.clientsNew}><Plus className="mr-1.5 size-3.5" />Novo cliente</Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 rounded-[22px] border border-black/[0.06] bg-white/60 p-3 sm:flex-row sm:items-center">
        <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Buscar nome, e-mail ou empresa" className="flex-1" />
        <Select value={status} onValueChange={(value) => { setStatus(value as ClientStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-full rounded-full bg-white/70 sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem><SelectItem value="active">Ativos</SelectItem><SelectItem value="lead">Leads</SelectItem><SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingState /> : !data || data.data.length === 0 ? (
        <EmptyState icon={Users} title="Sua base começa aqui" description="Cadastre o primeiro contato para ligar cliente, precificação, proposta e contrato no mesmo histórico." action={<Button asChild className="rounded-full bg-[#171614] text-white hover:bg-[#f26522]"><Link to={ROUTES.app.clientsNew}>Cadastrar cliente</Link></Button>} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.data.map((client) => (
              <article key={client.id} className="group rounded-[24px] border border-black/[0.06] bg-white/68 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_55px_rgba(35,29,22,.07)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">Atualizado {formatDate(client.updatedAt)}</p>
                    <Link to={ROUTES.app.clientDetail(client.id)} className="mt-2 block truncate text-xl font-semibold tracking-[-0.035em] text-[#171614] transition group-hover:text-[#f26522]">{client.name}</Link>
                  </div>
                  <StatusBadge kind="client" status={client.status} />
                </div>

                <div className="mt-6 space-y-2 text-xs text-black/45">
                  <p className="flex items-center gap-2"><Building2 className="size-3.5 text-black/25" />{client.company || 'Sem empresa informada'}</p>
                  <p className="flex items-center gap-2 truncate"><Mail className="size-3.5 text-black/25" />{client.email || 'Sem e-mail informado'}</p>
                </div>

                <div className="mt-7 flex items-center justify-between">
                  <Link to={ROUTES.app.clientDetail(client.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/60 transition hover:text-black">Abrir cliente <ArrowUpRight className="size-3.5" /></Link>
                  <button type="button" onClick={() => setDeleteId(client.id)} className="flex size-8 items-center justify-center rounded-full text-black/25 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Excluir ${client.name}`}><Trash2 className="size-3.5" /></button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 text-xs text-black/38 sm:flex-row sm:items-center sm:justify-between">
            <span>{data.total} cliente{data.total !== 1 ? 's' : ''} · página {data.page} de {data.totalPages}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-full bg-white/55" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Anterior</Button>
              <Button variant="ghost" size="sm" className="rounded-full bg-white/55" disabled={page >= data.totalPages} onClick={() => setPage((current) => current + 1)}>Próxima</Button>
            </div>
          </div>
        </>
      )}

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir cliente?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. O cliente será removido da sua base.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
