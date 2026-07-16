import { useEffect, type ReactNode } from 'react';
import { useUiStore } from '@/stores/ui.store';

export function ThemeBootstrap({ children }: { children: ReactNode }) {
  const hydrateTheme = useUiStore((s) => s.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  return <>{children}</>;
}
