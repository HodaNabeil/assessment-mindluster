export type ColumnId = 'backlog' | 'in_progress' | 'review' | 'done';

export interface Column {
  id: ColumnId;
  label: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  column: ColumnId;
  createdAt: string;
}

export const COLUMNS: Column[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];
