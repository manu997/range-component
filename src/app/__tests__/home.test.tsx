import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

test('Home', () => {
  render(<Home />);
  expect(screen.getByRole('link', { name: 'Exercice 1' })).toBeDefined();
  expect(screen.getByRole('link', { name: 'Exercice 2' })).toBeDefined();
});
