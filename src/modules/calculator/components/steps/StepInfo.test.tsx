import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { StepInfo } from './StepInfo';
import { useCalculatorStore } from '@/stores/calculator.store';

describe('StepInfo wizard (frontend)', () => {
  beforeEach(() => {
    localStorage.clear();
    useCalculatorStore.getState().reset();
  });

  it('valida campos obrigatórios e bloqueia avanço', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    renderWithProviders(<StepInfo onNext={onNext} />);
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => {
      expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument();
    });
    expect(onNext).not.toHaveBeenCalled();
  });

  it('preenche formulário válido e avança', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    renderWithProviders(<StepInfo onNext={onNext} />);
    await user.type(screen.getByLabelText(/Nome do projeto/i), 'App SaaS Premium');
    await user.type(
      screen.getByLabelText(/Descrição/i),
      'Uma descrição longa o suficiente para o schema'
    );
    await user.clear(screen.getByLabelText(/Valor por hora/i));
    await user.type(screen.getByLabelText(/Valor por hora/i), '150');
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => {
      expect(onNext).toHaveBeenCalledTimes(1);
    });

    expect(useCalculatorStore.getState().projeto.nome).toBe('App SaaS Premium');
    expect(useCalculatorStore.getState().projeto.valorHora).toBe(150);
  });
});
