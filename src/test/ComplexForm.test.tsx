import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComplexForm } from '../pages/ComplexForm';

describe('ComplexForm', () => {
  it('should display Login text on submit button', () => {
    render(<ComplexForm />);
    const submitButton = screen.getByTestId('form-submit');
    expect(submitButton).toHaveTextContent('Login');
  });

  it('should trigger form submission when clicking Login button', async () => {
    const user = userEvent.setup();
    
    render(<ComplexForm />);
    
    const firstName = screen.getByTestId('form-firstname');
    const lastName = screen.getByTestId('form-lastname');
    const email = screen.getByTestId('form-email');
    const phone = screen.getByTestId('form-phone');
    const country = screen.getByTestId('form-country');
    const jobTitle = screen.getByTestId('form-jobtitle');
    const experience = screen.getByTestId('form-experience-junior');
    const terms = screen.getByTestId('form-terms');
    const submitButton = screen.getByTestId('form-submit');

    await user.type(firstName, 'John');
    await user.type(lastName, 'Doe');
    await user.type(email, 'john@example.com');
    await user.type(phone, '+1234567890');
    await user.selectOptions(country, 'USA');
    await user.type(jobTitle, 'Engineer');
    await user.click(experience);
    const skillButton = screen.getByTestId('form-skill-javascript');
    await user.click(skillButton);
    await user.click(terms);

    await user.click(submitButton);

    const loadingButton = await screen.findByTestId('form-submit');
    expect(loadingButton).toHaveTextContent('Loading...');
  });
});