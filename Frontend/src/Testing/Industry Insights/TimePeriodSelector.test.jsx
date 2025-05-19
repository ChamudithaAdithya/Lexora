import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Import after setup
import { TimePeriodSelector, getWeeksInMonth } from '../../pages/Functions/Industry Insights/JobTrendsPage';

describe('TimePeriodSelector', () => {
  beforeEach(() => {
    render(<TimePeriodSelector />);
  });

  test('clicking Yearly button opens dropdown showing years only', () => {
    // Click Yearly button
    fireEvent.click(screen.getByRole('button', { name: /yearly/i }));

    // Dropdown opens and shows years
    expect(screen.getByText(/2023/)).toBeVisible();
    expect(screen.getByText(/2024/)).toBeVisible();

    // Should NOT show months or weeks in Yearly mode
    expect(screen.queryByText(/Jan/)).toBeNull();
    expect(screen.queryByText(/Week 1/)).toBeNull();
  });

  test('clicking Monthly button opens dropdown showing years and months', () => {
    // Click Monthly button
    fireEvent.click(screen.getByRole('button', { name: /monthly/i }));

    // Dropdown opens and shows years
    expect(screen.getByText(/2023/)).toBeVisible();
    expect(screen.getByText(/2024/)).toBeVisible();

    // Should show months
    expect(screen.getByText(/Jan/)).toBeVisible();
    expect(screen.getByText(/Feb/)).toBeVisible();

    // Should NOT show weeks
    expect(screen.queryByText(/Week 1/)).toBeNull();
  });

  test('clicking Weekly button opens dropdown showing years, months, and weeks', () => {
    // Click Weekly button
    fireEvent.click(screen.getByRole('button', { name: /weekly/i }));

    // Dropdown opens and shows years
    expect(screen.getByText(/2023/)).toBeVisible();
    expect(screen.getByText(/2024/)).toBeVisible();

    // Shows months
    expect(screen.getByText(/Jan/)).toBeVisible();

    // Shows weeks
    expect(screen.getByText(/Week 1/)).toBeVisible();
    expect(screen.getByText(/Week 2/)).toBeVisible();
  });

  test('clicking Apply button closes dropdown', () => {
    // Open dropdown by clicking Yearly (or any mode)
    fireEvent.click(screen.getByRole('button', { name: /yearly/i }));

    // Apply button should be visible
    const applyButton = screen.getByRole('button', { name: /apply/i });
    expect(applyButton).toBeVisible();

    // Click Apply button
    fireEvent.click(applyButton);

    // Dropdown should close (years no longer visible)
    expect(screen.queryByText(/2023/)).toBeNull();
  });
});