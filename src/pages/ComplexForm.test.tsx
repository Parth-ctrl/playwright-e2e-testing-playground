import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplexForm } from './ComplexForm';

describe('ComplexForm', () => {
  it('renders submit button with "Login" text', () => {
    render(<ComplexForm />);
    const submitButton = screen.getByTestId('form-submit');
    expect(submitButton).toHaveTextContent('Login');
  });
});