import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

// Mock AuthContext
const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock image imports
vi.mock('../assets/Images/TCC_bg.jpg', () => ({ default: 'tcc-bg.jpg' }));
vi.mock('../assets/SVG/logo.svg', () => ({ default: 'logo.svg' }));
vi.mock('../assets/SVG/apple.svg', () => ({ default: 'apple.svg' }));
vi.mock('../assets/SVG/shopify.svg', () => ({ default: 'shopify.svg' }));
vi.mock('../assets/SVG/google.svg', () => ({ default: 'google.svg' }));
vi.mock('../assets/SVG/password-hidden.svg', () => ({ default: 'eye-off.svg' }));

// Mock react-icons
vi.mock('react-icons/fi', () => ({
  FiEye: () => <span data-testid="eye-icon">eye</span>,
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />);

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('allows typing in email and password fields', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('admin@test.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls login on form submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({});

    render(<Login />);

    await user.type(screen.getByLabelText('Email'), 'admin@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password123');
    });
  });

  it('displays error message on login failure', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce({
      message: 'Invalid credentials',
      errors: {},
    });

    render(<Login />);

    await user.type(screen.getByLabelText('Email'), 'wrong@test.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpass');
    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('displays field-level validation errors', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce({
      message: 'Validation failed',
      errors: { email: ['The email field is required.'] },
    });

    render(<Login />);

    await user.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('The email field is required.')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = passwordInput.parentElement.querySelector('button');
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('has a link to the signup page', () => {
    render(<Login />);

    const signUpLink = screen.getByText('Sign up');
    expect(signUpLink).toHaveAttribute('href', '/signup');
  });
});
