import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DollarSign } from 'lucide-react';
import { MetricCard } from './MetricCard';

describe('MetricCard (frontend)', () => {
  it('renderiza label, valor e hint', () => {
    render(
      <MetricCard
        label="Receita"
        value="R$ 12.000"
        hint="últimos 30 dias"
        icon={DollarSign}
      />
    );

    expect(screen.getByText('Receita')).toBeInTheDocument();
    expect(screen.getByText('R$ 12.000')).toBeInTheDocument();
    expect(screen.getByText('últimos 30 dias')).toBeInTheDocument();
  });

  it('exibe tendência positiva', () => {
    render(
      <MetricCard label="Lucro" value="R$ 8.000" trend={{ value: 12, label: 'vs mês' }} />
    );

    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('vs mês')).toBeInTheDocument();
  });

  it('exibe tendência negativa', () => {
    render(<MetricCard label="Churn" value="3%" trend={{ value: -5 }} />);
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });
});
