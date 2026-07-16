import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import CalculatorPage from './CalculatorPage';
import { useCalculatorStore } from '@/stores/calculator.store';

describe('CalculatorPage (frontend)', () => {
  beforeEach(() => {
    localStorage.clear();
    useCalculatorStore.getState().reset();
  });

  it('renderiza wizard na etapa Informações', () => {
    renderWithProviders(<CalculatorPage />);
    expect(
      screen.getByRole('heading', { name: /Precificação de projetos/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Etapa 1 de 6/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Informações' })).toBeInTheDocument();
  });

  it('carrega demo e sincroniza o formulário da UI', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalculatorPage />);
    await user.click(screen.getByRole('button', { name: /Carregar cenário demo/i }));
    await waitFor(() => {
      expect(useCalculatorStore.getState().projeto.nome).toMatch(/Landing Page/i);
      const nome = screen.getByLabelText(/Nome do projeto/i) as HTMLInputElement;
      expect(nome.value).toMatch(/Landing Page/i);
    });
  });
});
