import { Link } from 'react-router-dom';
import { ArrowUpRight, Calculator, FileText, Users, FileSignature } from 'lucide-react';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import Hero from '@/shared/components/Hero';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const productFlow = [
  { n: '01', icon: Users, title: 'Cliente', desc: 'Contexto comercial reunido antes de falar de preço.' },
  { n: '02', icon: Calculator, title: 'Precificação', desc: 'Escopo, esforço, custo e margem transformados em decisão.' },
  { n: '03', icon: FileText, title: 'Proposta', desc: 'Uma apresentação comercial pronta para o cliente entender valor.' },
  { n: '04', icon: FileSignature, title: 'Contrato', desc: 'Fechamento e continuidade no mesmo histórico.' },
];

export default function Landing() {
  return (
    <LandingLayout>
      <Hero />

      <section id="recursos" className="overflow-hidden bg-[#f8f6f1] py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex items-center gap-3 sm:mb-14">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#171614] text-[10px] font-semibold text-white">1</span>
            <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-medium text-black/55">Por que Áurea</span>
          </div>

          <h2 className="max-w-[17ch] text-[clamp(2.1rem,5vw,4.3rem)] font-medium leading-[1.02] tracking-[-0.05em] text-[#171614]">
            O comercial fica mais simples quando cada etapa sabe de onde veio e para onde vai.
          </h2>

          <div className="mt-12 grid gap-8 lg:mt-20 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div className="max-w-md">
              <p className="text-sm leading-7 text-black/48 sm:text-base sm:leading-8">
                {APP_CONFIG.name} não é uma coleção de telas. É um fluxo para quem vende projetos e serviços profissionais sem querer depender de planilha, WhatsApp e documentos soltos.
              </p>
              <Link to={ROUTES.auth.register} className="group mt-7 inline-flex h-11 items-center gap-3 rounded-full bg-[#f26522] pl-5 pr-2 text-xs font-semibold text-white transition hover:bg-[#df5b1d]">
                Criar workspace
                <span className="flex size-7 items-center justify-center rounded-full bg-white text-[#f26522]"><ArrowUpRight className="size-3.5 transition-transform group-hover:rotate-45" /></span>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {productFlow.map(({ n, icon: Icon, title, desc }) => (
                <article key={title} className="min-h-[210px] rounded-[26px] bg-[#ece7df] p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/28">{n}</span>
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#f8f6f1] text-[#f26522]"><Icon className="size-4" /></span>
                  </div>
                  <h3 className="mt-10 text-2xl font-semibold tracking-[-0.04em] text-[#171614]">{title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-black/45">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-[#e9e5dd] py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex items-center gap-3 sm:mb-14">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#171614] text-[10px] font-semibold text-white">2</span>
            <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-medium text-black/55">O produto em uso</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
            <div>
              <h2 className="max-w-[11ch] text-[clamp(2.2rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#171614]">Da conversa ao fechamento, sem trocar de ferramenta.</h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-black/47 sm:text-base sm:leading-8">O mesmo contexto acompanha o cliente enquanto a negociação avança. Você não precisa reconstruir a história a cada etapa.</p>
            </div>

            <div className="relative overflow-hidden rounded-[30px] bg-[#171614] p-4 shadow-[0_35px_90px_rgba(35,29,22,.16)] sm:p-5 lg:p-6">
              <img src={APP_CONFIG.brand.product} alt="Workspace comercial do Áurea" className="aspect-[16/10] w-full rounded-[22px] object-cover object-top opacity-90" loading="lazy" />
              <div className="mt-5 flex flex-col gap-3 px-1 pb-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">Workspace comercial</p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">Tudo que importa para decidir o próximo passo.</p>
                </div>
                <Link to={ROUTES.auth.login} className="inline-flex items-center gap-2 text-xs font-semibold text-white/55 transition hover:text-white">Explorar produto <ArrowUpRight className="size-3.5" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f26522] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">Comece pelo próximo projeto</p>
            <h2 className="mt-4 max-w-[11ch] text-[clamp(2.4rem,5vw,4.7rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">Precifique com método. Apresente com clareza.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to={ROUTES.auth.register} className="group inline-flex h-12 items-center justify-between gap-6 rounded-full bg-white pl-6 pr-2 text-[13px] font-semibold text-[#171614]">
              Criar conta
              <span className="flex size-8 items-center justify-center rounded-full bg-[#171614] text-white"><ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" /></span>
            </Link>
            <Link to={ROUTES.auth.login} className="inline-flex h-12 items-center justify-center rounded-full px-5 text-[13px] font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">Já tenho conta</Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
