import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplexForm } from '../pages/ComplexForm';

describe('ComplexForm', () => {
  it('should display Login button text', () => {
    render(<ComplexForm />);
    const loginButton = screen.getByTestId('form-submit');
    expect(loginButton).toHaveTextContent('Login');
  });
});
