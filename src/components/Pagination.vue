<template>
  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
    <!-- Page Info (Left) -->
    <div v-if="showPageInfo" class="text-sm text-base-content/70">
      Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} items
    </div>

    <!-- Pagination Controls (Center) -->
    <div class="flex-1 flex justify-center">
      <div class="join">
        <!-- First Page -->
        <button
          v-if="showFirstLast"
          class="join-item btn btn-sm"
          :disabled="page === 1"
          @click="$emit('first')"
          title="First page"
        >
          ««
        </button>

        <!-- Previous Page -->
        <button
          class="join-item btn btn-sm"
          :disabled="page === 1"
          @click="$emit('prev')"
          title="Previous page"
        >
          «
        </button>

        <!-- Page Numbers -->
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

        <!-- Next Page -->
        <button
          class="join-item btn btn-sm"
          :disabled="page === totalPages"
          @click="$emit('next')"
          title="Next page"
        >
          »
        </button>

        <!-- Last Page -->
        <button
          v-if="showFirstLast"
          class="join-item btn btn-sm"
          :disabled="page === totalPages"
          @click="$emit('last')"
          title="Last page"
        >
          »»
        </button>
      </div>
    </div>

    <!-- Items per page (Right) -->
    <select
      :value="perPage"
      @change="$emit('update', Number(($event.target as HTMLInputElement).value))"
      class="select select-sm w-24 p-1 focus:outline-none focus:ring-0"
      title="Items per page"
    >
      <option :value="5">5</option>
      <option :value="10">10</option>
      <option :value="25">25</option>
      <option :value="50">50</option>
    </select>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    page: number;
    totalPages: number;
    perPage: number;
    totalItems: number;
    visiblePages: number[];
    showFirstLast?: boolean;
    showPageInfo?: boolean;
  }>();

  defineEmits(['goto', 'update', 'next', 'prev', 'first', 'last']);

  // Computed properties for page info
  const startItem = computed(() => (props.page - 1) * props.perPage + 1);
  const endItem = computed(() => Math.min(props.page * props.perPage, props.totalItems));
</script>
