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
  sm: { box: 'w-7 h-7', img: 'w-7 h-7', text: 'text-sm' },
  md: { box: 'w-8 h-8', img: 'w-8 h-8', text: 'text-[15px]' },
  lg: { box: 'w-10 h-10', img: 'w-10 h-10', text: 'text-lg' },
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
      className={cn('flex items-center gap-2.5 min-w-0', className)}
    >
      <span
        className={cn(
          'relative shrink-0 rounded-lg overflow-hidden ring-1 ring-border bg-white shadow-sm',
          s.box
        )}
      >
        <img
          src={APP_CONFIG.brand.logo}
          alt={`${APP_CONFIG.name} logo`}
          className={cn('object-cover', s.img)}
          width={40}
          height={40}
        />
      </span>
      {showWordmark && (
        <span className={cn('font-semibold tracking-tight truncate leading-none', s.text)}>
          {APP_CONFIG.name}
          <span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
