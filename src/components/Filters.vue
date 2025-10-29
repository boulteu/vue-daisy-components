<template>
  <div class="tooltip tooltip-bottom" :data-tip="t('filters.filterData')">
    <button class="btn btn-sm" @click="showFilter = (true as any)" :aria-label="t('filters.filterData')">
      <FilterIcon class="w-3 h-3" />
      <span v-if="(activeFiltersCount as any) > 0" class="badge badge-sm ml-1 text-base-300 bg-base-content border border-base-300">
        {{ activeFiltersCount }}
      </span>
    </button>
  </div>

  <dialog class="modal" :open="(showFilter as any)" @click.self="showFilter = (false as any)">
    <form method="dialog" class="modal-box max-w-4xl max-h-[80vh] overflow-auto relative">
      <button
        type="button"
        class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
        @click="showFilter = (false as any)"
        :title="t('filters.close')"
        :aria-label="t('filters.close')"
      >
        <CloseIcon class="w-4 h-4" />
      </button>
      
      <h3 class="font-bold text-lg mb-4 pr-12">{{ t('filters.title') }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="col in (filterableColumns as any)" :key="col.key" class="space-y-2">
          <label class="label font-semibold mb-1">
            {{ getLabel(col) }}
          </label>
          
          <MultiSelect
            :model-value="getFilterValue(col.key)"
            :options="distinctValues[col.key] || []"
            :placeholder="`${t('filters.select')} ${getLabel(col)}...`"
            @update:model-value="updateFilter(col.key, $event)"
          />
        </div>
      </div>

      <div class="modal-action mt-6">
        <button type="button" class="btn btn-sm" @click="resetFilters" :aria-label="t('filters.resetAll')">{{ t('filters.resetAll') }}</button>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { CloseIcon, FilterIcon } from '../icons';
  import type { ColumnState } from '../types';
  import MultiSelect from './MultiSelect.vue';
  import { useI18n } from '../composables/useI18n';

  const { t } = useI18n();

  const props = defineProps<{
    columns: ColumnState[];
    filters: Record<string, string[]>;
    distinctValues: Record<string, string[]>;
    resetFilters: () => void;
    getLabel: (column: ColumnState) => string;
  }>();

  const emit = defineEmits<{
    'update:filters': [filters: Record<string, string[]>];
  }>();

  const showFilter = ref(false);

  const filterableColumns = computed(() => 
    props.columns.filter(col => col.filterable !== false)
  );

  const getFilterValue = (colKey: string): string[] => props.filters[colKey] || [];

  const updateFilter = (colKey: string, selectedOptions: string[]) => {
    const newFilters = { ...props.filters };
    newFilters[colKey] = selectedOptions;
    emit('update:filters', newFilters);
  }

  const activeFiltersCount = computed(() => {
    let count = 0;
    Object.values(props.filters).forEach(filter => {
      if (filter && filter.length > 0) count++;
    });
    return count;
  });
</script>
