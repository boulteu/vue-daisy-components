import { reactive, computed, type ComputedRef } from 'vue';
import type { ColumnState } from '../types';

export function useFilters(dataGetter: () => any[], columns: ColumnState[]) {
  const filters = reactive<Record<string, string[]>>({});

  // Initialize filters for each column
  columns.forEach(col => {
    if (!(col.key in filters)) {
      filters[col.key] = [];
    }
  });

  function resetFilters() {
    for (const key in filters) {
      filters[key] = [];
    }
  }

  const filtered = computed(() => {
    const data = dataGetter();
    
    // Check if we have active filters
    const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);
    
    // If no active filters, return original data
    if (!hasActiveFilters) {
      return data;
    }
    
    // Apply filters
    const result = data.filter(row => {
      for (const col in filters) {
        const selected = filters[col];
        if (selected.length === 0) continue;
        
        const val = String(row[col] ?? '');
        if (!selected.includes(val)) return false;
      }
      return true;
    });
    
    return result;
  });

  return {
    filters,
    filtered,
    resetFilters,
  };
}
