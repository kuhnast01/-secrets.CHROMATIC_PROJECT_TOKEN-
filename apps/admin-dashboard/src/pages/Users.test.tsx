
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import Users from './Users';

describe('Users Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders User Management header', () => {
    render(<Users />);
    expect(screen.getByRole('heading', { name: /user management/i })).toBeInTheDocument();
  });

  it('shows Add User dialog when Add User button is clicked', () => {
    render(<Users />);
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });


  it('closes Add User dialog when Cancel is clicked', async () => {
    render(<Users />);
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });

  it('allows typing in all form fields', () => {
    render(<Users />);
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));
    const username = screen.getByLabelText(/username/i);
    const password = screen.getByLabelText(/password/i);
    const role = screen.getByLabelText(/role/i);
    fireEvent.change(username, { target: { value: 'testuser' } });
    fireEvent.change(password, { target: { value: 'secret' } });
    fireEvent.change(role, { target: { value: 'admin' } });
    expect(username).toHaveValue('testuser');
    expect(password).toHaveValue('secret');
    expect(role).toHaveValue('admin');
  });


  it('closes dialog when Add is clicked', async () => {
    render(<Users />);
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });

  it('shows Export Users button and triggers alert on click', () => {
    window.alert = jest.fn();
    render(<Users />);
    const exportBtn = screen.getByRole('button', { name: /export users/i });
    expect(exportBtn).toBeInTheDocument();
    fireEvent.click(exportBtn);
    expect(window.alert).toHaveBeenCalledWith('Export Users feature coming soon!');
  });

  it('dialog has autofocus on Username field', () => {
    render(<Users />);
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));
    const username = screen.getByLabelText(/username/i);
    expect(document.activeElement).toBe(username);
  });

  // Edge case: rapid open/close
  it('handles rapid open and close of Add User dialog', () => {
    render(<Users />);
    const addBtn = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(addBtn);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    fireEvent.click(addBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
