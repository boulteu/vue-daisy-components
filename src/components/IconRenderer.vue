<template>
  <component :is="iconComponent" />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import {
    AddIcon,
    ChevronDownIcon,
    CloseIcon,
    DeleteIcon,
    DownloadIcon,
    EditIcon,
    EyeIcon,
    FilterIcon,
    NoResultIcon,
    RefreshIcon,
    SearchIcon,
    SortIcon,
    SortAscIcon,
    SortDescIcon
  } from '../icons';

  const props = defineProps<{
    icon: string | any; // string for icon name, any for component
  }>();

  const iconMap = {
    'add': AddIcon,
    'chevron-down': ChevronDownIcon,
    'close': CloseIcon,
    'delete': DeleteIcon,
    'download': DownloadIcon,
    'edit': EditIcon,
    'eye': EyeIcon,
    'filter': FilterIcon,
    'no-result': NoResultIcon,
    'refresh': RefreshIcon,
    'search': SearchIcon,
    'sort': SortIcon,
    'sort-asc': SortAscIcon,
    'sort-desc': SortDescIcon
  };

  const iconComponent = computed(() => {
    if (typeof props.icon === 'string') {
      return iconMap[props.icon as keyof typeof iconMap] || null;
    }
    
    return props.icon;
  });
</script>
