import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import NavBar from './NavBar';
import { APP_CONFIG } from '@/core/config/app.config';

describe('NavBar (frontend)', () => {
  it('exibe brand e link para o app', () => {
    renderWithProviders(<NavBar />);

    expect(screen.getByAltText(new RegExp(`${APP_CONFIG.name} logo`, 'i'))).toBeInTheDocument();
    expect(screen.getAllByText(/Consultar OS/i).length).toBeGreaterThan(0);
  });

  it('abre menu mobile e lista links do sistema', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NavBar />);

    await user.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getAllByText('Consultar OS').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nossa Bancada/i).length).toBeGreaterThan(0);
  });
});
