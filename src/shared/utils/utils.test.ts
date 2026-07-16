import { describe, expect, it, vi } from 'vitest';
import {
  cn,
  downloadTextFile,
  formatCurrency,
  formatDate,
  formatRelativeDate,
  generateId,
  slugify,
  truncate,
} from './utils';

describe('cn', () => {
  it('mescla classes e resolve conflitos do tailwind', () => {
    expect(cn('px-2 py-1', 'px-4')).toContain('px-4');
    expect(cn('text-sm', false && 'hidden', 'font-bold')).toBe('text-sm font-bold');
  });
});

describe('formatCurrency', () => {
  it('formata BRL e USD', () => {
    const brl = formatCurrency(1234.5, 'BRL');
    const usd = formatCurrency(1234.5, 'USD');
    expect(brl).toMatch(/1.?234/);
    expect(usd).toMatch(/1,?234|1.?234/);
  });
});

describe('formatDate', () => {
  it('formata data em pt-BR', () => {
    const formatted = formatDate('2026-01-15T12:00:00.000Z');
    expect(formatted.length).toBeGreaterThan(5);
  });
});

describe('formatRelativeDate', () => {
  it('retorna "agora" para timestamps recentes', () => {
    expect(formatRelativeDate(new Date())).toBe('agora');
  });

  it('retorna minutos relativos', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000);
    expect(formatRelativeDate(fiveMinAgo)).toBe('há 5 min');
  });
});

describe('generateId', () => {
  it('gera ids únicos com prefixo', () => {
    const a = generateId('cli');
    const b = generateId('cli');
    expect(a).toMatch(/^cli_/);
    expect(b).toMatch(/^cli_/);
    expect(a).not.toBe(b);
  });
});

describe('slugify', () => {
  it('normaliza texto com acentos e espaços', () => {
    expect(slugify('Olá Mundo SaaS!')).toBe('ola-mundo-saas');
  });
});

describe('truncate', () => {
  it('não corta strings curtas', () => {
    expect(truncate('abc', 10)).toBe('abc');
  });

  it('corta com reticências', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });
});

describe('downloadTextFile', () => {
  it('dispara download via anchor', () => {
    const click = vi.fn();
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click,
    } as unknown as HTMLAnchorElement);
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });

    downloadTextFile('conteudo', 'arquivo.txt');

    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');

    createElement.mockRestore();
  });
});
