/**
 * CalculaFreela Design Tokens
 * Single source of truth for visual language.
 * CSS variables are defined in global.css — these mirror them for JS usage.
 */

export const colors = {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  success: 'hsl(var(--success))',
  successForeground: 'hsl(var(--success-foreground))',
  warning: 'hsl(var(--warning))',
  warningForeground: 'hsl(var(--warning-foreground))',
  info: 'hsl(var(--info))',
  infoForeground: 'hsl(var(--info-foreground))',
  brand: {
    violet: 'hsl(var(--brand-violet))',
    blue: 'hsl(var(--brand-blue))',
    glow: 'hsl(var(--brand-glow))',
  },
} as const;

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
} as const;

export const radius = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.1' }],
    '6xl': ['3.75rem', { lineHeight: '1.05' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
} as const;

export const elevation = {
  none: 'none',
  sm: 'var(--elevation-sm)',
  md: 'var(--elevation-md)',
  lg: 'var(--elevation-lg)',
  xl: 'var(--elevation-xl)',
  glow: 'var(--elevation-glow)',
  glass: 'var(--elevation-glass)',
} as const;

export const shadows = elevation;

export const zIndex = {
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;

export const container = {
  center: true,
  padding: {
    DEFAULT: '1.5rem',
    md: '2rem',
    lg: '3rem',
  },
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    full: '100%',
  },
} as const;

export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const animations = {
  fadeIn: 'fade-in 0.4s ease-out',
  fadeUp: 'fade-up 0.5s ease-out',
  slideIn: 'slide-in 0.3s ease-out',
  accordionDown: 'accordion-down 0.2s ease-out',
  accordionUp: 'accordion-up 0.2s ease-out',
} as const;

export const grid = {
  columns: 12,
  gap: {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
} as const;

export const tokens = {
  colors,
  spacing,
  radius,
  typography,
  elevation,
  shadows,
  zIndex,
  breakpoints,
  container,
  iconSizes,
  transitions,
  animations,
  grid,
} as const;

export type DesignTokens = typeof tokens;
