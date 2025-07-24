<template>
  <div v-if="selectedCount > 0" class="flex items-center gap-2">
    <!-- Selected Count -->
    <span class="text-sm text-base-content/70">
      {{ selectedCount }} selected
    </span>

    <!-- Actions -->
    <div class="flex items-center gap-1">
      <div
        v-for="action in actions"
        :key="action.action"
        class="tooltip tooltip-bottom"
        :data-tip="action.tooltip || action.label"
      >
        <button
          class="btn btn-sm"
          :class="getButtonClass(action.variant)"
          :disabled="action.disabled"
          @click="$emit('action', action.action)"
        >
          <!-- Icon if provided -->
          <component
            v-if="action.icon"
            :is="action.icon"
            class="w-3 h-3"
          />
          
          <!-- Label -->
          <span v-if="action.label">{{ action.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Action } from '../types';

interface Props {
  selectedCount: number;
  actions: Action[];
}

interface Emits {
  'action': [actionType: string];
}

const props = defineProps<Props>();
defineEmits<Emits>();

// Get button class based on variant
function getButtonClass(variant?: string): string {
  switch (variant) {
    case 'default':
      return 'btn';
    case 'secondary':
      return 'btn-secondary';
    case 'error':
      return 'btn-error';
    case 'success':
      return 'btn-success';
    case 'warning':
      return 'btn-warning';
    case 'info':
      return 'btn-info';
    case 'outline':
      return 'btn-outline';
    default:
      return 'btn-outline';
  }
}
</script> 