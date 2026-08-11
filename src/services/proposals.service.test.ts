import { beforeEach, describe, expect, it } from 'vitest';
import { proposalsService } from './proposals.service';
import { calcularOrcamento } from '@/modules/calculator/domain/calculadora';
import { createProjeto } from '@/test/fixtures/projeto';

describe('proposalsService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('seed inicial cria propostas de demonstração', () => {
    expect(proposalsService.getAll().length).toBeGreaterThanOrEqual(3);
  });

  it('cria proposta a partir do cálculo', () => {
    const projeto = createProjeto({ nome: 'Proposta via cálculo' });
    const resultado = calcularOrcamento(projeto);

    const proposal = proposalsService.createFromCalculation(
      'Proposta via cálculo',
      'cli_1',
      'Cliente Demo',
      projeto,
      resultado,
      'padrao'
    );

    expect(proposal.id).toMatch(/^id_/);
    expect(proposal.title).toBe('Proposta via cálculo');
    expect(proposal.totalHours).toBe(resultado.totalHoras);
    expect(proposal.projectSnapshot).toBeTruthy();
    expect(proposal.resultSnapshot).toBeTruthy();
  });

  it('duplica proposta como rascunho', () => {
    const original = proposalsService.getAll()[0];
    const copy = proposalsService.duplicate(original.id);

    expect(copy).toBeDefined();
    expect(copy!.id).not.toBe(original.id);
    expect(copy!.title).toContain('cópia');
    expect(copy!.status).toBe('draft');
    expect(copy!.sentAt).toBeUndefined();
  });

  it('atualiza status e remove proposta', () => {
    const projeto = createProjeto({ nome: 'Para atualizar' });
    const created = proposalsService.createFromCalculation(
      'Para atualizar',
      'cli_1',
      'Cliente Demo',
      projeto,
      calcularOrcamento(projeto),
      'padrao'
    );

    const updated = proposalsService.updateStatus(created.id, 'sent');
    expect(updated?.status).toBe('sent');

    expect(proposalsService.remove(created.id)).toBe(true);
    expect(proposalsService.getById(created.id)).toBeUndefined();
  });

  it('filtra por status e busca', async () => {
    const drafts = await proposalsService.list({ status: 'draft', pageSize: 50 });
    expect(drafts.items.every((p) => p.status === 'draft')).toBe(true);

    const search = await proposalsService.list({ search: 'Landing', pageSize: 50 });
    expect(search.items.length).toBeGreaterThan(0);
  });
});

