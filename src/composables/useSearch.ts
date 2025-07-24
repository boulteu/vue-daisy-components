import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';

export function useSearch(
  searchQuery: Ref<string>,
  data: ComputedRef<any[]>,
  searchableColumns: string[]
) {
  const debouncedSearch = ref('');
  let debounceTimer: NodeJS.Timeout | null = null;

  // Debounce the search input
  watch(searchQuery, (newValue) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedSearch.value = newValue;
    }, 300); // 300ms delay
  }, { immediate: true });

  const filteredData = computed(() => {
    if (!debouncedSearch.value.trim()) return data.value;
    
    const searchTerm = debouncedSearch.value.toLowerCase();
    return data.value.filter(row => {
      return searchableColumns.some(col => {
        const value = row[col];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm);
      });
    });
  });

  return { filteredData };
}
