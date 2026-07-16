import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader (frontend)', () => {
  it('renderiza título e descrição', () => {
    render(
      <PageHeader title="Clientes" description="Gerencie sua base comercial" />
    );

    expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getByText('Gerencie sua base comercial')).toBeInTheDocument();
  });

  it('renderiza breadcrumbs e ações', () => {
    render(
      <PageHeader
        title="Detalhe"
        breadcrumbs={<nav aria-label="breadcrumb">Home / Detalhe</nav>}
        actions={<button type="button">Salvar</button>}
      />
    );

    expect(screen.getByLabelText('breadcrumb')).toHaveTextContent('Home / Detalhe');
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });
});
