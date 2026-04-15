import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplexForm } from '../pages/ComplexForm';

describe('ComplexForm', () => {
  it('should display "Login" on the submit button', () => {
    render(<ComplexForm />);
    expect(screen.getByTestId('form-submit')).toHaveTextContent('Login');
  });
});