import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { LoadingState } from '@/design-system/patterns';

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrate();
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  if (!isHydrated || !ready) {
    return <LoadingState fullPage label="Iniciando Aurea…" />;
  }

  return <>{children}</>;
}
