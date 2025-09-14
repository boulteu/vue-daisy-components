<template>
  <input
    type="checkbox"
    class="checkbox checkbox-sm focus:outline-none focus:ring-0 custom-checkbox"
    :class="{
      '!bg-base-300 !border-base-300': checked || indeterminate
    }"
    :checked="checked"
    :indeterminate="indeterminate"
    @change="$emit('update:checked', ($event.target as HTMLInputElement).checked)"
    @click="$emit('click', $event)"
  />
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    checked?: boolean;
    indeterminate?: boolean;
  }>(), {
    checked: false,
    indeterminate: false
  });

  defineEmits<{
    'update:checked': [value: boolean];
    'click': [event: Event];
  }>();
</script>
