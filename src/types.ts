// Global types for vue-daisy-table

export interface ColumnState {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'string' | 'number' | 'date' | 'boolean';
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationConfig {
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showPageInfo?: boolean;
}

export interface SortState {
  column: string | null;
  ascending: boolean;
}

export interface SortConfig {
  column: string;
  type?: 'string' | 'number' | 'date';
  customSort?: (a: any, b: any) => number;
}

export interface Action {
  label?: string;
  action: string;
  variant?: 'default' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'outline';
  icon?: any;
  disabled?: boolean;
  tooltip?: string;
}

export interface SelectionState {
  selectedRows: Set<number>;
  selectAll: boolean;
  indeterminate: boolean;
}

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string;
  dateFormat?: string;
  numberFormat?: string;
} 