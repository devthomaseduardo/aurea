import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { LoadingState } from '@/design-system/patterns';
import { ROUTES } from '@/core/config/app.config';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return <LoadingState fullPage label="Validando sessão…" />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.auth.login} replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}
