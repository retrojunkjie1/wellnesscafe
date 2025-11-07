import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

test('renders app header', () => {
  render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
  const linkElements = screen.getAllByText(/wellnesscafe/i);
  expect(linkElements.length).toBeGreaterThan(0);
});
