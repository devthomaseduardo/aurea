import { cn } from '@/shared/utils/utils';
import { WIZARD_STEPS } from '../schemas/wizard.schemas';
import { Check } from 'lucide-react';

interface WizardStepperProps {
  current: number;
  onStepClick?: (index: number) => void;
}

export function WizardStepper({ current, onStepClick }: WizardStepperProps) {
  return (
    <div className="mb-2">
      <div className="flex flex-col">
        {WIZARD_STEPS.map((step, index) => {
          const active = index === current;
          const done = index < current;
          return (
            <div key={step.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={index > current}
                className={cn(
                  'flex items-center gap-3 rounded-[14px] px-2 py-2 w-full min-w-0 transition-all text-left',
                  active && 'bg-white/[0.06]',
                  !active && !done && 'opacity-50',
                  index <= current && 'hover:bg-white/[0.08]'
                )}
              >
                <span
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 border transition-all duration-300',
                    active &&
                      'bg-[#f26522] text-white border-[#f26522] shadow-[0_0_16px_rgba(242,101,34,0.35)]',
                    done && 'bg-[#f26522]/15 text-[#f26522] border-[#f26522]/30',
                    !active && !done && 'bg-white/5 text-white/40 border-white/10'
                  )}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : index + 1}
                </span>
                <span
                  className={cn(
                    'text-[12px] font-medium transition-colors',
                    active ? 'text-white' : 'text-white/45'
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <div className="ml-[1.35rem] py-1">
                  <div
                    className={cn(
                      'w-px h-4',
                      done ? 'bg-[#f26522]/40' : 'bg-white/10'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
