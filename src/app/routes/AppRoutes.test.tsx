import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { AppRoutes } from './index';
import { ROUTES } from '@/core/config/app.config';

const waitPage = { timeout: 5000 };

describe('AppRoutes', () => {
  it('renderiza a proposta de valor do Aurea em /', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.home] },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: (_content, element) =>
            (element?.textContent ?? '').toLowerCase().includes('precifique projetos') &&
            (element?.textContent ?? '').toLowerCase().includes('feche contratos'),
        })
      ).toBeInTheDocument();
    }, waitPage);
  });

  it('protege /app e redireciona para login quando nao autenticado', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.app.dashboard] },
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Acesse seu workspace/i })).toBeInTheDocument();
    }, waitPage);
  });

  it('renderiza tela de login em /login', async () => {
    renderWithProviders(<AppRoutes />, {
      routerProps: { initialEntries: [ROUTES.auth.login] },
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Acesse seu workspace/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continuar com Google/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continuar com GitHub/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Explorar workspace demo/i })).toBeInTheDocument();
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
