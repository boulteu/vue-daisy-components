<template>
  <div class="dropdown dropdown-start">
    <div class="tooltip tooltip-bottom" :data-tip="t('export.exportData')">
      <button class="btn btn-sm" tabindex="0">
        <DownloadIcon class="w-3 h-3" />
      </button>
    </div>
    
    <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      <li>
        <button @click="exportCSV" class="flex items-center gap-2" :title="t('export.exportAsCSV')">
          {{ t('export.exportAsCSV') }}
        </button>
      </li>
      <li>
        <button @click="exportJSON" class="flex items-center gap-2" :title="t('export.exportAsJSON')">
          {{ t('export.exportAsJSON') }}
        </button>
      </li>
      <li>
        <button @click="exportExcel" class="flex items-center gap-2" :title="t('export.exportAsExcel')">
          {{ t('export.exportAsExcel') }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { type ColumnState } from '../types';
  import { useExport } from '../composables/useExport';
  import { DownloadIcon } from '../icons';
  import { useI18n } from '../composables/useI18n';

  const { t } = useI18n();

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