<template>
  <div v-if="config.showPageInfo" class="text-sm text-base-content/70">
    Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} items
  </div>

  <div v-if="totalPages > 1" class="flex-1 flex" :class="{ 'justify-center': config.showPageInfo }">
    <div class="join">
      <button
        v-if="config.showFirstLast"
        class="join-item btn btn-sm"
        :disabled="page === 1"
        @click="$emit('first')"
        title="First page"
      >
        ««
      </button>

      <button
        class="join-item btn btn-sm"
        :disabled="page === 1"
        @click="$emit('prev')"
        title="Previous page"
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
        :title="`Go to page ${p}`"
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
        @click="$emit('next')"
        title="Next page"
      >
        »
      </button>

      <button
        v-if="config.showFirstLast"
        class="join-item btn btn-sm"
        :disabled="page === totalPages"
        @click="$emit('last')"
        title="Last page"
      >
        »»
      </button>
    </div>
  </div>

  <select
    :value="perPage"
    @change="$emit('update', Number(($event.target as HTMLInputElement).value))"
    class="select select-sm w-24 p-1 focus:outline-none focus:ring-0 focus:border-neutral"
    :class="{ 'ml-auto': totalPages <= 1 }"
    title="Items per page"
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

  const props = defineProps<{
    page: number;
    totalPages: number;
    perPage: number;
    totalItems: number;
    visiblePages: number[];
    config: FinalPaginationConfig;
  }>();

  defineEmits(['goto', 'update', 'next', 'prev', 'first', 'last']);

  const startItem = computed(() => (props.page - 1) * props.perPage + 1);
  const endItem = computed(() => Math.min(props.page * props.perPage, props.totalItems));
</script>
