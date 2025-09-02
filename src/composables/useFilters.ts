import { ref, reactive, computed, type Ref } from 'vue';
import type { ColumnState } from '../types';

export const useFilters = (data: Ref<any[]>, columns: ColumnState[]) => {
  const filters = reactive<Record<string, string[]>>({});
  
  const distinctValuesCache = new Map<string, any[]>();
  const lastDataHash = ref<string>('');

  columns.forEach(col => {
    if (col.filterable !== false && !(col.key in filters)) {
      filters[col.key] = [];
    }
  });

  const resetFilters = () => {
    for (const key in filters) {
      filters[key] = [];
    }
  }

  const getDistinctValues = (): Record<string, any[]> => {
    const currentHash = JSON.stringify(data.value.map(row => 
      columns.map(col => row[col.key])
    ));
    
    if (currentHash === lastDataHash.value && distinctValuesCache.size > 0) {
      const cachedValues: Record<string, any[]> = {};
      columns.forEach(col => {
        if (col.filterable !== false) {
          cachedValues[col.key] = distinctValuesCache.get(col.key) || [];
        }
      });
      return cachedValues;
    }
    
    const values: Record<string, any[]> = {};
    columns.forEach(col => {
      if (col.filterable !== false) {
        const uniqueValues = Array.from(new Set(data.value.map(row => row[col.key])));
        values[col.key] = uniqueValues;
        distinctValuesCache.set(col.key, uniqueValues);
      }
    });
    
    lastDataHash.value = currentHash;
    return values;
  }

  const filteredData = computed(() => {
    const hasActiveFilters = Object.values(filters).some(filter => filter.length > 0);
    
    if (!hasActiveFilters) {
      return data.value;
    }
    
    const result = data.value.filter(row => {
      for (const col in filters) {
        const column = columns.find(c => c.key === col);
        if (column && column.filterable === false) continue;
        
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
    filteredData,
    resetFilters,
    getDistinctValues,
  };
}
