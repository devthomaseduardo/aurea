import { cn } from '@/shared/utils/utils';
import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}

export function SectionTitle({
  title,
  description,
  action,
  className,
  as: Tag = 'h2',
}: SectionTitleProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        <Tag className="text-base font-semibold text-foreground tracking-tight">{title}</Tag>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
