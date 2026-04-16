import { describe, it, expect } from 'vitest';
import { convertMillisecondsToDisplay } from '../integrations/clickup/client';

describe('convertMillisecondsToDisplay', () => {
  it('should return null for null input', () => {
    expect(convertMillisecondsToDisplay(null)).toBeNull();
  });

  it('should return null for 0 milliseconds', () => {
    expect(convertMillisecondsToDisplay(0)).toBeNull();
  });

  it('should convert milliseconds to hours and minutes', () => {
    expect(convertMillisecondsToDisplay(5400000)).toBe('1h 30m');
  });

  it('should convert milliseconds to only hours when no minutes', () => {
    expect(convertMillisecondsToDisplay(7200000)).toBe('2h');
  });

  it('should convert milliseconds to only minutes when less than an hour', () => {
    expect(convertMillisecondsToDisplay(1800000)).toBe('30m');
  });

  it('should handle large values correctly', () => {
    expect(convertMillisecondsToDisplay(36000000)).toBe('10h');
  });
});
