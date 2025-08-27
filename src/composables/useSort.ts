import { ref, computed, type Ref } from 'vue';
import type { SortState, ColumnState } from '../types';

export const useSort = (filtered: Ref<any[]>, columns: ColumnState[]) => {
  const sort = ref<SortState>({
    column: null,
    ascending: true,
  });

  let lastSortHash = '';
  let memoizedSorted: any[] = [];

  const sortBy = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (column && column.sortable === false) return;
    
    if (sort.value.column === key) {
      sort.value.ascending = !sort.value.ascending;
    } else {
      sort.value.column = key;
      sort.value.ascending = true;
    }
  }

  const sortedData = computed(() => {
    if (!sort.value.column) return filtered.value;
    
    const sortHash = `${sort.value.column}-${sort.value.ascending}-${filtered.value.length}`;
    
    if (sortHash === lastSortHash && memoizedSorted.length > 0) {
      return memoizedSorted;
    }
    
    const result = [...filtered.value].sort((a, b) => {
      const valA = a[sort.value.column!];
      const valB = b[sort.value.column!];
      
      if (valA == null && valB == null) return 0;
      if (valA == null) return sort.value.ascending ? -1 : 1;
      if (valB == null) return sort.value.ascending ? 1 : -1;
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sort.value.ascending ? valA - valB : valB - valA;
      }
      
      if (valA instanceof Date && valB instanceof Date) {
        return sort.value.ascending ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }
      
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      
      if (strA === strB) return 0;
      const comparison = strA > strB ? 1 : -1;
      return sort.value.ascending ? comparison : -comparison;
    });
    
    lastSortHash = sortHash;
    memoizedSorted = result;
    
    return result;
  });

  return { sort, sortBy, sortedData };
}
