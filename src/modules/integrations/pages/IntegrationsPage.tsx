import { useMemo, useState } from 'react';
import {
  PageContainer,
  PageHeader,
  SectionTitle,
  EmptyState,
} from '@/design-system/patterns';
import { pluginsService } from '@/services/plugins.service';
import { activitiesService } from '@/services/activities.service';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
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
  type LucideIcon,
} from 'lucide-react';
import type { PluginCategory, PluginRuntime } from '@/types/plugins';
import { formatRelativeDate } from '@/shared/utils/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Calendar,
  CreditCard,
  Notebook,
  MessageSquare,
  Github,
  Phone,
  Building2,
  HardDrive,
};

const categoryLabel: Record<PluginCategory, string> = {
  communication: 'Comunicação',
  payments: 'Pagamentos',
  productivity: 'Produtividade',
  calendar: 'Agenda',
  storage: 'Armazenamento',
  crm: 'CRM',
};

export default function IntegrationsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PluginCategory | 'all'>('all');

  const { data: plugins = [] } = useQuery({
    queryKey: ['plugins'],
    queryFn: () => pluginsService.listRuntimeAsync(),
  });

  const filtered = useMemo(() => {
    return plugins.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'all' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [plugins, search, category]);

  const connected = plugins.filter((p) => p.connection?.status === 'connected');

  const refresh = () => qc.invalidateQueries({ queryKey: ['plugins'] });

  const handleConnect = async (plugin: PluginRuntime) => {
    try {
      await pluginsService.connectLive(plugin.id);
      await activitiesService.addAsync({
        type: 'system',
        title: 'Plugin conectado',
        description: plugin.name,
        entityId: plugin.id,
      });
      toast({
        title: `${plugin.name} conectado`,
        description: 'OAuth autorizado. Tokens salvos na sua conta.',
      });
      refresh();
    } catch (e) {
      toast({
        title: 'Não foi possível conectar',
        description: e instanceof Error ? e.message : 'Erro',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = (plugin: PluginRuntime) => {
    pluginsService.disconnect(plugin.id);
    activitiesService.add({
      type: 'system',
      title: 'Plugin desconectado',
      description: plugin.name,
      entityId: plugin.id,
    });
    toast({ title: `${plugin.name} desconectado` });
    refresh();
  };

  const handleSync = async (plugin: PluginRuntime) => {
    try {
      const detail = await pluginsService.testConnection(plugin.id);
      toast({ title: 'Conector OK', description: `${plugin.name}: ${detail}` });
      refresh();
    } catch (e) {
      toast({
        title: 'Falha no conector',
        description: e instanceof Error ? e.message : 'Erro',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Integrações & plugins"
        description="Conecte ferramentas externas à sua conta. Cada usuário gerencia os próprios plugins."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="app-panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Catálogo</p>
          <p className="text-2xl font-semibold tabular-nums mt-1">{plugins.length}</p>
        </div>
        <div className="app-panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Conectados</p>
          <p className="text-2xl font-semibold tabular-nums mt-1 text-emerald-700">
            {connected.length}
          </p>
        </div>
        <div className="app-panel p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Em breve</p>
          <p className="text-2xl font-semibold tabular-nums mt-1">
            {plugins.filter((p) => p.comingSoon).length}
          </p>
        </div>
      </div>

      {connected.length > 0 && (
        <div className="mb-8">
          <SectionTitle title="Conectados nesta conta" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {connected.map((plugin) => {
              const Icon = iconMap[plugin.icon] ?? Plug;
              return (
                <div key={plugin.id} className="app-panel p-4 flex items-start gap-3">
                  <div className="feature-icon !w-9 !h-9">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{plugin.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {plugin.connection?.accountLabel}
                    </p>
                    {plugin.connection?.lastSyncAt && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Sync {formatRelativeDate(plugin.connection.lastSyncAt)}
                      </p>
                    )}
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Ativo
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Buscar integração…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as PluginCategory | 'all')}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {(Object.keys(categoryLabel) as PluginCategory[]).map((c) => (
              <SelectItem key={c} value={c}>
                {categoryLabel[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Plug}
          title="Nenhuma integração encontrada"
          description="Ajuste a busca ou categoria."
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((plugin) => {
            const Icon = iconMap[plugin.icon] ?? Plug;
            const status = plugin.connection?.status ?? 'available';
            const isConnected = status === 'connected';

            return (
              <article key={plugin.id} className="app-panel p-5 flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="feature-icon !w-10 !h-10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">{plugin.name}</h3>
                      <Badge variant="outline" className="text-[10px]">
                        {categoryLabel[plugin.category]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {plugin.description}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                  {plugin.comingSoon || status === 'coming_soon' ? (
                    <Badge className="bg-slate-100 text-slate-600">Em breve</Badge>
                  ) : isConnected ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(plugin)}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Testar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-600"
                        onClick={() => handleDisconnect(plugin)}
                      >
                        <Unplug className="w-3.5 h-3.5" />
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="brand" onClick={() => handleConnect(plugin)}>
                      <Plug className="w-3.5 h-3.5" />
                      Conectar
                    </Button>
                  )}
                  {plugin.website && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={plugin.website} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Site
                      </a>
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-10 app-panel p-5 text-sm text-muted-foreground space-y-2">
        <p className="font-medium text-foreground">Conectores em produção</p>
        <p>
          Com Firebase configurado, Google Workspace e GitHub usam OAuth real (popup +
          scopes). Tokens ficam em Firestore sob a sua conta. Stripe gera Payment Links
          com a chave conectada. Veja <code className="text-xs">DEPLOY.md</code>.
        </p>
      </div>
    </PageContainer>
  );
}
