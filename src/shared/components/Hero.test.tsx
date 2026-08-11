import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import Hero from './Hero';

describe('Hero (frontend)', () => {
  it('renderiza headline e CTA', () => {
    renderWithProviders(<Hero />);

    expect(
      screen.getByRole('heading', {
        name: /Venda projetos com clareza/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Criar workspace/i)).toBeInTheDocument();
  });
});
