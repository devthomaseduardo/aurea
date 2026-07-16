import { describe, expect, it } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { DashboardLayout } from './DashboardLayout';
import { ROUTES } from '@/core/config/app.config';

describe('DashboardLayout (frontend)', () => {
  it('renderiza navegação principal e outlet', () => {
    renderWithProviders(
      <Routes>
        <Route path="/app" element={<DashboardLayout />}>
          <Route path="dashboard" element={<div>Conteúdo dashboard</div>} />
        </Route>
      </Routes>,
      { routerProps: { initialEntries: [ROUTES.app.dashboard] } }
    );

    expect(screen.getByText('Conteúdo dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visão geral' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Clientes' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'Precificação' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Propostas' })).toBeInTheDocument();
  });
});


