<template>
  <div class="dropdown dropdown-start">
    <div class="tooltip tooltip-bottom" data-tip="Export data">
      <button class="btn btn-sm" tabindex="0">
        <DownloadIcon class="w-3 h-3" />
      </button>
    </div>
    
    <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      <li>
        <button @click="exportCSV" class="flex items-center gap-2" title="Export as CSV">
          <DownloadIcon class="w-4 h-4" /> Export as CSV
        </button>
      </li>
      <li>
        <button @click="exportJSON" class="flex items-center gap-2" title="Export as JSON">
          <DownloadIcon class="w-4 h-4" /> Export as JSON
        </button>
      </li>
      <li>
        <button @click="exportExcel" class="flex items-center gap-2" title="Export as Excel">
          <DownloadIcon class="w-4 h-4" /> Export as Excel
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { type ColumnState } from '../types';
  import { useExport } from '../composables/useExport';
  import { DownloadIcon } from '../icons';

  const props = defineProps<{
    data: any[];
    columns: ColumnState[];
    filename?: string;
  }>();

  const { exportToCSV, exportToJSON, exportToExcel } = useExport();

  const exportCSV = () => {
    exportToCSV(props.data, props.columns, {
      filename: props.filename ? `${props.filename}.csv` : 'export.csv'
    });
  }

  const exportJSON = () => {
    exportToJSON(props.data, {
      filename: props.filename ? `${props.filename}.json` : 'export.json'
    });
  }

  const exportExcel = () => {
    exportToExcel(props.data, props.columns, {
      filename: props.filename ? `${props.filename}.xlsx` : 'export.xlsx'
    });
  }
</script> 