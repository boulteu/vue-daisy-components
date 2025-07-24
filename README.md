# 🧩 DaisyDataTable Vue

A beautiful, optimized, and feature-rich Vue 3 DataTable component styled with Tailwind CSS and DaisyUI.

## 🚀 Features

- 💅 Clean DaisyUI design with dark/light theme support
- ⚡ **Optimized Performance** with memoization and debouncing
- 🔍 **Advanced Search** with debounced input
- 🎯 **Smart Pagination** with configurable page display
- 🔧 **Flexible Filtering** supporting multiple data types (string, number, date, boolean)
- 📊 **Multi-column Sorting** with type-aware comparison
- ✅ **Row Selection** with bulk actions
- 📤 **Data Export** (CSV, JSON, Excel)
- 🎨 **Customizable Cells** with slot support
- 📱 **Responsive Design** for mobile and desktop
- ♿ **Accessibility** with ARIA labels and keyboard navigation
- 🔧 **TypeScript** support with strict typing

## 📦 Installation

```bash
npm install vue-daisy-table
```

## 🎯 Quick Start

```vue
<template>
  <DaisyDataTable
    :columns="columns"
    :data="data"
    :enable-selection="true"
    :loading="loading"
  />
</template>

<script setup>
import { DaisyDataTable } from 'vue-daisy-table'

const columns = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'email', label: 'Email', type: 'string' },
  { key: 'created_at', label: 'Created', type: 'date' },
  { key: 'active', label: 'Active', type: 'boolean' }
]

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', created_at: new Date(), active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: new Date(), active: false }
]
</script>
```

## 🔧 Advanced Usage

### Column Configuration

```typescript
interface ColumnState {
  key: string;
  label: string;
  type?: 'string' | 'number' | 'date' | 'boolean';
  filterable?: boolean;
  sortable?: boolean;
}
```

### Pagination Configuration

```typescript
interface PaginationConfig {
  maxVisiblePages?: number; // Default: 7
  showFirstLast?: boolean;  // Default: true
  showPageInfo?: boolean;   // Default: true
}
```

### Custom Cell Rendering

```vue
<DaisyDataTable :columns="columns" :data="data">
  <template #cell-status="{ value, row }">
    <span :class="value ? 'badge badge-success' : 'badge badge-error'">
      {{ value ? 'Active' : 'Inactive' }}
    </span>
  </template>
  
  <template #cell-actions="{ row }">
    <button @click="editRow(row)" class="btn btn-sm">Edit</button>
  </template>
</DaisyDataTable>
```

### Export Functionality

The component includes built-in export capabilities:

- **CSV Export**: Standard comma-separated values
- **JSON Export**: Full data structure
- **Excel Export**: Tab-delimited format for Excel compatibility

### Selection and Bulk Actions

```vue
<DaisyDataTable
  :columns="columns"
  :data="data"
  :enable-selection="true"
  @selection-change="handleSelectionChange"
/>
```

## 🎨 Composables

The library exports individual composables for custom implementations:

```typescript
import { 
  useFilters, 
  usePagination, 
  useSearch, 
  useSort, 
  useSelection, 
  useExport 
} from 'vue-daisy-table'
```

## 🔧 Performance Optimizations

- **Debounced Search**: 300ms delay to prevent excessive filtering
- **Memoized Computations**: Cached results for filters, sorting, and pagination
- **Smart Pagination**: Only renders visible page numbers
- **Efficient Re-renders**: Minimal DOM updates with Vue 3 reactivity

## 📱 Responsive Design

The component automatically adapts to different screen sizes:

- **Desktop**: Full feature set with side-by-side controls
- **Tablet**: Responsive grid layout for filters
- **Mobile**: Stacked layout with touch-friendly controls

## ♿ Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support

## 🎯 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📞 Support

For support and questions, please open an issue on GitHub.
