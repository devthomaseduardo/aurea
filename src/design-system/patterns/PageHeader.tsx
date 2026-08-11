import { cn } from '@/shared/utils/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0 max-w-3xl">
        {breadcrumbs && <div className="mb-3 text-[10px] uppercase tracking-[0.14em] text-black/35">{breadcrumbs}</div>}
        <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#171614]">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-black/46 sm:text-[15px] sm:leading-7">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
