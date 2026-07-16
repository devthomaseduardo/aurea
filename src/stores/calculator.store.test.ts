import { beforeEach, describe, expect, it } from 'vitest';
import { useCalculatorStore } from './calculator.store';

describe('useCalculatorStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useCalculatorStore.getState().reset();
  });

  it('inicia no step 0 com projeto vazio', () => {
    const state = useCalculatorStore.getState();
    expect(state.step).toBe(0);
    expect(state.projeto.nome).toBe('');
    expect(state.resultado).toBeNull();
  });

  it('navega entre steps com limites', () => {
    const store = useCalculatorStore.getState();
    store.nextStep();
    store.nextStep();
    expect(useCalculatorStore.getState().step).toBe(2);

    store.prevStep();
    expect(useCalculatorStore.getState().step).toBe(1);

    useCalculatorStore.getState().setStep(5);
    useCalculatorStore.getState().nextStep();
    expect(useCalculatorStore.getState().step).toBe(5);

    useCalculatorStore.getState().setStep(0);
    useCalculatorStore.getState().prevStep();
    expect(useCalculatorStore.getState().step).toBe(0);
  });

  it('atualiza projeto e recalcula resultado', () => {
    useCalculatorStore.getState().updateProjeto({
      nome: 'Novo Projeto',
      valorHora: 150,
      requisitos: [
        {
          id: '1',
          descricao: 'Feature',
          complexidade: 'media',
          estimativaDias: 2,
          estimativaHoras: 16,
        },
      ],
    });

    const resultado = useCalculatorStore.getState().recalculate();
    expect(useCalculatorStore.getState().projeto.nome).toBe('Novo Projeto');
    expect(resultado.totalHoras).toBe(16);
    expect(resultado.custoBase).toBe(2400);
    expect(useCalculatorStore.getState().resultado).not.toBeNull();
  });

  it('carrega demo com dados preenchidos', () => {
    useCalculatorStore.getState().loadDemo();
    const state = useCalculatorStore.getState();

    expect(state.projeto.nome.length).toBeGreaterThan(3);
    expect(state.projeto.requisitos.length).toBeGreaterThan(0);
    expect(state.resultado).not.toBeNull();
    expect(state.resultado!.totalHoras).toBeGreaterThan(0);
  });

  it('reset limpa demo e volta ao estado inicial', () => {
    useCalculatorStore.getState().loadDemo();
    useCalculatorStore.getState().setStep(3);
    useCalculatorStore.getState().reset();

    const state = useCalculatorStore.getState();
    expect(state.step).toBe(0);
    expect(state.projeto.nome).toBe('');
    expect(state.resultado).toBeNull();
  });
});
