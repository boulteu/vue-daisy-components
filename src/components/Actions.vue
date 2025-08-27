<template>
  <div
    v-for="(action, index) in actions"
    :key="action.action"
    class="tooltip tooltip-bottom"
    :class="{ 'tooltip-left-aligned': index === 0 }"
    :data-tip="action.tooltip"
  >
    <button
      class="btn btn-sm"
      :class="`btn-${action.variant}`"
      :disabled="action.disabled"
      @click="$emit('action', action.action)"
    >
      <IconRenderer
        v-if="action.icon"
        :icon="action.icon"
        class="w-3 h-3"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { Action } from '../types';
  import IconRenderer from './IconRenderer.vue';

  defineProps<{
    actions: Action[];
  }>();

  defineEmits<{
    'action': [actionType: string];
  }>();
</script>

<style scoped>
  /* Align first tooltip to the left */
  .tooltip-left-aligned::before {
    left: 0 !important;
    right: auto !important;
    transform: translateX(0) !important;
  }
</style>
