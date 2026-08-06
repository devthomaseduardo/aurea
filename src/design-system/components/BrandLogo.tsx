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
  sm: { box: 'w-8 h-8', img: 'w-8 h-8', text: 'text-sm' },
  md: { box: 'w-9 h-9', img: 'w-9 h-9', text: 'text-[16px]' },
  lg: { box: 'w-11 h-11', img: 'w-11 h-11', text: 'text-xl' },
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
          'relative shrink-0 rounded-xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm flex items-center justify-center p-0.5',
          s.box
        )}
      >
        <img
          src={APP_CONFIG.brand.logo}
          alt={`${APP_CONFIG.name} logo`}
          className={cn('object-contain rounded-lg', s.img)}
          width={44}
          height={44}
        />
      </span>
      {showWordmark && (
        <span className={cn('font-black tracking-tight truncate leading-none text-[#0B1633]', s.text)}>
          Cambuci <span className="text-[#0055FF]">Mobile</span>
          <span className="text-[#FFD100] font-extrabold ml-0.5">.</span>
        </span>
      )}
    </Link>
  );
}
