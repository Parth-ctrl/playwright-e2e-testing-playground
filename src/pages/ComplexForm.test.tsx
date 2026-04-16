import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplexForm } from './ComplexForm';

describe('ComplexForm', () => {
  it('displays Login button text', () => {
    render(<ComplexForm />);
    expect(screen.getByTestId('form-submit')).toHaveTextContent('Login');
  });

  it('submit button is functional', () => {
    render(<ComplexForm />);
    const submitButton = screen.getByTestId('form-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});