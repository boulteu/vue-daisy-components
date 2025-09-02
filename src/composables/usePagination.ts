import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { FinalPaginationConfig } from '../types';

export const usePagination = <T>(
  data: ComputedRef<T[]>,
  perPage: Ref<number>,
  config: FinalPaginationConfig
) => {
  const maxVisiblePages = typeof config.maxVisiblePages === 'number' ? config.maxVisiblePages : 5;
  const page = ref(1);

  const totalPages = computed(() => Math.ceil(data.value.length / perPage.value));

  const paginatedData = computed(() => {
    const start = (page.value - 1) * perPage.value;
    return data.value.slice(start, start + perPage.value);
  });

  const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    
    if (total <= maxVisiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, current - halfVisible);
    let end = Math.min(total, start + maxVisiblePages - 1);
    
    if (end === total) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  const setPage = (newPage: number) => {
    page.value = Math.min(Math.max(newPage, 1), totalPages.value);
  }

  return { 
    page,
    totalPages, 
    paginatedData, 
    visiblePages,
    setPage
  };
}
