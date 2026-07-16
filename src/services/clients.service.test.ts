import { beforeEach, describe, expect, it } from 'vitest';
import { clientsService } from './clients.service';

describe('clientsService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('seed inicial cria clientes de demonstração', () => {
    const all = clientsService.getAll();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('lista com paginação', () => {
    const page1 = clientsService.list({ page: 1, pageSize: 1 });
    expect(page1.data).toHaveLength(1);
    expect(page1.total).toBeGreaterThanOrEqual(2);
    expect(page1.totalPages).toBeGreaterThanOrEqual(2);
  });

  it('filtra por busca textual', () => {
    const result = clientsService.list({ search: 'TechCorp' });
    expect(result.data.some((c) => c.company?.includes('TechCorp'))).toBe(true);
  });

  it('filtra por status', () => {
    const leads = clientsService.list({ status: 'lead' });
    expect(leads.data.every((c) => c.status === 'lead')).toBe(true);
    expect(leads.data.length).toBeGreaterThan(0);
  });

  it('ordena por nome', () => {
    const asc = clientsService.list({ sortBy: 'name', sortDir: 'asc', pageSize: 50 });
    const names = asc.data.map((c) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    expect(names).toEqual(sorted);
  });

  it('cria, atualiza e remove cliente', () => {
    const created = clientsService.create({
      name: 'Novo Cliente',
      email: 'novo@email.com',
      status: 'lead',
    });

    expect(created.id).toMatch(/^cli_/);
    expect(clientsService.getById(created.id)?.name).toBe('Novo Cliente');

    const updated = clientsService.update(created.id, { status: 'active', company: 'ACME' });
    expect(updated?.status).toBe('active');
    expect(updated?.company).toBe('ACME');

    expect(clientsService.remove(created.id)).toBe(true);
    expect(clientsService.getById(created.id)).toBeUndefined();
  });

  it('update/remove retornam falha para id inexistente', () => {
    expect(clientsService.update('nao_existe', { name: 'X' })).toBeUndefined();
    expect(clientsService.remove('nao_existe')).toBe(false);
  });
});
