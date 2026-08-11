import { PageContainer } from '@/design-system/patterns';
import { WizardStepper } from '../components/WizardStepper';
import { useCalculatorStore } from '@/stores/calculator.store';
import { StepInfo } from '../components/steps/StepInfo';
import { StepEscopo } from '../components/steps/StepEscopo';
import { StepTecnologias } from '../components/steps/StepTecnologias';
import { StepCustos } from '../components/steps/StepCustos';
import { StepCronograma } from '../components/steps/StepCronograma';
import { StepResumo } from '../components/steps/StepResumo';
import { Button } from '@/shared/components/ui/button';
import { Sparkles } from 'lucide-react';
import { WIZARD_STEPS } from '../schemas/wizard.schemas';

export default function CalculatorPage() {
  const { step, setStep, nextStep, prevStep, loadDemo } = useCalculatorStore();
  const currentStep = WIZARD_STEPS[step];

  return (
    <PageContainer size="lg">
      <section className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-black/32">Precificacao de projeto</p>
          <h1 className="max-w-[12ch] text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[#171614]">Transforme escopo em preço defendível.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/45">Organize esforço, tecnologia, custos, prazo e margem antes de transformar o cálculo em proposta.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={loadDemo} className="rounded-full bg-white/60 px-4 text-xs font-semibold text-black/55 hover:bg-white hover:text-black">
          <Sparkles className="mr-1.5 size-3.5 text-[#f26522]" />Carregar exemplo
        </Button>
      </section>

      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[26px] bg-[#171614] p-4 text-white xl:sticky xl:top-24">
          <div className="px-2 pb-5 pt-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">Fluxo do orçamento</p>
            <p className="mt-2 text-sm leading-6 text-white/48">Cada etapa reduz incerteza antes de chegar ao valor final.</p>
          </div>
          <WizardStepper current={step} onStepClick={(index) => index <= step && setStep(index)} />
        </aside>

        <section className="rounded-[28px] border border-black/[0.06] bg-white/72 p-5 shadow-[0_24px_65px_rgba(35,29,22,.055)] sm:p-7 lg:p-8">
          <div className="mb-7 flex items-start justify-between gap-5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a74717]">Etapa {step + 1} de {WIZARD_STEPS.length}</p>
              <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold tracking-[-0.045em] text-[#171614]">{currentStep.label}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/42">{currentStep.description}</p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ece7df] text-xs font-semibold text-[#a74717]">0{step + 1}</span>
          </div>

          {step === 0 && <StepInfo onNext={nextStep} />}
          {step === 1 && <StepEscopo onNext={nextStep} onBack={prevStep} />}
          {step === 2 && <StepTecnologias onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <StepCustos onNext={nextStep} onBack={prevStep} />}
          {step === 4 && <StepCronograma onNext={nextStep} onBack={prevStep} />}
          {step === 5 && <StepResumo onBack={prevStep} />}
        </section>
      </div>
    </PageContainer>
  );
}
