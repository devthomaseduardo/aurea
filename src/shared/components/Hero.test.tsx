import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import Hero from './Hero';

describe('Hero (frontend)', () => {
  it('renderiza headline de assistência técnica e CTAs principais', () => {
    renderWithProviders(<Hero />);

    expect(
      screen.getByRole('heading', {
        name: (_c, el) =>
          (el?.textContent ?? '').toLowerCase().includes('conserto de celulares') &&
          (el?.textContent ?? '').toLowerCase().includes('garantia de 90 dias'),
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Consultar minha OS/i)).toBeInTheDocument();
    expect(screen.getByText(/Solicitar orçamento/i)).toBeInTheDocument();
  });
});
