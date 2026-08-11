import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { LandingLayout } from '@/design-system/layouts/LandingLayout';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';

const principles = [
  ['01', 'Preço com contexto', 'O valor nasce de escopo, esforço, custo, prazo e margem. Não de um número solto no fim da conversa.'],
  ['02', 'Proposta como decisão', 'O cliente precisa entender o que recebe, quanto investe e o que acontece depois do aceite.'],
  ['03', 'Histórico contínuo', 'Cliente, proposta e contrato fazem mais sentido quando contam a mesma história comercial.'],
] as const;

export default function AboutPage() {
  return (
    <LandingLayout>
      <section className="relative overflow-hidden bg-[#171614] pb-16 pt-32 text-white sm:pb-20 sm:pt-36 lg:pb-28 lg:pt-40">
        <div className="pointer-events-none absolute -right-24 top-12 size-[32rem] rounded-full bg-[#f26522] opacity-90" />
        <div className="pointer-events-none absolute right-12 top-28 size-[24rem] rounded-[42%_58%_62%_38%/43%_42%_58%_57%] bg-[#efeae2] opacity-90 blur-[3px] [transform:rotate(17deg)]" />
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f6a576]">Sobre o produto</p>
          <h1 className="mt-5 max-w-[11ch] text-[clamp(3rem,7vw,6.6rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">O Áurea existe para tirar a venda do improviso.</h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/48 sm:text-base sm:leading-8">Um workspace comercial para profissionais e equipes que vendem projetos, precisam precificar com método e querem chegar ao contrato sem perder contexto.</p>
        </div>
      </section>

      <section className="bg-[#f8f6f1] py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30">O problema</p>
              <h2 className="mt-4 max-w-[10ch] text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#171614]">Planilha calcula. Ela não conduz uma negociação.</h2>
            </div>
            <div className="lg:pt-10">
              <p className="max-w-2xl text-xl leading-[1.35] tracking-[-0.025em] text-black/68 sm:text-2xl">O Áurea organiza as decisões que existem entre o primeiro contato e o fechamento: quem é o cliente, o que precisa ser feito, quanto custa entregar, quanto cobrar e como apresentar isso com clareza.</p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {['Precificação estruturada', 'Propostas ligadas ao cálculo', 'Histórico por cliente', 'Contratos no mesmo fluxo'].map((item) => <div key={item} className="flex items-center gap-2 rounded-full bg-[#ece7df] px-4 py-3 text-xs font-semibold text-black/55"><span className="flex size-6 items-center justify-center rounded-full bg-[#f26522] text-white"><Check className="size-3" /></span>{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e9e5dd] py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30">Princípios</p>
            <h2 className="mt-4 text-[clamp(2.3rem,5vw,4.3rem)] font-medium leading-[1] tracking-[-0.05em] text-[#171614]">Menos ferramenta. Mais clareza comercial.</h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {principles.map(([number, title, description]) => (
              <article key={title} className="min-h-[260px] rounded-[28px] bg-[#171614] p-6 text-white">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f6a576]">{number}</p>
                <h3 className="mt-14 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/42">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f26522] py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/60">Próximo projeto</p><h2 className="mt-3 max-w-[11ch] text-[clamp(2.3rem,5vw,4.4rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">Comece pela precificação, não pelo PDF.</h2></div>
          <Link to={ROUTES.auth.register} className="group inline-flex h-12 items-center justify-between gap-6 self-start rounded-full bg-white pl-6 pr-2 text-[13px] font-semibold text-[#171614] lg:self-auto">Criar workspace<span className="flex size-8 items-center justify-center rounded-full bg-[#171614] text-white"><ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" /></span></Link>
        </div>
      </section>
    </LandingLayout>
  );
}
