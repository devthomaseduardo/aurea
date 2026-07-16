import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import Hero from './Hero';
import { ROUTES } from '@/core/config/app.config';

describe('Hero (frontend)', () => {
  it('renderiza headline enterprise e CTAs principais', () => {
    renderWithProviders(<Hero />);

    expect(
      screen.getByRole('heading', {
        name: (_c, el) =>
          (el?.textContent ?? '').toLowerCase().includes('operação comercial') &&
          (el?.textContent ?? '').toLowerCase().includes('enterprise'),
      })
    ).toBeInTheDocument();

    const appCta = screen.getByRole('link', { name: /Acessar a plataforma/i });
    expect(appCta).toHaveAttribute('href', ROUTES.auth.login);
    expect(screen.getByRole('link', { name: /Conhecer a plataforma/i })).toHaveAttribute(
      'href',
      '#plataforma'
    );
  });
});
