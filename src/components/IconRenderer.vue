<template>
  <component :is="iconComponent" />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import {
    AddIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    EyeIcon,
    TrashIcon,
    CloseIcon,
    FilterIcon,
    SearchIcon,
    SortIcon,
    SortAscIcon,
    SortDescIcon,
    ChevronDownIcon,
    NoResultIcon,
  } from '../icons';

  const props = defineProps<{
    icon: string | any; // string for icon name, any for component
  }>();

  const iconMap = {
    'add': AddIcon,
    'edit': EditIcon,
    'delete': DeleteIcon,
    'download': DownloadIcon,
    'eye': EyeIcon,
    'trash': TrashIcon,
    'close': CloseIcon,
    'filter': FilterIcon,
    'search': SearchIcon,
    'sort': SortIcon,
    'sort-asc': SortAscIcon,
    'sort-desc': SortDescIcon,
    'chevron-down': ChevronDownIcon,
    'no-result': NoResultIcon,
  };

  const iconComponent = computed(() => {
    if (typeof props.icon === 'string') {
      return iconMap[props.icon as keyof typeof iconMap] || null;
    }
    
    return props.icon;
  });
</script>
