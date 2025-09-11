<template>
  <div class="relative">
    <div class="mb-4" :class="sectionClasses">
      <div v-if="actionsConfig?.actions" :class="subSectionClasses">
        <Actions
          :actions="actionsConfig.actions"
          @action="handleAction"
        />
      </div>

      <div class="flex-1" :class="{ 'justify-center': actionsConfig?.actions, [subSectionClasses]: true }">
        <template v-if="enableSelection && selectedRows.size > 0">
          <span class="text-sm text-base-content/70">
            {{ selectedRows.size }} {{ t('datatable.selected') }}
          </span>

          <div :class="subSectionClasses">
            <Actions
              :actions="bulkActions"
              @action="handleBulkAction"
            />
          </div>
        </template>
      </div>

      <div :class="subSectionClasses">
        <Export
          v-if="exportFilename !== false"
          :data="finalData"
          :columns="columns"
          :filename="getExportFilename()"
        />

        <Filters
          v-if="hasFilterableColumns"
          :columns="columns"
          :filters="currentFilters"
          :distinctValues="distinctValues"
          :resetFilters="resetFilters"
          :getLabel="getColumnLabel"
          @update:filters="updateFilters"
        />

        <Search
          :value="search"
          @update="search = $event"
        />
      </div>
    </div>

    <div class="overflow-x-auto relative">
      <table class="table w-full" :class="tableClass">
        <thead>
          <tr>
            <th v-if="enableSelection" class="w-12">
              <CheckBox
                :checked="selectAll"
                :indeterminate="indeterminate"
                @update:checked="selectAll = $event"
              />
            </th>

            <th
              v-for="(col, index) in columns"
              :key="index"
              :class="{ 'cursor-pointer select-none': col.sortable !== false }"
              :aria-sort="getAriaSort(col)"
              @click="col.sortable !== false && handleSort(col.key)"
            >
              <div class="flex items-center gap-2">
                {{ getColumnLabel(col) }}
                <Sort
                  v-if="col.sortable !== false"
                  :sort="currentSort"
                  :column="col.key"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="finalData.length === 0">
            <td :colspan="totalColumns" class="text-center py-8">
              <div class="flex flex-col items-center gap-2">
                <NoResultIcon class="w-8 h-8 text-base-content/60" />
                <span class="text-base-content/70">{{ t('datatable.noResults') }}</span>
              </div>
            </td>
          </tr>

          <tr 
            v-for="(row, i) in finalData" 
            :key="i"
            :class="{ '!bg-base-300': isSelected(i) }"
            @click="enableSelection && toggleRow(i)"
          >
            <td v-if="enableSelection" class="w-12">
              <CheckBox
                :checked="isSelected(i)"
                @update:checked="toggleRow(i)"
                @click.stop
              />
            </td>

            <td v-for="(col, j) in columns" :key="j">
              <slot 
                :name="`cell-${col.key}`" 
                :row="row" 
                :column="col" 
                :value="row[col.key]"
              >
                <span>{{ formatCellValue(row[col.key]) }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4" :class="sectionClasses">
      <Pagination
        :page="page"
        :total-pages="totalPages"
        :per-page="perPage"
        :total-items="totalItems"
        :visible-pages="visiblePages"
        :config="paginationConfig"
        @goto="handlePageChange"
        @update="perPage = $event"
      />
    </div>

    <LoadingOverlay v-if="loading" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, shallowRef } from 'vue';
  import type { ColumnState, PaginationConfig, FinalPaginationConfig, ActionsConfig, SelectionConfig, SortState } from '../types';

  import Actions from './Actions.vue';
  import CheckBox from './CheckBox.vue';
  import Export from './Export.vue';
  import Filters from './Filters.vue';
  import LoadingOverlay from './LoadingOverlay.vue';
  import Pagination from './Pagination.vue';
  import Search from './Search.vue';
  import Sort from './Sort.vue';
  
  import { useApiData } from '../composables/useApiData';
  import { useFilters } from '../composables/useFilters';
  import { useI18n } from '../composables/useI18n';
  import { usePagination } from '../composables/usePagination';
  import { useSearch } from '../composables/useSearch';
  import { useSelection } from '../composables/useSelection';
  import { useSort } from '../composables/useSort';
  import { NoResultIcon } from '../icons';

  const { t } = useI18n();

  const props = withDefaults(defineProps<{
    columns: ColumnState[];
    data: Record<string, any>[] | string;
    paginationConfig?: PaginationConfig;
    tableClass?: string;
    exportFilename?: string | boolean;
    actionsConfig?: ActionsConfig;
    selectionConfig?: SelectionConfig;
    customParameters?: Record<string, any>;
  }>(), {
    tableClass: 'table-zebra',
    paginationConfig: () => ({}),
    exportFilename: true
  });

  const emit = defineEmits<{
    'bulk-action': [action: string, selectedData: Record<string, any>[]];
    'action': [action: string];
  }>();

  const sectionClasses = 'flex flex-col sm:flex-row justify-between items-center gap-4';
  const subSectionClasses = 'flex items-center gap-2';

  // Initialize pagination config with defaults
  const paginationConfig = {
    maxVisiblePages: 5,
    showFirstLast: true,
    showPageInfo: true,
    perPageOptions: [5, 10, 25, 50],
    perPage: 10,
    ...props.paginationConfig
  } as FinalPaginationConfig;

  const search = ref('');
  const perPage = ref(paginationConfig.perPage);
  const apiFilters = ref<Record<string, string[]>>({});
  const apiSort = ref<SortState>({ column: null, ascending: true });

  const isApiMode = computed(() => typeof props.data === 'string');
  const enableSelection = computed(() => !!props.selectionConfig);
  const loading = computed(() => isApiMode.value && apiLoading.value);
  const hasFilterableColumns = computed(() => props.columns.some(col => col.filterable !== false));

  // Static data with shallowRef optimization
  const staticDataRef = shallowRef<Record<string, any>[]>([]);

  // Update static data when props change
  watch(() => props.data, (newData) => {
    if (!isApiMode.value && Array.isArray(newData)) {
      staticDataRef.value = newData;
    }
  }, { immediate: true });

  // Data processing pipeline
  const { searchFilteredData } = useSearch(search, computed(() => isApiMode.value ? [] : staticDataRef.value), props.columns.map(c => c.key));
  const { filters, filteredData, resetFilters: staticResetFilters, getDistinctValues } = useFilters(searchFilteredData, props.columns);
  const { sort: staticSort, sortBy, sortedData } = useSort(filteredData, props.columns);

  const {
    data: apiData, 
    total: apiTotal, 
    loading: apiLoading, 
    distinctValues: apiDistinctValues, 
    fetchData: apiFetchData,
    clearCache: apiClearCache
  } = useApiData(isApiMode.value ? props.data as string : '');

  const currentFilters = computed(() => isApiMode.value ? apiFilters.value : filters);
  const currentSort = computed(() => isApiMode.value ? apiSort.value : staticSort.value);
  const distinctValues = computed(() => isApiMode.value ? apiDistinctValues.value : getDistinctValues());
  const paginationData = computed(() => Array.from({ length: apiTotal.value }, (_, i) => i));

  const { page, setPage, totalPages, visiblePages } = usePagination(isApiMode.value ? paginationData : sortedData, perPage, paginationConfig);

  const finalData = computed(() => {
    if (isApiMode.value) return apiData.value || [];
    if (!sortedData.value) return [];

    const start = (page.value - 1) * perPage.value;
    const end = start + perPage.value;
    return sortedData.value.slice(start, end);
  });

  const totalItems = computed(() => isApiMode.value ? apiTotal.value : sortedData.value.length);
  const totalColumns = computed(() => props.columns.length + (enableSelection.value ? 1 : 0));

  const { selectedRows, selectAll, indeterminate, toggleRow, isSelected, clearSelection } = useSelection(finalData);

  const apiParams = computed(() => ({
    filters: apiFilters.value,
    search: search.value,
    sort: apiSort.value,
    page: page.value,
    perPage: perPage.value,
    customParameters: props.customParameters
  }));

  const bulkActions = computed(() => {
    if (!enableSelection.value) return [];
    
    return [
      ...(props.selectionConfig?.clearSelection === false ? [] : [{ action: 'clear', variant: 'default' as const, tooltip: t('datatable.clearSelection'), icon: 'close' }]),
      ...(props.selectionConfig?.actions || [])
    ];
  });

  watch([apiFilters, search, apiSort, page, perPage], () => {
    if (isApiMode.value) {
      apiFetchData(apiParams.value);
    }
  }, { immediate: true, deep: true });

  watch([perPage, search, currentFilters], () => {
    setPage(1);
  }, { deep: true });

  const getColumnLabel = (col: ColumnState): string => col.label || col.key.charAt(0).toUpperCase() + col.key.slice(1);

  const getAriaSort = (col: ColumnState): 'ascending' | 'descending' | 'none' => {
    const sort = currentSort.value;
    return (col.sortable === false || sort.column !== col.key) ? 'none' : (sort.ascending ? 'ascending' : 'descending');
  }

  const formatCellValue = (value: any, col?: ColumnState): string => value == null ? '' : String(value);

  const getExportFilename = (): string => props.exportFilename === true ? 'table-export' : (props.exportFilename as string);

  const updateFilters = (newFilters: Record<string, string[]>) => {
    if (isApiMode.value) apiFilters.value = { ...newFilters };
    else Object.assign(filters, newFilters);
  }

  const resetFilters = () => {
    if (isApiMode.value) apiFilters.value = {};
    else staticResetFilters();
  }

  const handleSort = (column: string) => {
    if (isApiMode.value) {
      if (apiSort.value.column === column) {
        apiSort.value.ascending = !apiSort.value.ascending;
      } else {
        apiSort.value = { column, ascending: true };
      }
    } else {
      sortBy(column);
    }
  }

  const handlePageChange = (newPage: number) => {
    const validPage = Math.min(Math.max(newPage, 1), totalPages.value);
    setPage(validPage);
  }

  const handleAction = (action: string) => {
    emit('action', action);
  }

  const handleBulkAction = (action: string) => {
    if (action === 'clear') {
      clearSelection();
    } else {
      const selectedData = Array.from(selectedRows.value).map(index => finalData.value[index]);
      emit('bulk-action', action, selectedData);
    }
  }

  const reloadData = () => {
    if (isApiMode.value) {
      apiClearCache();
      apiFetchData(apiParams.value);
    }
  }

  defineExpose({
    reloadData
  });
</script>
