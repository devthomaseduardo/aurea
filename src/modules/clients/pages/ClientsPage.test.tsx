import { beforeEach, describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import ClientsPage from './ClientsPage';

describe('ClientsPage (frontend)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lista clientes seed e permite buscar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClientsPage />);
    await waitFor(() => {
      expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Novo cliente/i })).toBeInTheDocument();
    const search = screen.getByPlaceholderText(/Buscar por nome/i);
    await user.type(search, 'Bruno');
    await waitFor(() => {
      expect(screen.getByText('Bruno Lima')).toBeInTheDocument();
      expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument();
    });
  });
});
