import { cn } from '@/shared/utils/utils';
import { WIZARD_STEPS } from '../schemas/wizard.schemas';
import { Check } from 'lucide-react';

interface WizardStepperProps {
  current: number;
  onStepClick?: (index: number) => void;
}

export function WizardStepper({ current, onStepClick }: WizardStepperProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {WIZARD_STEPS.map((step, index) => {
          const active = index === current;
          const done = index < current;
          return (
            <div key={step.id} className="flex items-center min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={index > current}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-2 w-full min-w-0 transition-colors',
                  active && 'bg-primary/10',
                  !active && !done && 'opacity-50',
                  index <= current && 'hover:bg-white/[0.03]'
                )}
              >
                <span
                  className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold shrink-0 border',
                    active &&
                      'bg-primary text-primary-foreground border-primary shadow-[0_0_16px_hsla(250,85%,60%,0.35)]',
                    done && 'bg-primary/15 text-primary border-primary/30',
                    !active && !done && 'bg-muted text-muted-foreground border-border'
                  )}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : index + 1}
                </span>
                <span
                  className={cn(
                    'text-[11px] sm:text-xs font-medium truncate hidden xs:inline sm:inline',
                    active ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px w-2 sm:w-4 shrink-0 mx-0.5',
                    done ? 'bg-primary/40' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
