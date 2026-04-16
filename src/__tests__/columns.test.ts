import { describe, it, expect } from 'vitest';
import { SHEET_COLUMNS, getColumnIndex, ColumnDefinition } from '../sheets/columns';

describe('SHEET_COLUMNS', () => {
  it('should have correct column order', () => {
    expect(SHEET_COLUMNS[0].key).toBe('id');
    expect(SHEET_COLUMNS[1].key).toBe('ticketId');
    expect(SHEET_COLUMNS[2].key).toBe('ticketLink');
    expect(SHEET_COLUMNS[3].key).toBe('timeEstimate');
  });

  it('should have Time Estimation column after ticketLink', () => {
    const timeEstimateIndex = SHEET_COLUMNS.findIndex(col => col.key === 'timeEstimate');
    const ticketLinkIndex = SHEET_COLUMNS.findIndex(col => col.key === 'ticketLink');
    expect(timeEstimateIndex).toBe(ticketLinkIndex + 1);
  });

  it('should have correct headers', () => {
    expect(SHEET_COLUMNS[3].header).toBe('Time Estimation');
  });
});

describe('getColumnIndex', () => {
  it('should return correct index for key', () => {
    expect(getColumnIndex('id')).toBe(0);
    expect(getColumnIndex('ticketId')).toBe(1);
    expect(getColumnIndex('ticketLink')).toBe(2);
    expect(getColumnIndex('timeEstimate')).toBe(3);
  });

  it('should return -1 for unknown key', () => {
    expect(getColumnIndex('unknown')).toBe(-1);
  });
});