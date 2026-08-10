import { Link } from 'react-router-dom';
import { APP_CONFIG, ROUTES } from '@/core/config/app.config';
import { cn } from '@/shared/utils/utils';

interface BrandLogoProps {
  to?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const sizes = {
  sm: { mark: 'w-7 h-7 text-[11px]', text: 'text-sm' },
  md: { mark: 'w-9 h-9 text-sm', text: 'text-base' },
  lg: { mark: 'w-11 h-11 text-base', text: 'text-xl' },
};

export function BrandLogo({
  to = ROUTES.home,
  showWordmark = true,
  size = 'md',
  className,
  onClick,
}: BrandLogoProps) {
  const s = sizes[size];

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn('flex items-center gap-2.5 min-w-0 group', className)}
    >
      <span
        className={cn(
          'relative shrink-0 rounded-xl flex items-center justify-center font-black text-white',
          'bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-sm',
          'ring-1 ring-indigo-500/20',
          s.mark
        )}
        aria-hidden
      >
        A
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" />
      </span>
      {showWordmark && (
        <span
          className={cn(
            'font-bold tracking-tight truncate leading-none text-slate-900',
            s.text
          )}
        >
          {APP_CONFIG.name}
          <span className="text-amber-500 font-extrabold">.</span>
        </span>
      )}
    </Link>
  );
}
