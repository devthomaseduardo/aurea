import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import NavBar from './NavBar';
import { APP_CONFIG } from '@/core/config/app.config';

describe('NavBar (frontend)', () => {
  it('exibe brand e link para o app', () => {
    renderWithProviders(<NavBar />);

    expect(screen.getByText(APP_CONFIG.name)).toBeInTheDocument();
    expect(screen.getAllByText(/Produto/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Comecar agora/i)).toBeInTheDocument();
  });

  it('abre menu mobile e lista links do sistema', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NavBar />);

    await user.click(screen.getByLabelText('Abrir menu'));
    expect(screen.getAllByText('Sobre').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Criar conta/i).length).toBeGreaterThan(0);
  });
});

