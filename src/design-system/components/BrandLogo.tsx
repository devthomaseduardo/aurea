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
  sm: { mark: 'w-5 h-5 text-[10px]', text: 'text-[14px]' },
  md: { mark: 'w-6 h-6 text-[11px]', text: 'text-[15px]' },
  lg: { mark: 'w-8 h-8 text-sm', text: 'text-lg' },
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
    <Link to={to} onClick={onClick} className={cn('flex items-center gap-2 min-w-0', className)}>
      <span
        className={cn(
          'shrink-0 rounded-[3px] flex items-center justify-center font-semibold text-white bg-[#37352f]',
          s.mark
        )}
        aria-hidden
      >
        A
      </span>
      {showWordmark && (
        <span className={cn('font-semibold tracking-tight text-[#37352f] truncate', s.text)}>
          {APP_CONFIG.name}
        </span>
      )}
    </Link>
  );
}
