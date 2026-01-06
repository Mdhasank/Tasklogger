import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TaskLogger header', () => {
  render(<App />);
  const headerElement = screen.getByText(/TaskLogger/i);
  expect(headerElement).toBeInTheDocument();
});
