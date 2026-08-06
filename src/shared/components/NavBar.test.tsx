import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import NavBar from './NavBar';
import { ROUTES, APP_CONFIG } from '@/core/config/app.config';

describe('NavBar (frontend)', () => {
  it('exibe brand e link para o app', () => {
    renderWithProviders(<NavBar />);

    expect(screen.getByAltText(new RegExp(`${APP_CONFIG.name} logo`, 'i'))).toBeInTheDocument();

    const enter = screen.getAllByRole('link', { name: /Painel do Técnico/i })[0];
    expect(enter).toHaveAttribute('href', ROUTES.auth.login);
  });

  it('abre menu mobile e lista links do sistema', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NavBar />);

    await user.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getAllByText('Consultar OS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Garantia 90 Dias').length).toBeGreaterThan(0);
  });
});
