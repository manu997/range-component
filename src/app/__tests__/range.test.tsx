import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Range } from '../../components/Range';

afterEach(() => {
  cleanup();
});

const changeMinInputValue = (newValue: string) => {
  const minInput = screen.getByTestId('min-input');
  fireEvent.change(minInput, { target: { value: newValue } });
  fireEvent.blur(minInput);
};

const changeMaxInputValue = (value: string) => {
  const maxInput = screen.getByTestId('max-input');
  fireEvent.change(maxInput, { target: { value } });
  fireEvent.blur(maxInput);
};

describe('MinMax', () => {
  beforeEach(() => {
    render(<Range defaultMax={100} defaultMin={0} />);
  });

  test('Render the component with min and max values', () => {
    expect(screen.getByTestId('max-bullet')).toBeDefined();
    expect(screen.getByTestId('min-bullet')).toBeDefined();
    expect(screen.getByTestId('min-input')).toHaveProperty('value', '0');
    expect(screen.getByTestId('max-input')).toHaveProperty('value', '100');
  });

  test('Change bullet position if input changes and blur', () => {
    changeMinInputValue('50');
    const minBullet = screen.getByTestId('min-bullet');
    expect(
      getComputedStyle(minBullet).getPropertyValue('--bulletPosition')
    ).toBe('50%');
  });

  test('Min and max value cannot cross', () => {
    changeMinInputValue('50');
    changeMaxInputValue('25');
    const minBullet = screen.getByTestId('min-bullet');
    const maxBullet = screen.getByTestId('max-bullet');
    expect(
      getComputedStyle(minBullet).getPropertyValue('--bulletPosition')
    ).toBe('50%');
    expect(
      getComputedStyle(maxBullet).getPropertyValue('--bulletPosition')
    ).toBe('51%');
  });
});

describe('FixedValues', () => {
  const fixedValues = [1, 2, 3];

  beforeEach(() => {
    render(<Range fixedValues={fixedValues} />);
  });

  test('Render the component with fixed values', () => {
    expect(screen.getByTestId('max-bullet')).toBeDefined();
    expect(screen.getByTestId('min-bullet')).toBeDefined();
    fixedValues.forEach((value) => {
      expect(screen.getByTestId(`fixed-bullet-${value}`)).toBeDefined();
    });
    expect(screen.getByTestId('min-input')).toHaveProperty('value', '1');
    expect(screen.getByTestId('max-input')).toHaveProperty('value', '3');
  });

  test('Disable inputs if fixedValues exists', () => {
    expect(screen.getByTestId('min-input')).toHaveProperty('disabled', true);
    expect(screen.getByTestId('max-input')).toHaveProperty('disabled', true);
  });
});
