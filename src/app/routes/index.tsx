import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/design-system/layouts/DashboardLayout';
import { LoadingState } from '@/design-system/patterns';
import { ROUTES } from '@/core/config/app.config';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { AuthBootstrap } from '@/modules/auth/components/AuthBootstrap';

const LandingPage = lazy(() => import('@/modules/landing/pages/Landing'));
const StatusPortalPage = lazy(() => import('@/modules/status/pages/StatusPortalPage'));
const NotFound = lazy(() => import('@/shared/components/NotFound'));
const DesignSystemPage = lazy(() => import('@/modules/design-system/pages/DesignSystemPage'));
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/modules/auth/pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('@/modules/auth/pages/AuthCallbackPage'));

const DashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const OrdersPage = lazy(() => import('@/modules/orders/pages/OrdersPage'));
const OrderFormPage = lazy(() => import('@/modules/orders/pages/OrderFormPage'));
const OrderDetailPage = lazy(() => import('@/modules/orders/pages/OrderDetailPage'));
const DevicesPage = lazy(() => import('@/modules/devices/pages/DevicesPage'));
const InventoryPage = lazy(() => import('@/modules/inventory/pages/InventoryPage'));
const POSPage = lazy(() => import('@/modules/pos/pages/POSPage'));

const ClientsPage = lazy(() => import('@/modules/clients/pages/ClientsPage'));
const ClientFormPage = lazy(() => import('@/modules/clients/pages/ClientFormPage'));
const CalculatorPage = lazy(() => import('@/modules/calculator/pages/CalculatorPage'));
const TeamPage = lazy(() => import('@/modules/team/pages/TeamPage'));
const WarrantiesPage = lazy(() => import('@/modules/warranties/pages/WarrantiesPage'));
const SettingsPage = lazy(() => import('@/modules/settings/pages/SettingsPage'));
const ProfilePage = lazy(() => import('@/modules/profile/pages/ProfilePage'));

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingState fullPage label="Carregando módulo…" />}>
      {children}
    </Suspense>
  );
}

export function AppRoutes() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route
          path={ROUTES.home}
          element={
            <Lazy>
              <LandingPage />
            </Lazy>
          }
        />

        <Route
          path={ROUTES.statusPortal}
          element={
            <Lazy>
              <StatusPortalPage />
            </Lazy>
          }
        />
        <Route
          path="/status/:id"
          element={
            <Lazy>
              <StatusPortalPage />
            </Lazy>
          }
        />

        <Route
          path={ROUTES.auth.login}
          element={
            <Lazy>
              <LoginPage />
            </Lazy>
          }
        />
        <Route
          path={ROUTES.auth.register}
          element={
            <Lazy>
              <RegisterPage />
            </Lazy>
          }
        />
        <Route
          path={ROUTES.auth.callback}
          element={
            <Lazy>
              <AuthCallbackPage />
            </Lazy>
          }
        />

        <Route
          path={ROUTES.designSystem}
          element={
            <Lazy>
              <DesignSystemPage />
            </Lazy>
          }
        />

        <Route
          path={ROUTES.app.root}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.app.dashboard} replace />} />
          <Route
            path="dashboard"
            element={
              <Lazy>
                <DashboardPage />
              </Lazy>
            }
          />
          <Route
            path="orders"
            element={
              <Lazy>
                <OrdersPage />
              </Lazy>
            }
          />
          <Route
            path="orders/new"
            element={
              <Lazy>
                <OrderFormPage />
              </Lazy>
            }
          />
          <Route
            path="orders/:id"
            element={
              <Lazy>
                <OrderDetailPage />
              </Lazy>
            }
          />
          <Route
            path="orders/:id/edit"
            element={
              <Lazy>
                <OrderFormPage />
              </Lazy>
            }
          />
          <Route
            path="devices"
            element={
              <Lazy>
                <DevicesPage />
              </Lazy>
            }
          />
          <Route
            path="inventory"
            element={
              <Lazy>
                <InventoryPage />
              </Lazy>
            }
          />
          <Route
            path="pos"
            element={
              <Lazy>
                <POSPage />
              </Lazy>
            }
          />
          <Route
            path="clients"
            element={
              <Lazy>
                <ClientsPage />
              </Lazy>
            }
          />
          <Route
            path="clients/new"
            element={
              <Lazy>
                <ClientFormPage />
              </Lazy>
            }
          />
          <Route
            path="clients/:id"
            element={
              <Lazy>
                <ClientFormPage />
              </Lazy>
            }
          />
          <Route
            path="calculator"
            element={
              <Lazy>
                <CalculatorPage />
              </Lazy>
            }
          />
          <Route
            path="team"
            element={
              <Lazy>
                <TeamPage />
              </Lazy>
            }
          />
          <Route
            path="warranties"
            element={
              <Lazy>
                <WarrantiesPage />
              </Lazy>
            }
          />
          <Route
            path="settings"
            element={
              <Lazy>
                <SettingsPage />
              </Lazy>
            }
          />
          <Route
            path="profile"
            element={
              <Lazy>
                <ProfilePage />
              </Lazy>
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <Lazy>
              <NotFound />
            </Lazy>
          }
        />
      </Routes>
    </AuthBootstrap>
  );
}
