import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import NavBar from './NavBar';
import { ROUTES } from '@/core/config/app.config';

describe('NavBar (frontend)', () => {
  it('exibe brand e link para o app', () => {
    renderWithProviders(<NavBar />);

    expect(screen.getByText('Aurea')).toBeInTheDocument();
    expect(screen.getByAltText(/Aurea logo/i)).toBeInTheDocument();

    const enter = screen.getAllByRole('link', { name: /Acessar conta/i })[0];
    expect(enter).toHaveAttribute('href', ROUTES.app.dashboard);
  });

  it('abre menu mobile e lista links enterprise', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NavBar />);

    await user.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getAllByText('Plataforma').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Governança').length).toBeGreaterThan(0);
  });
});
