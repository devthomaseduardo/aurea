import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import CalculatorPage from './CalculatorPage';

describe('CalculatorPage (frontend)', () => {
  it('renderiza calculadora de projeto', () => {
    renderWithProviders(<CalculatorPage />);
    expect(
      screen.getByRole('heading', { name: /Transforme escopo em preço defendível/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Precificacao de projeto/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Carregar exemplo/i })).toBeInTheDocument();
  });
});
