import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/design-system/layouts/DashboardLayout';
import { LoadingState } from '@/design-system/patterns';
import { ROUTES } from '@/core/config/app.config';

const LandingPage = lazy(() => import('@/modules/landing/pages/Landing'));
const NotFound = lazy(() => import('@/shared/components/NotFound'));
const DesignSystemPage = lazy(() => import('@/modules/design-system/pages/DesignSystemPage'));

const DashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const ClientsPage = lazy(() => import('@/modules/clients/pages/ClientsPage'));
const ClientFormPage = lazy(() => import('@/modules/clients/pages/ClientFormPage'));
const CalculatorPage = lazy(() => import('@/modules/calculator/pages/CalculatorPage'));
const ProposalsPage = lazy(() => import('@/modules/proposals/pages/ProposalsPage'));
const ProposalDetailPage = lazy(() => import('@/modules/proposals/pages/ProposalDetailPage'));
const ContractsPage = lazy(() => import('@/modules/contracts/pages/ContractsPage'));
const AnalyticsPage = lazy(() => import('@/modules/analytics/pages/AnalyticsPage'));
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
        path={ROUTES.designSystem}
        element={
          <Lazy>
            <DesignSystemPage />
          </Lazy>
        }
      />

      <Route path={ROUTES.app.root} element={<DashboardLayout />}>
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
          path="proposals"
          element={
            <Lazy>
              <ProposalsPage />
            </Lazy>
          }
        />
        <Route
          path="proposals/:id"
          element={
            <Lazy>
              <ProposalDetailPage />
            </Lazy>
          }
        />
        <Route
          path="contracts"
          element={
            <Lazy>
              <ContractsPage />
            </Lazy>
          }
        />
        <Route
          path="analytics"
          element={
            <Lazy>
              <AnalyticsPage />
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
  );
}
