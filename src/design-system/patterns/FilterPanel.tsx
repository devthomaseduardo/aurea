import { cn } from '@/shared/utils/utils';
import type { ReactNode } from 'react';

interface FilterPanelProps {
  children: ReactNode;
  className?: string;
}

export function FilterPanel({ children, className }: FilterPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center gap-3 mb-6 p-3 rounded-xl border border-border bg-card/40',
        className
      )}
    >
      {children}
    </div>
  );
}
