import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar (frontend)', () => {
  it('dispara onChange ao digitar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} placeholder="Buscar clientes…" />);
    await user.type(screen.getByPlaceholderText('Buscar clientes…'), 'Ana');
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.some((call) => call[0] === 'A')).toBe(true);
  });

  it('mostra botão limpar e limpa o valor', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="tech" onChange={onChange} />);
    const clear = screen.getByRole('button', { name: 'Limpar busca' });
    await user.click(clear);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('não mostra limpar quando vazio', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Limpar busca' })).not.toBeInTheDocument();
  });
});
