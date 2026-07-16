import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renderiza título, descrição e ação', () => {
    render(
      <EmptyState
        title="Sem itens"
        description="Cadastre o primeiro registro"
        action={<button type="button">Criar</button>}
      />
    );

    expect(screen.getByText('Sem itens')).toBeInTheDocument();
    expect(screen.getByText('Cadastre o primeiro registro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument();
  });
});
