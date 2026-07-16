import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/config/app.config';
import { tokens } from '@/design-system/tokens';
import {
  PageContainer,
  PageHeader,
  SectionTitle,
  MetricCard,
  StatCard,
  EmptyState,
  LoadingState,
  StatusBadge,
  SearchBar,
  FilterPanel,
  MetricGrid,
  FormSection,
  FormGroup,
  FormActions,
} from '@/design-system/patterns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Progress } from '@/shared/components/ui/progress';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import {
  DollarSign,
  Users,
  Inbox,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="h-16" style={{ background: `hsl(var(${cssVar}))` }} />
      <div className="p-2 bg-card">
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{cssVar}</p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <PageContainer size="xl">
        <div className="mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link to={ROUTES.app.dashboard}>
              <ArrowLeft className="w-4 h-4" />
              Voltar ao app
            </Link>
          </Button>
        </div>

        <PageHeader
          title="Design System"
          description="Storybook simplificado do CalculaFreela — tokens, primitivos e patterns."
        />

        <Tabs defaultValue="tokens" className="space-y-8">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-card/50 p-1">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="buttons">Botões</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="data">Dados</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="space-y-10">
            <section>
              <SectionTitle title="Cores semânticas" description="Nunca hardcode — use tokens." />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  ['background', '--background'],
                  ['foreground', '--foreground'],
                  ['primary', '--primary'],
                  ['secondary', '--secondary'],
                  ['muted', '--muted'],
                  ['accent', '--accent'],
                  ['destructive', '--destructive'],
                  ['card', '--card'],
                  ['border', '--border'],
                  ['success', '--success'],
                  ['warning', '--warning'],
                  ['info', '--info'],
                ].map(([name, v]) => (
                  <ColorSwatch key={name} name={name} cssVar={v} />
                ))}
              </div>
            </section>

            <section>
              <SectionTitle title="Tipografia" />
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <p className="text-4xl font-black tracking-tight">Display / 4xl Black</p>
                <p className="text-2xl font-bold">Heading / 2xl Bold</p>
                <p className="text-lg font-semibold">Title / lg Semibold</p>
                <p className="text-base">Body / base Regular — {tokens.typography.fontFamily.sans}</p>
                <p className="text-sm text-muted-foreground">Muted / sm — texto secundário</p>
                <p className="text-xs font-mono text-muted-foreground">Mono / xs — 0123456789</p>
              </div>
            </section>

            <section>
              <SectionTitle title="Espaçamento & Radius" />
              <div className="flex flex-wrap gap-3 items-end">
                {[2, 3, 4, 6, 8, 12].map((n) => (
                  <div key={n} className="text-center">
                    <div
                      className="bg-primary/40 rounded-sm mx-auto"
                      style={{ width: n * 4, height: n * 4 }}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">{n * 4}px</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                {['sm', 'md', 'lg', 'xl', '2xl', 'full'].map((r) => (
                  <div
                    key={r}
                    className="w-16 h-16 border border-primary/40 bg-primary/10 flex items-center justify-center text-xs"
                    style={{ borderRadius: r === 'full' ? 9999 : undefined }}
                    data-radius={r}
                  >
                    <span className={r === 'sm' ? 'rounded-sm' : r === 'md' ? 'rounded-md' : r === 'lg' ? 'rounded-lg' : r === 'xl' ? 'rounded-xl' : r === '2xl' ? 'rounded-2xl' : 'rounded-full'}>
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle title="Elevação / Shadows" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['sm', 'md', 'lg', 'glow'].map((e) => (
                  <div
                    key={e}
                    className="h-24 rounded-2xl bg-card border border-border flex items-center justify-center text-sm"
                    style={{ boxShadow: `var(--elevation-${e})` }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle title="Grid & Container" />
              <div className="grid grid-cols-12 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-md bg-primary/15 border border-primary/20 flex items-center justify-center text-[10px] text-muted-foreground"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-6">
            <div className="glass-card rounded-2xl p-6 flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <button className="btn-primary text-white px-4 py-2 text-sm">Brand Primary</button>
              <button className="btn-ghost px-4 py-2 text-sm">Brand Ghost</button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Zap className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="inputs" className="space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-4 max-w-xl">
              <Input placeholder="Input padrão" className="bg-black/20 border-white/10" />
              <Textarea placeholder="Textarea" className="bg-black/20 border-white/10" />
              <SearchBar value={search} onChange={setSearch} />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox /> Checkbox
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch /> Switch
                </label>
              </div>
              <Progress value={66} />
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <MetricGrid columns={3}>
              <MetricCard label="Receita" value="R$ 24.000" icon={DollarSign} trend={{ value: 12 }} />
              <MetricCard label="Clientes" value="18" icon={Users} hint="ativos" />
              <StatCard label="Taxa de conversão" value="42%" icon={Zap} />
            </MetricGrid>
            <div className="glass-card glass-card-hover rounded-2xl p-6">
              <h3 className="font-bold mb-2">Glass Card</h3>
              <p className="text-sm text-muted-foreground">
                Superfície premium com blur e borda sutil.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <FilterPanel>
              <SearchBar value={search} onChange={setSearch} className="flex-1" />
              <Badge variant="outline">Filtro ativo</Badge>
            </FilterPanel>
            <div className="glass-card rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Landing SaaS</TableCell>
                    <TableCell>
                      <StatusBadge kind="proposal" status="sent" />
                    </TableCell>
                    <TableCell>R$ 12.400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>App Mobile</TableCell>
                    <TableCell>
                      <StatusBadge kind="proposal" status="accepted" />
                    </TableCell>
                    <TableCell>R$ 45.200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge kind="client" status="active" />
              <StatusBadge kind="client" status="lead" />
              <StatusBadge kind="contract" status="pending_signature" />
              <Badge className="badge-pill border-0">Badge pill</Badge>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Alert>
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>Alert padrão do design system.</AlertDescription>
            </Alert>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>TE</AvatarFallback>
              </Avatar>
              <Skeleton className="h-10 w-48" />
            </div>
            <EmptyState
              icon={Inbox}
              title="Empty state"
              description="Use em listas sem resultados."
              action={<Button size="sm">Ação</Button>}
            />
            <LoadingState label="Loading state" />
            <Accordion type="single" collapsible className="glass-card rounded-2xl px-4">
              <AccordionItem value="1">
                <AccordionTrigger>Accordion item</AccordionTrigger>
                <AccordionContent>Conteúdo expansível do design system.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <FormSection title="FormSection" description="Agrupa campos de formulário.">
                <FormGroup columns={2}>
                  <Input placeholder="Campo A" className="bg-black/20 border-white/10" />
                  <Input placeholder="Campo B" className="bg-black/20 border-white/10" />
                </FormGroup>
                <FormActions>
                  <Button variant="outline">Cancelar</Button>
                  <Button className="btn-primary text-white">Salvar</Button>
                </FormActions>
              </FormSection>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs text-muted-foreground">
              <div className="p-4 rounded-xl border border-border">PageHeader</div>
              <div className="p-4 rounded-xl border border-border">PageContainer</div>
              <div className="p-4 rounded-xl border border-border">DashboardLayout</div>
              <div className="p-4 rounded-xl border border-border">LandingLayout</div>
              <div className="p-4 rounded-xl border border-border">CrudTable patterns</div>
              <div className="p-4 rounded-xl border border-border">MetricGrid</div>
              <div className="p-4 rounded-xl border border-border">SearchBar</div>
              <div className="p-4 rounded-xl border border-border">FilterPanel</div>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}
