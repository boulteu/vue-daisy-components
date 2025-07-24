<template>
  <div class="overflow-x-auto">
    <!-- Header Controls -->
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <!-- Bulk Actions (Left) -->
      <BulkActions
        v-if="enableSelection"
        :selected-count="selectedData.length"
        :actions="bulkActions"
        @action="handleBulkAction"
      />

      <!-- Controls (Right) - Always on the right -->
      <div class="flex items-center gap-2 ml-auto">
        <Export
          :data="paginatedData"
          :columns="columns"
          :filename="exportFilename"
        />

        <Filters
          :columns="columns"
          :filters="filters"
          :distinctValues="distinctValues"
          :resetFilters="resetFilters"
          @update:filters="updateFilters"
        />

        <Search
          :value="search"
          @update="search = $event"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="relative">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <!-- Selection Column -->
            <th v-if="enableSelection" class="w-12">
              <CheckBox
                :checked="selectAll"
                :indeterminate="indeterminate"
                @update:checked="selectAll = $event"
              />
            </th>

            <!-- Data Columns -->
            <th
              v-for="(col, index) in columns"
              :key="index"
              class="cursor-pointer select-none"
              :aria-sort="sort.column === col.key ? (sort.ascending ? 'ascending' : 'descending') : 'none'"
              @click="sortBy(col.key)"
            >
              <div class="flex items-center gap-2">
                {{ col.label }}
                <Sort :sort="sort" :column="col.key" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="totalColumns" class="text-center py-8">
              <div class="flex flex-col items-center gap-2">
                        <NoResultIcon class="w-8 h-8 text-base-content/60" />
        <span class="text-base-content/70">No results found</span>
              </div>
            </td>
          </tr>
          <tr 
            v-for="(row, i) in paginatedData" 
            :key="i"
            :class="{ 'bg-base-200': isSelected(i) }"
            @click="enableSelection && toggleRow(i)"
          >
            <!-- Selection Checkbox -->
            <td v-if="enableSelection" class="w-12">
              <CheckBox
                :checked="isSelected(i)"
                @update:checked="toggleRow(i)"
                @click.stop
              />
            </td>

            <!-- Data Cells -->
            <td 
              v-for="(col, j) in columns" 
              :key="j"
              class="cursor-pointer"
            >
              <slot 
                :name="`cell-${col.key}`" 
                :row="row" 
                :column="col" 
                :value="row[col.key]"
              >
                {{ formatCellValue(row[col.key], col) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-base-100/50 flex items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-4">
      <Pagination
        :page="page"
        :total-pages="totalPages"
        :per-page="perPage"
        :total-items="sortedData.length"
        :visible-pages="visiblePages"
        :show-first-last="paginationConfig.showFirstLast"
        :show-page-info="paginationConfig.showPageInfo"
        @goto="setPage"
        @update="perPage = $event"
        @next="nextPage"
        @prev="prevPage"
        @first="firstPage"
        @last="lastPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { ColumnState, PaginationConfig } from '../types';

  import BulkActions from './BulkActions.vue';
  import CheckBox from './CheckBox.vue';
  import Export from './Export.vue';
  import Filters from './Filters.vue';
  import Pagination from './Pagination.vue';
  import Search from './Search.vue';
  import Sort from './Sort.vue';
  
  import { useFilters } from '../composables/useFilters';
  import { usePagination } from '../composables/usePagination';
  import { useSearch } from '../composables/useSearch';
  import { useSort } from '../composables/useSort';
  import { useSelection } from '../composables/useSelection';
  import { CloseIcon, NoResultIcon } from '../icons';

  const props = withDefaults(defineProps<{
    columns: ColumnState[];
    data: Record<string, any>[];
    loading?: boolean;
    enableSelection?: boolean;
    paginationConfig?: PaginationConfig;
    exportFilename?: string;
  }>(), {
    loading: false,
    enableSelection: false,
    paginationConfig: () => ({
      maxVisiblePages: 7,
      showFirstLast: true,
      showPageInfo: true
    }),
    exportFilename: 'table-export'
  });

  const search = ref('');
  const { filteredData: searchFiltered } = useSearch(
    search,
    computed(() => props.data),
    props.columns.map(c => c.key)
  );

  const { filters, filtered, resetFilters } = useFilters(() => searchFiltered.value, props.columns);

  const { sort, sortBy, sortedData } = useSort(filtered);

  const perPage = ref(10);
  const { 
    page, 
    totalPages, 
    paginatedData, 
    visiblePages,
    setPage, 
    nextPage, 
    prevPage, 
    firstPage, 
    lastPage 
  } = usePagination(sortedData, perPage, props.paginationConfig);

  // Selection functionality
  const { 
    selectAll, 
    indeterminate, 
    selectedData, 
    toggleRow, 
    clearSelection, 
    isSelected 
  } = useSelection(paginatedData);

  const distinctValues = computed(() =>
    Object.fromEntries(
      props.columns.map(col => {
        const values = searchFiltered.value.map(row => row[col.key]);
        const strings = values.map(v => String(v)).filter(Boolean);
        return [col.key, Array.from(new Set(strings)).sort()];
      })
    )
  );

  const totalColumns = computed(() => 
    props.columns.length + (props.enableSelection ? 1 : 0)
  );

  // Format cell values based on column type
  function formatCellValue(value: any, column: ColumnState): string {
    if (value == null) return '';
    
    switch (column.type) {
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : String(value);
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  // Bulk actions configuration
  const bulkActions = computed(() => [
    {
      action: 'clear',
      variant: 'default' as const,
      tooltip: 'Clear Selection',
      icon: CloseIcon
    }
  ]);

  // Handle bulk actions
  function handleBulkAction(action: string) {
    switch (action) {
      case 'clear':
        clearSelection();
        break;
      // Add more actions here as needed
      // case 'delete':
      //   handleDelete();
      //   break;
      // case 'edit':
      //   handleEdit();
      //   break;
    }
  }

  // Update filters function
  function updateFilters(newFilters: Record<string, string[]>) {
    Object.assign(filters, newFilters);
  }

  // Reset to first page when filters change
  watch([perPage, search, filters], () => {
    setPage(1);
  });
</script>
