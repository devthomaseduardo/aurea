import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import NotFound from './NotFound';
import { ROUTES } from '@/core/config/app.config';

describe('NotFound page (frontend)', () => {
  it('exibe 404 e CTAs de navegação', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
    const home = screen.getByRole('link', { name: /Início/i });
    const app = screen.getByRole('link', { name: /Dashboard/i });
    expect(home).toHaveAttribute('href', ROUTES.home);
    expect(app).toHaveAttribute('href', ROUTES.app.dashboard);
  });
});
