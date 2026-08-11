import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, FileText, Calculator, Users } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

const stages = [
  { icon: Users, label: 'Cliente', detail: 'TechCorp Brasil' },
  { icon: Calculator, label: 'Precificacao', detail: 'R$ 28.400' },
  { icon: FileText, label: 'Proposta', detail: 'Pronta para enviar' },
];

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden bg-[#efede8] pt-24 text-[#171614] sm:pt-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[12%] -top-[15%] h-[72vw] max-h-[940px] w-[72vw] max-w-[940px] rounded-full bg-[#f26522] opacity-85 blur-[2px]" />
        <div className="absolute right-[4%] top-[8%] h-[54vw] max-h-[720px] w-[54vw] max-w-[720px] rounded-[42%_58%_63%_37%/43%_45%_55%_57%] bg-[#f7f4ee] opacity-80 blur-[10px] [transform:rotate(18deg)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(255,255,255,.9),transparent_18%),linear-gradient(120deg,transparent_40%,rgba(255,255,255,.26)_61%,transparent_78%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.65%22/%3E%3C/svg%3E')]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-[1440px] flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
        <div className="grid items-end gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
          <div className="max-w-[760px]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/48 sm:text-xs">{APP_CONFIG.name} · Comercial para servicos B2B</p>
            <h1 className="max-w-[11ch] text-[clamp(2.9rem,7vw,6rem)] font-medium leading-[0.94] tracking-[-0.055em] text-[#171614]">
              Venda projetos com clareza antes mesmo de falar de preco.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-black/55 sm:text-base sm:leading-8">
              Cliente, precificacao, proposta e contrato no mesmo fluxo. Menos improviso comercial, mais contexto para fechar melhor.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to={ROUTES.auth.register} className="group inline-flex h-12 items-center justify-between gap-6 rounded-full bg-[#f26522] pl-6 pr-2 text-[13px] font-semibold text-white transition hover:bg-[#df5b1d] sm:w-auto">
                Criar workspace
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#f26522]">
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </Link>
              <div className="inline-flex items-center gap-2 px-1 text-xs font-medium text-black/45">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/70"><Check className="size-3.5 text-[#f26522]" /></span>
                Comece localmente ou conecte sua conta
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end lg:pb-1">
            <div className="relative ml-auto max-w-[560px] rounded-[30px] bg-[#171614] p-4 text-white shadow-[0_35px_100px_rgba(45,35,25,.22)] sm:p-5">
              <div className="flex items-center justify-between px-1 pb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Negociacao ativa</p>
                  <p className="mt-1 text-base font-semibold">Website B2B</p>
                </div>
                <span className="rounded-full bg-[#f26522] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]">Em andamento</span>
              </div>

              <div className="rounded-[24px] bg-[#f6f2eb] p-3 text-[#171614] sm:p-4">
                {stages.map(({ icon: Icon, label, detail }, index) => (
                  <div key={label} className="flex items-center gap-3 rounded-[18px] px-3 py-3.5 transition hover:bg-white/70">
                    <span className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm"><Icon className="size-4 text-[#f26522]" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">0{index + 1} · {label}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold">{detail}</p>
                    </div>
                    <ArrowUpRight className="size-4 text-black/25" />
                  </div>
                ))}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[['Valor','R$ 28,4k'],['Margem','32%'],['Prazo','19 dias']].map(([label,value]) => (
                    <div key={label} className="rounded-[16px] bg-[#eae4da] px-3 py-3">
                      <p className="text-[9px] uppercase tracking-[0.1em] text-black/35">{label}</p>
                      <p className="mt-1 text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
