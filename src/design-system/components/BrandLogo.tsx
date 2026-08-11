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
  sm: { mark: 'w-6 h-6', text: 'text-[14px]' },
  md: { mark: 'w-7 h-7', text: 'text-[15px]' },
  lg: { mark: 'w-9 h-9', text: 'text-lg' },
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
      className={cn('flex min-w-0 items-center gap-2.5', className)}
      aria-label={APP_CONFIG.name}
    >
      <img
        src={APP_CONFIG.brand.logoMark || '/logo.png'}
        alt=""
        aria-hidden="true"
        className={cn('shrink-0 object-contain', s.mark)}
      />

      {showWordmark && (
        <span className={cn('truncate font-semibold tracking-[-0.03em] text-current', s.text)}>
          {APP_CONFIG.name}
        </span>
      )}
    </Link>
  );
}
