import { cn } from '@/shared/utils/utils';

/** Koboyo hand-drawn icons — https://koboyo.com/icons (commercial use OK) */
export type KoboyoName = string;

const ALIAS: Record<string, string> = {
  home: 'house',
  'check-circle': 'circle-check',
  'check-circle-2': 'circle-check',
  'alert-triangle': 'triangle-alert',
  refresh: 'refresh-cw',
  'loader-2': 'loader',
  building: 'store',
  'building-2': 'store',
  'file-signature': 'file-text',
  'bar-chart-3': 'bar-chart',
};

export interface KoboyoIconProps {
  name: KoboyoName;
  size?: number;
  className?: string;
  title?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

/** CSS-mask icon from Koboyo CDN (currentColor). */
export function KoboyoIcon({
  name,
  size = 18,
  className,
  title,
  'aria-hidden': ariaHidden = true,
}: KoboyoIconProps) {
  const resolved = ALIAS[name] ?? name;
  const src = `https://koboyo.com/icons/svg/${resolved}.svg`;

  return (
    <span
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : ariaHidden}
      className={cn('inline-block shrink-0 align-middle', className)}
      style={{
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
      data-icon={resolved}
    />
  );
}

export default KoboyoIcon;
