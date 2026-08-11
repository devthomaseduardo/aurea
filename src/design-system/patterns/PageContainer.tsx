import { cn } from '@/shared/utils/utils';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClass = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1500px]',
  full: 'max-w-none',
};

export function PageContainer({ children, className, size = 'xl' }: PageContainerProps) {
  return (
    <div className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8 animate-fade-in', sizeClass[size], className)}>
      {children}
    </div>
  );
}
