import { Link } from 'react-router-dom';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import {
  FileText,
  Calculator,
  BarChart3,
  ArrowRight,
  LayoutDashboard,
  Users,
  FileSignature,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ClipboardList,
  Scale,
  Workflow,
  BadgeCheck,
  Lock,
  Layers,
} from 'lucide-react';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const trustItems = [
  'Processo padronizado',
  'Documentação comercial',
  'Governança de status',
  'Exportação auditável',
];

const capabilities = [
  {
    icon: Calculator,
    title: 'Precificação estruturada',
    description:
      'Modele escopo, stack, impostos e margem com validação por etapa e modelos comerciais.',
  },
  {
    icon: FileText,
    title: 'Gestão de propostas',
    description:
      'Pipeline com status, valores, tecnologias e ações de duplicar, exportar e arquivar.',
  },
  {
    icon: Users,
    title: 'Base de clientes',
    description:
      'Cadastro corporativo com busca, filtros, ordenação e paginação para operação diária.',
  },
  {
    icon: FileSignature,
    title: 'Contratos e entregas',
    description:
      'Vincule contratos a propostas, acompanhe assinatura e prazos de entrega.',
  },
  {
    icon: LayoutDashboard,
    title: 'Painel executivo',
    description:
      'Receita, horas, lucro e atividades recentes em visão consolidada para decisão.',
  },
  {
    icon: BarChart3,
    title: 'Analytics comercial',
    description:
      'Distribuição de status e séries de performance para acompanhamento contínuo.',
  },
];

const process = [
  {
    step: '01',
    title: 'Qualificar e modelar',
    body: 'Capture requisitos, complexidade e parâmetros fiscais com validação de formulário.',
  },
  {
    step: '02',
    title: 'Precificar e documentar',
    body: 'Gere breakdown, cronograma de pagamentos e modelos Básico, Padrão ou Premium.',
  },
  {
    step: '03',
    title: 'Operar e acompanhar',
    body: 'Mova propostas no pipeline, exporte contratos e monitore indicadores.',
  },
];

const governance = [
  {
    icon: ShieldCheck,
    title: 'Controle de status',
    text: 'Estados padronizados para propostas e contratos, sem ambiguidade operacional.',
  },
  {
    icon: Lock,
    title: 'Dados no edge',
    text: 'Persistência local com prefixo versionado, pronta para evolução API/SSO.',
  },
  {
    icon: Scale,
    title: 'Transparência de custos',
    text: 'Horas, buffer, impostos e serviços expostos no detalhamento da proposta.',
  },
  {
    icon: ClipboardList,
    title: 'Rastreabilidade',
    text: 'Histórico de atividades e snapshots de cálculo associados a cada proposta.',
  },
];

export default function Landing() {
  return (
    <LandingLayout>
      <Hero />

      {/* Trust strip */}
      <section className="border-b border-border bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Construído para operação comercial séria
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-sm text-slate-600">
                <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Platform */}
      <section id="plataforma" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                Plataforma
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4 text-balance">
                Do orçamento ao contrato, com disciplina de software corporativo
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                A {APP_CONFIG.name} substitui planilhas e documentos soltos por um fluxo
                único: precificação validada, propostas versionáveis e visão executiva do
                pipeline.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Wizard multi-etapa com regras de negócio e Zod',
                  'Módulos independentes para clientes, propostas e contratos',
                  'Exportação de documentos comerciais e snapshots de cálculo',
                  'Arquitetura preparada para escala e integração backend',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={ROUTES.app.dashboard}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Abrir console operacional
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg bg-white">
                <img
                  src={APP_CONFIG.brand.hero}
                  alt="Visão da plataforma Aurea"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Módulos', value: '8+' },
                  { label: 'Status de proposta', value: '6' },
                  { label: 'Modelos', value: '3' },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center"
                  >
                    <p className="text-lg font-semibold text-slate-900 tabular-nums">{kpi.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / capabilities */}
      <section id="solucoes" className="bg-slate-50 border-y border-border py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">
              Soluções
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
              Capacidades da suíte comercial
            </h2>
            <p className="text-slate-600">
              Módulos integrados para cobrir o ciclo completo, da estimativa à governança
              do contrato.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                  <item.icon className="w-4.5 h-4.5 text-primary w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="processo" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">
                Processo
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
                Metodologia em três estágios
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Workflow className="w-4 h-4 text-primary" />
              Alinhado a operação comercial B2B
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden">
            {process.map((item, i) => (
              <div
                key={item.step}
                className={`bg-white p-7 md:p-8 ${i > 0 ? 'border-t md:border-t-0 md:border-l border-slate-200' : ''}`}
              >
                <p className="text-xs font-semibold tracking-[0.16em] text-primary mb-4">
                  ESTÁGIO {item.step}
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section id="seguranca" className="bg-slate-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300 mb-3">
                Governança
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-balance">
                Controles que transmitem confiança ao cliente final
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8 max-w-lg">
                Propostas e contratos com trilha clara de status, breakdowns legíveis e
                documentação exportável no padrão que empresas esperam de um fornecedor
                profissional.
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Building2 className="w-4 h-4 text-indigo-300" />
                Ideal para freelancers senior, studios e consultores
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {governance.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <item.icon className="w-5 h-5 text-indigo-300 mb-3" />
                  <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="resultados" className="bg-white py-20 md:py-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-3">
              Resultados
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
              Indicadores de operação
            </h2>
            <p className="text-slate-600">
              O dashboard consolida o que importa para a saúde do negócio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Receita acompanhada', value: 'Pipeline + aceitas' },
              { label: 'Propostas', value: 'Status ponta a ponta' },
              { label: 'Clientes', value: 'CRM operacional' },
              { label: 'Contratos', value: 'Ciclo de assinatura' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
              >
                <p className="text-sm font-semibold text-slate-900 mb-1">{item.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <Layers className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Console unificado
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Navegação por áreas de negócio, métricas executivas e atalhos para
                  criação de propostas com experiência de software corporativo, sem
                  complexidade desnecessária.
                </p>
                <Link to={ROUTES.app.dashboard} className="btn-primary self-start h-10 px-5 text-sm">
                  Entrar no console
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-200 bg-white">
                <img
                  src={APP_CONFIG.brand.product}
                  alt="Console Aurea"
                  className="w-full h-full object-cover min-h-[240px] max-h-[320px]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-5 md:px-6 text-center">
          <img
            src={APP_CONFIG.brand.logo}
            alt="Aurea"
            className="w-12 h-12 rounded-lg mx-auto mb-6 ring-1 ring-border object-cover shadow-sm"
          />
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3 text-balance">
            Eleve o padrão comercial do seu negócio
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Adote um processo único de precificação e propostas, com a clareza que
            clientes corporativos esperam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.app.dashboard} className="btn-primary h-11 px-6 text-sm">
              Iniciar agora
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={ROUTES.app.calculator}
              className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
            >
              Abrir calculadora
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
