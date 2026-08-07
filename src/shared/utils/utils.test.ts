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
    expect(cn('text-sm', undefined, 'font-bold')).toBe('text-sm font-bold');
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
    const d = formatDate('2024-06-15T12:00:00.000Z');
    expect(d).toMatch(/15/);
    expect(d).toMatch(/06|6|jun/i);
  });
});

describe('formatRelativeDate', () => {
  it('retorna relativa ou absoluta', () => {
    const recent = formatRelativeDate(new Date(Date.now() - 60000).toISOString());
    expect(recent.length).toBeGreaterThan(0);
  });
});

describe('generateId', () => {
  it('gera id com prefixo', () => {
    expect(generateId('cli')).toMatch(/^cli_/);
  });
});

describe('slugify', () => {
  it('normaliza texto', () => {
    expect(slugify('Olá Mundo!')).toBe('ola-mundo');
  });
});

describe('truncate', () => {
  it('corta com ellipsis', () => {
    // max=5 → slice(0, 4) + '…' = 'abcd…'
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
    expect(truncate('abc', 5)).toBe('abc');
  });
});

describe('downloadTextFile', () => {
  it('dispara download (mock)', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    const click = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({ click, href: '', download: '' } as unknown as HTMLAnchorElement);
    downloadTextFile('hello', 't.txt');
    expect(click).toHaveBeenCalled();
  });
});
