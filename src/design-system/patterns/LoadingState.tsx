import { cn } from '@/shared/utils/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  className?: string;
  fullPage?: boolean;
}

export function LoadingState({
  label = 'Carregando…',
  className,
  fullPage,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-muted-foreground',
        fullPage ? 'min-h-[50vh]' : 'py-16',
        className
      )}
    >
      <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
