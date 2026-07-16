import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { StepEscopo } from './StepEscopo';
import { useCalculatorStore } from '@/stores/calculator.store';

describe('StepEscopo wizard (frontend)', () => {
  beforeEach(() => {
    localStorage.clear();
    useCalculatorStore.getState().reset();
  });

  it('exige ao menos um requisito para continuar', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    renderWithProviders(<StepEscopo onNext={onNext} onBack={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => {
      expect(screen.getByText(/ao menos um requisito/i)).toBeInTheDocument();
    });
    expect(onNext).not.toHaveBeenCalled();
  });

  it('adiciona requisito e avança', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    renderWithProviders(<StepEscopo onNext={onNext} onBack={vi.fn()} />);
    await user.type(screen.getByPlaceholderText(/Dashboard/i), 'CRUD de usuários');
    await user.click(screen.getByRole('button', { name: /Adicionar requisito/i }));
    expect(screen.getByText('CRUD de usuários')).toBeInTheDocument();
    expect(useCalculatorStore.getState().projeto.requisitos).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
  });

  it('remove requisito da lista', async () => {
    const user = userEvent.setup();
    useCalculatorStore.getState().updateProjeto({
      requisitos: [
        {
          id: 'req_1',
          descricao: 'Item temporário',
          complexidade: 'baixa',
          estimativaDias: 1,
          estimativaHoras: 8,
        },
      ],
    });

    renderWithProviders(<StepEscopo onNext={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByText('Item temporário')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button')[0]); // trash icon button
    await waitFor(() => {
      expect(useCalculatorStore.getState().projeto.requisitos).toHaveLength(0);
    });
  });
});
