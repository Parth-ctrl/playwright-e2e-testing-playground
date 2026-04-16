export interface ColumnDefinition {
  key: string;
  header: string;
  width?: number;
}

export const SHEET_COLUMNS: ColumnDefinition[] = [
  { key: 'id', header: 'ID', width: 30 },
  { key: 'ticketId', header: 'Ticket ID', width: 50 },
  { key: 'ticketLink', header: 'Ticket Link', width: 100 },
  { key: 'timeEstimate', header: 'Time Estimation', width: 60 },
];

export function getColumnIndex(key: string): number {
  return SHEET_COLUMNS.findIndex(col => col.key === key);
}