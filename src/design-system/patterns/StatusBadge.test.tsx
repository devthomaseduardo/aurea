import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renderiza status de proposta', () => {
    render(<StatusBadge kind="proposal" status="accepted" />);
    expect(screen.getByText('Aceita')).toBeInTheDocument();
  });

  it('renderiza status de cliente', () => {
    render(<StatusBadge kind="client" status="lead" />);
    expect(screen.getByText('Lead')).toBeInTheDocument();
  });

  it('renderiza status de contrato', () => {
    render(<StatusBadge kind="contract" status="pending_signature" />);
    expect(screen.getByText('Aguardando assinatura')).toBeInTheDocument();
  });
});
