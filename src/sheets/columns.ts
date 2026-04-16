export interface SheetColumn {
  key: string;
  header: string;
  width?: number;
}

export const SHEET_COLUMNS: SheetColumn[] = [
  { key: 'ticket_id', header: 'Ticket ID', width: 120 },
  { key: 'ticket_link', header: 'Ticket Link', width: 200 },
  { key: 'time_estimate', header: 'Time Estimation', width: 150 },
  { key: 'name', header: 'Task Name', width: 250 },
  { key: 'status', header: 'Status', width: 120 },
  { key: 'assignee', header: 'Assignee', width: 150 },
  { key: 'priority', header: 'Priority', width: 100 },
  { key: 'due_date', header: 'Due Date', width: 120 },
  { key: 'last_updated', header: 'Last Updated', width: 150 },
];

export const SHEET_CONFIG = {
  columns: SHEET_COLUMNS,
  defaultRowHeight: 40,
};
