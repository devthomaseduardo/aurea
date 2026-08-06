import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import CalculatorPage from './CalculatorPage';

describe('CalculatorPage (frontend)', () => {
  it('renderiza calculadora de orçamento de conserto', () => {
    renderWithProviders(<CalculatorPage />);
    expect(
      screen.getByRole('heading', { name: /Calculadora de Orçamento de Conserto/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Parâmetros do Manutenção/i)).toBeInTheDocument();
    expect(screen.getByText(/ORÇAMENTO RECOMENDADO/i)).toBeInTheDocument();
  });
});
