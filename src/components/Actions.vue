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
      :class="getButtonClass(action.variant)"
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

  const getButtonClass = (variant: string | undefined) => {
    const variantClasses = {
      'primary': 'btn-primary',
      'secondary': 'btn-secondary',
      'success': 'btn-success',
      'warning': 'btn-warning',
      'error': 'btn-error',
      'info': 'btn-info',
      'ghost': 'btn-ghost',
      'link': 'btn-link',
      'neutral': 'btn-neutral'
    };
    return variantClasses[variant as keyof typeof variantClasses] || '';
  };
</script>

