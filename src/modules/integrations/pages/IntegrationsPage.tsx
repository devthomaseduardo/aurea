import { useMemo, useState } from 'react';
import { PageContainer, PageHeader, EmptyState } from '@/design-system/patterns';
import { pluginsService } from '@/services/plugins.service';
import { activitiesService } from '@/services/activities.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { toast } from '@/shared/components/ui/use-toast';
import {
  Mail,
  Calendar,
  CreditCard,
  Notebook,
  MessageSquare,
  Github,
  Phone,
  Building2,
  HardDrive,
  Plug,
  RefreshCw,
  Unplug,
  ExternalLink,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { PluginCategory, PluginRuntime } from '@/types/plugins';
import { formatRelativeDate } from '@/shared/utils/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const iconMap: Record<string, LucideIcon> = { Mail, Calendar, CreditCard, Notebook, MessageSquare, Github, Phone, Building2, HardDrive };

const categoryLabel: Record<PluginCategory, string> = {
  communication: 'Comunicação', payments: 'Pagamentos', productivity: 'Produtividade', calendar: 'Agenda', storage: 'Armazenamento', crm: 'CRM',
};

export default function IntegrationsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PluginCategory | 'all'>('all');
  const { data: plugins = [] } = useQuery({ queryKey: ['plugins'], queryFn: () => pluginsService.listRuntimeAsync() });

  const filtered = useMemo(() => plugins.filter((plugin) => {
    const matchesSearch = !search || plugin.name.toLowerCase().includes(search.toLowerCase()) || plugin.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (category === 'all' || plugin.category === category);
  }), [plugins, search, category]);

  const connected = plugins.filter((plugin) => plugin.connection?.status === 'connected');
  const refresh = () => qc.invalidateQueries({ queryKey: ['plugins'] });

  const handleConnect = async (plugin: PluginRuntime) => {
    try {
      await pluginsService.connectLive(plugin.id);
      await activitiesService.addAsync({ type: 'system', title: 'Plugin conectado', description: plugin.name, entityId: plugin.id });
      toast({ title: `${plugin.name} conectado`, description: 'A autorização foi salva na sua conta.' });
      refresh();
    } catch (error) {
      toast({ title: 'Não foi possível conectar', description: error instanceof Error ? error.message : 'Erro', variant: 'destructive' });
    }
  };

  const handleDisconnect = (plugin: PluginRuntime) => {
    pluginsService.disconnect(plugin.id);
    activitiesService.add({ type: 'system', title: 'Plugin desconectado', description: plugin.name, entityId: plugin.id });
    toast({ title: `${plugin.name} desconectado` });
    refresh();
  };

  const handleSync = async (plugin: PluginRuntime) => {
    try {
      const detail = await pluginsService.testConnection(plugin.id);
      toast({ title: 'Conector funcionando', description: `${plugin.name}: ${detail}` });
      refresh();
    } catch (error) {
      toast({ title: 'Falha no conector', description: error instanceof Error ? error.message : 'Erro', variant: 'destructive' });
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Conecte só o que melhora o fluxo." description="Integrações entram para reduzir trabalho repetitivo, não para transformar o Áurea em uma central de aplicativos." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Catálogo', plugins.length],
          ['Conectados', connected.length],
          ['Em breve', plugins.filter((plugin) => plugin.comingSoon).length],
        ].map(([label, value], index) => (
          <div key={String(label)} className={index === 1 ? 'rounded-[22px] bg-[#171614] p-5 text-white' : 'rounded-[22px] border border-black/[0.06] bg-white/62 p-5'}>
            <p className={index === 1 ? 'text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30' : 'text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30'}>{label}</p>
            <p className={index === 1 ? 'mt-3 text-3xl font-semibold tracking-[-0.045em] text-white' : 'mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#171614]'}>{value}</p>
          </div>
        ))}
      </div>

      {connected.length > 0 && (
        <section className="mb-8 rounded-[28px] bg-[#171614] p-5 text-white sm:p-6">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">Ativos nesta conta</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {connected.map((plugin) => {
              const Icon = iconMap[plugin.icon] ?? Plug;
              return (
                <div key={plugin.id} className="rounded-[20px] bg-white/[0.06] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-white/[0.08]"><Icon className="size-4 text-[#f6a576]" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{plugin.name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-white/35">{plugin.connection?.accountLabel}</p>
                      {plugin.connection?.lastSyncAt && <p className="mt-2 text-[10px] text-white/28">Sincronizado {formatRelativeDate(plugin.connection.lastSyncAt)}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="mb-5 flex flex-col gap-3 rounded-[22px] border border-black/[0.06] bg-white/58 p-3 sm:flex-row">
        <Input placeholder="Buscar integração" value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 rounded-full bg-white/70 sm:max-w-xs" />
        <Select value={category} onValueChange={(value) => setCategory(value as PluginCategory | 'all')}>
          <SelectTrigger className="h-10 rounded-full bg-white/70 sm:w-48"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Todas categorias</SelectItem>{(Object.keys(categoryLabel) as PluginCategory[]).map((item) => <SelectItem key={item} value={item}>{categoryLabel[item]}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? <EmptyState icon={Plug} title="Nenhuma integração encontrada" description="Ajuste a busca ou a categoria." /> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plugin) => {
            const Icon = iconMap[plugin.icon] ?? Plug;
            const status = plugin.connection?.status ?? 'available';
            const isConnected = status === 'connected';

            return (
              <article key={plugin.id} className="group flex min-h-[235px] flex-col rounded-[24px] border border-black/[0.06] bg-white/66 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_55px_rgba(35,29,22,.07)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#ece7df] text-[#f26522]"><Icon className="size-4" /></span>
                  <span className="rounded-full bg-[#ece7df] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-black/40">{categoryLabel[plugin.category]}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.035em] text-[#171614]">{plugin.name}</h3>
                <p className="mt-2 text-xs leading-6 text-black/42">{plugin.description}</p>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  {plugin.comingSoon || status === 'coming_soon' ? (
                    <span className="rounded-full bg-[#ece7df] px-3 py-1.5 text-[10px] font-semibold text-black/45">Em breve</span>
                  ) : isConnected ? (
                    <>
                      <Button size="sm" variant="ghost" className="rounded-full bg-[#ece7df] text-xs" onClick={() => handleSync(plugin)}><RefreshCw className="mr-1.5 size-3.5" />Testar</Button>
                      <Button size="sm" variant="ghost" className="rounded-full text-xs text-rose-600 hover:bg-rose-50" onClick={() => handleDisconnect(plugin)}><Unplug className="mr-1.5 size-3.5" />Desconectar</Button>
                    </>
                  ) : (
                    <Button size="sm" className="rounded-full bg-[#171614] px-4 text-xs text-white shadow-none hover:bg-[#f26522]" onClick={() => handleConnect(plugin)}><Plug className="mr-1.5 size-3.5" />Conectar</Button>
                  )}
                  {plugin.website && <Button size="icon" variant="ghost" asChild className="ml-auto size-9 rounded-full"><a href={plugin.website} target="_blank" rel="noreferrer"><ExternalLink className="size-3.5" /></a></Button>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-[22px] bg-[#ece7df] p-5 text-xs leading-6 text-black/45">
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-[#f26522]" />
        <p>Conectores com OAuth ou chaves externas continuam usando a configuração existente. O redesign altera a experiência, não a regra de autenticação ou persistência.</p>
      </div>
    </PageContainer>
  );
}
