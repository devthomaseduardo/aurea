import { cn } from '@/shared/utils/utils';
import type { ReactNode } from 'react';

interface MetricGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4 | 5;
}

export function MetricGrid({ children, className, columns = 4 }: MetricGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
        columns === 5 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
        className
      )}
    >
      {children}
    </div>
  );
}
