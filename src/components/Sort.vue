<template>
  <span class="text-base-content" v-if="sort.column === column">
    <SortAscIcon :class="classesNames" v-if="sort.ascending" />
    <SortDescIcon :class="classesNames" v-else />
  </span>
  <SortIcon :class="classesNames" class="text-base-content/40" v-else />
</template>

<script setup lang="ts">
  import { SortIcon, SortAscIcon, SortDescIcon } from '../icons';
  import type { SortState } from '../types';

  const props = defineProps<{
    sort: SortState;
    column: string;
  }>();

  const classesNames = 'w-3 h-3 inline align-baseline';
</script>
