import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { AppRoutes } from './index';
import { ROUTES } from '@/core/config/app.config';

const waitPage = { timeout: 5000 };

describe('AppRoutes (frontend)', () => {
  it('renderiza landing enterprise em /', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.home] },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: (_content, element) =>
            (element?.textContent ?? '').toLowerCase().includes('operação comercial') &&
            (element?.textContent ?? '').toLowerCase().includes('enterprise'),
        })
      ).toBeInTheDocument();
    }, waitPage);
  });

  it('renderiza shell do app e dashboard em /app/dashboard', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.app.dashboard] },
    });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Visão geral' })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /Visão geral executiva/i })
      ).toBeInTheDocument();
    }, waitPage);
  });

  it('renderiza precificação em /app/calculator', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.app.calculator] },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Precificação de projetos/i })
      ).toBeInTheDocument();
    }, waitPage);
  });

  it('renderiza 404 para rota desconhecida', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: ['/rota-que-nao-existe'] },
    });

    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
    }, waitPage);
  });
});
