import { cn } from '@/shared/utils/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  trend?: { value: number; label?: string };
  className?: string;
}

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  const positive = trend ? trend.value >= 0 : null;
  return (
    <div
      className={cn(
        'app-panel p-5 relative overflow-hidden group transition-colors hover:border-primary/20',
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground mb-2">
            {label}
          </p>
          <p className="text-2xl md:text-[1.75rem] font-semibold tracking-tight text-foreground tabular-nums truncate">
            {value}
          </p>
          {(hint || trend) && (
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-medium rounded-md px-1.5 py-0.5',
                    positive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-rose-700 bg-rose-50'
                  )}
                >
                  {positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {positive ? '+' : ''}
                  {trend.value}%
                </span>
              )}
              {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
              {trend?.label && (
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className="feature-icon shrink-0 !w-9 !h-9">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
