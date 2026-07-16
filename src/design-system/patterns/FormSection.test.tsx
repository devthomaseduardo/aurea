import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormActions, FormGroup, FormSection } from './FormSection';

describe('Form patterns (frontend)', () => {
  it('renderiza FormSection com título e conteúdo', () => {
    render(
      <FormSection title="Dados" description="Informações principais">
        <input aria-label="Nome" />
      </FormSection>
    );

    expect(screen.getByText('Dados')).toBeInTheDocument();
    expect(screen.getByText('Informações principais')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('renderiza FormGroup e FormActions', () => {
    render(
      <>
        <FormGroup columns={2}>
          <span>Campo A</span>
          <span>Campo B</span>
        </FormGroup>
        <FormActions>
          <button type="button">Cancelar</button>
          <button type="submit">Salvar</button>
        </FormActions>
      </>
    );

    expect(screen.getByText('Campo A')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });
});
