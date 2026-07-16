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

  it('protege /app e redireciona para login quando não autenticado', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.app.dashboard] },
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Acessar conta/i })).toBeInTheDocument();
    }, waitPage);
  });

  it('renderiza tela de login em /login', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.auth.login] },
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Acessar conta/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continuar com Google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continuar com GitHub/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Entrar com conta demo/i })).toBeInTheDocument();
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
