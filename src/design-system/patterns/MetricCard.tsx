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

export function MetricCard({ label, value, hint, icon: Icon, trend, className }: MetricCardProps) {
  const positive = trend ? trend.value >= 0 : null;
  return (
    <div className={cn('group relative min-h-[168px] overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/70 p-5 shadow-[0_16px_40px_rgba(33,28,22,.045)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_55px_rgba(33,28,22,.07)]', className)}>
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">{label}</p>
          {Icon && <span className="flex size-9 items-center justify-center rounded-full bg-[#ece7df] text-[#f26522]"><Icon className="size-4" /></span>}
        </div>
        <div>
          <p className="truncate text-[clamp(1.8rem,3vw,2.7rem)] font-semibold leading-none tracking-[-0.05em] text-[#171614] tabular-nums">{value}</p>
          {(hint || trend) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {trend && (
                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold', positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                  {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {positive ? '+' : ''}{trend.value}%
                </span>
              )}
              {hint && <span className="text-[11px] text-black/38">{hint}</span>}
              {trend?.label && <span className="text-[11px] text-black/38">{trend.label}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
