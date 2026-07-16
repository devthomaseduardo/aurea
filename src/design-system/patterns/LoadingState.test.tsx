import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from './LoadingState';

describe('LoadingState (frontend)', () => {
  it('usa label padrão', () => {
    render(<LoadingState />);
    expect(screen.getByText('Carregando…')).toBeInTheDocument();
  });

  it('aceita label customizado', () => {
    render(<LoadingState label="Carregando dashboard…" fullPage />);
    expect(screen.getByText('Carregando dashboard…')).toBeInTheDocument();
  });
});
