<template>
  <label class="input input-sm w-48 focus-within:outline-none focus-within:ring-0">
    <SearchIcon class="w-6 h-6 text-base-content/60" />
    <input
      type="search"
      :value="value"
      @input="$emit('update', ($event.target as HTMLInputElement).value)"
      class="px-0 w-full focus:outline-none focus:ring-0"
      :aria-label="t('multiselect.search')"
    />
  </label>
</template>

<script setup lang="ts">
  import { SearchIcon } from '../icons';
  import { useI18n } from '../composables/useI18n';

  const { t } = useI18n();
  
  defineProps<{
    value: string;
  }>();

  defineEmits(['update']);
</script>
