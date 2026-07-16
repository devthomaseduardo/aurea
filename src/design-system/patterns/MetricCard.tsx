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
    <div className={cn('glass-card rounded-2xl p-5 relative overflow-hidden group', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate">
            {value}
          </p>
          {(hint || trend) && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-semibold',
                    positive ? 'text-emerald-400' : 'text-rose-400'
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
          <div className="feature-icon shrink-0 !w-10 !h-10">
            <Icon className="w-4 h-4 text-violet-400" />
          </div>
        )}
      </div>
    </div>
  );
}
