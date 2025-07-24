import { ref, computed, type ComputedRef, type Ref } from 'vue';
import type { PaginationConfig } from '../types';

export function usePagination<T>(
  data: ComputedRef<T[]>, 
  perPage: Ref<number>,
  config: PaginationConfig = {}
) {
  const { maxVisiblePages = 7, showFirstLast = true, showPageInfo = true } = config;
  const page = ref(1);

  const totalPages = computed(() => Math.ceil(data.value.length / perPage.value));

  const paginatedData = computed(() => {
    const start = (page.value - 1) * perPage.value;
    return data.value.slice(start, start + perPage.value);
  });

  // Smart pagination - only show relevant pages
  const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = page.value;
    
    if (total <= maxVisiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, current - halfVisible);
    let end = Math.min(total, start + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (end === total) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  function setPage(newPage: number) {
    page.value = Math.min(Math.max(newPage, 1), totalPages.value);
  }

  function nextPage() {
    if (page.value < totalPages.value) {
      setPage(page.value + 1);
    }
  }

  function prevPage() {
    if (page.value > 1) {
      setPage(page.value - 1);
    }
  }

  function firstPage() {
    setPage(1);
  }

  function lastPage() {
    setPage(totalPages.value);
  }

  return { 
    page, 
    perPage, 
    totalPages, 
    paginatedData, 
    visiblePages,
    setPage, 
    nextPage, 
    prevPage, 
    firstPage, 
    lastPage 
  };
}
