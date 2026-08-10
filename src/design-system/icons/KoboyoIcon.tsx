import { cn } from '@/shared/utils/utils';

/** Koboyo hand-drawn icons — https://koboyo.com/icons (commercial use OK) */
export type KoboyoName =
  | 'arrow-right'
  | 'menu'
  | 'x'
  | 'users'
  | 'calculator'
  | 'file-text'
  | 'check'
  | 'circle-check'
  | 'search'
  | 'plus'
  | 'trash'
  | 'trash-2'
  | 'settings'
  | 'house'
  | 'layout-dashboard'
  | 'dashboard'
  | 'activity'
  | 'shield'
  | 'plug'
  | 'chart'
  | 'bar-chart'
  | 'trending-up'
  | 'trending-down'
  | 'mail'
  | 'phone'
  | 'save'
  | 'copy'
  | 'send'
  | 'clock'
  | 'code'
  | 'loader'
  | 'refresh-cw'
  | 'rotate-ccw'
  | 'warning'
  | 'triangle-alert'
  | 'inbox'
  | 'store'
  | 'star'
  | 'award'
  | 'calendar'
  | 'filter'
  | 'pencil';

const ALIAS: Record<string, KoboyoName> = {
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
  name: KoboyoName | string;
  size?: number;
  className?: string;
  title?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

/** Renders Koboyo SVG via CSS mask so currentColor works. */
export function KoboyoIcon({
  name,
  size = 18,
  className,
  title,
  'aria-hidden': ariaHidden = true,
}: KoboyoIconProps) {
  const resolved = (ALIAS[name] ?? name) as string;
  const src = `/icons/koboyo/${resolved}.svg`;

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
    />
  );
}

export default KoboyoIcon;
