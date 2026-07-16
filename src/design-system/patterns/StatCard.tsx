import { cn } from '@/shared/utils/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      {Icon && (
        <div className="flex justify-center mb-3">
          <Icon className="w-5 h-5 text-violet-400" />
        </div>
      )}
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
