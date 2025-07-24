import { ref, computed, type Ref } from 'vue';

export function useSelection(data: Ref<any[]>, rowKey?: string) {
  const selectedRows = ref<Set<number>>(new Set());
  
  const selectAll = computed({
    get: () => data.value.length > 0 && selectedRows.value.size === data.value.length,
    set: (value: boolean) => {
      if (value) {
        selectedRows.value = new Set(data.value.map((_, index) => index));
      } else {
        selectedRows.value.clear();
      }
    }
  });

  const indeterminate = computed(() => 
    selectedRows.value.size > 0 && selectedRows.value.size < data.value.length
  );

  const selectedData = computed(() => 
    data.value.filter((_, index) => selectedRows.value.has(index))
  );

  function toggleRow(index: number) {
    if (selectedRows.value.has(index)) {
      selectedRows.value.delete(index);
    } else {
      selectedRows.value.add(index);
    }
  }

  function selectRow(index: number) {
    selectedRows.value.add(index);
  }

  function deselectRow(index: number) {
    selectedRows.value.delete(index);
  }

  function clearSelection() {
    selectedRows.value.clear();
  }

  function isSelected(index: number): boolean {
    return selectedRows.value.has(index);
  }

  return {
    selectedRows,
    selectAll,
    indeterminate,
    selectedData,
    toggleRow,
    selectRow,
    deselectRow,
    clearSelection,
    isSelected
  };
} 