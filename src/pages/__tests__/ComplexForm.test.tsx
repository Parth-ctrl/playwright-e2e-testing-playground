import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ComplexForm } from '../ComplexForm';

describe('ComplexForm', () => {
  beforeEach(() => {
    render(<ComplexForm />);
  });

  it('should render login button text', () => {
    const button = screen.getByTestId('form-submit');
    expect(button).toHaveTextContent('Login');
  });

  it('should have submit button present', () => {
    const button = screen.getByTestId('form-submit');
    expect(button).toBeInTheDocument();
  });
});
