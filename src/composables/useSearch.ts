import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';

export const useSearch = (
  searchQuery: Ref<string>,
  data: ComputedRef<any[]>,
  searchableColumns: string[]
) => {
  const debouncedSearch = ref('');
  let debounceTimer: NodeJS.Timeout | null = null;

  watch(searchQuery, (newValue) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    if (!newValue.trim()) {
      debouncedSearch.value = newValue;
    } else {
      debounceTimer = setTimeout(() => {
        debouncedSearch.value = newValue;
      }, 300);
    }
  }, { immediate: true });

  const searchFilteredData = computed(() => {
    if (!debouncedSearch.value.trim()) {
      return data.value;
    }
    
    const searchTerm = debouncedSearch.value.toLowerCase();
    const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
    
    if (searchWords.length === 0) {
      return data.value;
    }
    
    return data.value.filter(row => {
      return searchWords.every(word => {
        return searchableColumns.some(col => {
          const value = row[col];
          if (value == null) return false;
          return String(value).toLowerCase().includes(word);
        });
      });
    });
  });

  return { searchFilteredData };
}
