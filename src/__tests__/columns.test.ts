import { describe, it, expect } from 'vitest';
import { SHEET_COLUMNS } from '../sheets/columns';

describe('SHEET_COLUMNS', () => {
  it('should have Time Estimation column', () => {
    const timeEstimateColumn = SHEET_COLUMNS.find(col => col.key === 'time_estimate');
    expect(timeEstimateColumn).toBeDefined();
    expect(timeEstimateColumn?.header).toBe('Time Estimation');
  });

  it('should have Time Estimation column after ticket_id and ticket_link', () => {
    const ticketIdIndex = SHEET_COLUMNS.findIndex(col => col.key === 'ticket_id');
    const ticketLinkIndex = SHEET_COLUMNS.findIndex(col => col.key === 'ticket_link');
    const timeEstimateIndex = SHEET_COLUMNS.findIndex(col => col.key === 'time_estimate');
    
    expect(timeEstimateIndex).toBeGreaterThan(ticketIdIndex);
    expect(timeEstimateIndex).toBeGreaterThan(ticketLinkIndex);
  });

  it('should have all required columns', () => {
    const requiredKeys = ['ticket_id', 'ticket_link', 'time_estimate', 'name', 'status', 'assignee', 'priority', 'due_date', 'last_updated'];
    
    requiredKeys.forEach(key => {
      expect(SHEET_COLUMNS.some(col => col.key === key)).toBe(true);
    });
  });
});
