import { describe, it, expect } from 'vitest';
import { convertMillisecondsToReadable } from '../types';

describe('convertMillisecondsToReadable', () => {
  it('should return empty string for null', () => {
    expect(convertMillisecondsToReadable(null)).toBe('');
  });

  it('should return empty string for 0', () => {
    expect(convertMillisecondsToReadable(0)).toBe('');
  });

  it('should convert minutes only', () => {
    expect(convertMillisecondsToReadable(1800000)).toBe('30m');
  });

  it('should convert hours only', () => {
    expect(convertMillisecondsToReadable(3600000)).toBe('1h');
  });

  it('should convert hours and minutes', () => {
    expect(convertMillisecondsToReadable(5400000)).toBe('1h 30m');
  });

  it('should handle large values', () => {
    expect(convertMillisecondsToReadable(7200000)).toBe('2h');
    expect(convertMillisecondsToReadable(9000000)).toBe('2h 30m');
  });
});