import { ref, computed, type ComputedRef } from 'vue';
import type { FinalPaginationConfig } from '../types';

export const usePagination = <T>(
  data: ComputedRef<T[]>, 
  config: FinalPaginationConfig
) => {
  const maxVisiblePages = typeof config.maxVisiblePages === 'number' ? config.maxVisiblePages : 5;
  const page = ref(1);
  const perPageRef = ref(config.perPage);

  const totalPages = computed(() => Math.ceil(data.value.length / perPageRef.value));

  const paginatedData = computed(() => {
    const start = (page.value - 1) * perPageRef.value;
    return data.value.slice(start, start + perPageRef.value);
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

  const nextPage = () => {
    if (page.value < totalPages.value) {
      setPage(page.value + 1);
    }
  }

  const prevPage = () => {
    if (page.value > 1) {
      setPage(page.value - 1);
    }
  }

  const firstPage = () => {
    setPage(1);
  }

  const lastPage = () => {
    setPage(totalPages.value);
  }

  const updatePerPage = (newPerPage: number) => {
    perPageRef.value = newPerPage;
  }

  return { 
    page, 
    perPage: perPageRef, 
    totalPages, 
    paginatedData, 
    visiblePages,
    setPage, 
    nextPage, 
    prevPage, 
    firstPage, 
    lastPage,
    updatePerPage
  };
}
