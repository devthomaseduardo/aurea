import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WizardStepper } from './WizardStepper';

describe('WizardStepper', () => {
  it('renderiza as 6 etapas do wizard', () => {
    render(<WizardStepper current={0} />);
    expect(screen.getByText('Informações')).toBeInTheDocument();
    expect(screen.getByText('Escopo')).toBeInTheDocument();
    expect(screen.getByText('Resumo')).toBeInTheDocument();
  });

  it('permite clicar em etapas anteriores', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(<WizardStepper current={2} onStepClick={onStepClick} />);
    await user.click(screen.getByText('Informações'));
    expect(onStepClick).toHaveBeenCalled();
  });
});
