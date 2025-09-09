<template>
  <div v-if="config.showPageInfo" class="text-sm text-base-content/70">
    {{ t('pagination.showing') }} {{ startItem }}-{{ endItem }} {{ t('pagination.of') }} {{ totalItems }} {{ t('pagination.items') }}
  </div>

  <div v-if="totalPages > 1" class="flex-1 flex" :class="{ 'justify-center': config.showPageInfo }">
    <div class="join">
      <button
        v-if="config.showFirstLast"
        class="join-item btn btn-sm"
        :disabled="page === 1"
        @click="$emit('goto', 1)"
        :title="t('pagination.first')"
      >
        ««
      </button>

      <button
        class="join-item btn btn-sm"
        :disabled="page === 1"
        @click="$emit('goto', page - 1)"
        :title="t('pagination.previous')"
      >
        «
      </button>

      <span
        v-if="visiblePages[0] > 1"
        class="join-item btn btn-sm btn-disabled !bg-base-200 !border-base-300 !text-base-content !border-r-0 !border-l-0"
      >
        ...
      </span>

      <button
        v-for="p in visiblePages"
        :key="p"
        class="join-item btn btn-sm"
        :class="{ 'btn-active': page === p }"
        @click="$emit('goto', p)"
        :title="`${t('pagination.goTo')} ${p}`"
      >
        {{ p }}
      </button>

      <span
        v-if="visiblePages[visiblePages.length - 1] < totalPages"
        class="join-item btn btn-sm btn-disabled !bg-base-200 !border-base-300 !text-base-content !border-r-0 !border-l-0"
      >
        ...
      </span>

      <button
        class="join-item btn btn-sm"
        :disabled="page === totalPages"
        @click="$emit('goto', page + 1)"
        :title="t('pagination.next')"
      >
        »
      </button>

      <button
        v-if="config.showFirstLast"
        class="join-item btn btn-sm"
        :disabled="page === totalPages"
        @click="$emit('goto', totalPages)"
        :title="t('pagination.last')"
      >
        »»
      </button>
    </div>
  </div>

  <select
    :value="perPage"
    @change="handlePerPageChange"
    class="select select-sm w-24 p-1 focus:outline-none focus:ring-0 focus:border-neutral"
    :class="{ 'ml-auto': totalPages <= 1 }"
    :title="t('pagination.itemsPerPage')"
    name="perPage"
  >
    <option v-for="option in config.perPageOptions" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { FinalPaginationConfig } from '../types';
  import { useI18n } from '../composables/useI18n';

  const { t } = useI18n();

  const props = defineProps<{
    page: number;
    totalPages: number;
    perPage: number;
    totalItems: number;
    visiblePages: number[];
    config: FinalPaginationConfig;
  }>();

  const emit = defineEmits(['goto', 'update']);

  const startItem = computed(() => (props.page - 1) * props.perPage + 1);
  const endItem = computed(() => Math.min(props.page * props.perPage, props.totalItems));

  const handlePerPageChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);
    if (!isNaN(value) && value > 0) {
      emit('update', value);
    }
  };
</script>
