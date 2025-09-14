# Vue Daisy Components

A comprehensive collection of Vue 3 components styled with Tailwind CSS and DaisyUI. Built with TypeScript, these components are designed for performance, accessibility, and developer experience.

## ✨ Features

- 🚀 **Performance** - Optimized for speed with lazy loading and efficient rendering
- 🎨 **Design** - Styled with DaisyUI, and adapt to your theme for seamless integration
- ⚡ **TypeScript** - Full TypeScript support with comprehensive type definitions
- 🌍 **Internationalization** - Automatic language detection based on HTML lang attribute
- 📱 **Responsive** - Mobile-first design with responsive components
- ♿ **Accessible** - Built with accessibility in mind

## 📦 Installation

### Prerequisites

Make sure you have the following dependencies installed:

```bash
npm install vue@^3.5.18 tailwindcss@^4.1.12 daisyui@^5.0.50
```

### Install Package

```bash
npm install vue-daisy-components
```

### Configuration

#### Tailwind CSS V4

Add to your main CSS file:

```css
/* Add to your main CSS file */
@import "tailwindcss";
@plugin "daisyui";

@source "./node_modules/vue-daisy-components";
```

#### Tailwind CSS V3

Add to your Tailwind configuration file:

```javascript
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/vue-daisy-components/**/*.{vue,js,ts}"
  ],
  plugins: [require("daisyui")]
}
```

## 🌍 Internationalization

All components automatically adapt to the page language (based on the HTML lang attribute) if translations are available (if not, the default language is English). Available translations: English, French, Spanish.

## 🧩 Components

### DataTable

Advanced data table with pagination, sorting, filtering, export and more.

#### Import

```javascript
import { DataTable } from 'vue-daisy-components'
```

#### Basic Usage

A simple data table with basic functionality. All props above are required.

```vue
<template>
  <DataTable
    :data="data"
    :columns="columns"
  />
</template>

<script setup>
  import { DataTable } from 'vue-daisy-components'

  const data = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Carol', email: 'carol@example.com' }
  ];
  
  const columns = [
    { key: 'id' },
    { key: 'name' },
    { key: 'email' }
  ];
</script>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Object[] \| String` | - | Array of data objects (represents the table rows), see [Advanced](#advanced) for more info about the String usage |
| `columns` | `Object[]` | - | Array of column definitions (represents the table columns) |
| `paginationConfig` | `Object` | - | Pagination configuration |
| `tableClass` | `String` | `table-zebra` | Defines the table classes, can be tailwind/daisyui classes but custom classes are also supported |
| `exportFilename` | `String \| Boolean` | `table-export` | Defines the filename of the exported file. If false, the export button will disappear. |
| `actionsConfig` | `Object` | - | Defines the actions buttons to be displayed in the table |
| `selectionConfig` | `Object` | - | Defines the selection buttons to be displayed in the table |

#### Column Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `String` | - | Column key (will be capitalized and used as the column header if no label, e.g. 'email' becomes 'Email') |
| `label` | `String` | - | Defines the column header label (default value: capitalized column key) |
| `sortable` | `Boolean` | `true` | Defines if the column is sortable |
| `filterable` | `Boolean` | `true` | Defines if the column is filterable, if all columns are not filterable, the filter button will disappear |

#### Pagination Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxVisiblePages` | `Number` | `5` | Number of page buttons to display |
| `showFirstLast` | `Boolean` | `true` | Show first/last page navigation buttons |
| `showPageInfo` | `Boolean` | `true` | Display current page information |
| `perPageOptions` | `Number[]` | `[5, 10, 25, 50]` | Array of items per page options |
| `perPage` | `Number` | `10` | Default number of items per page |

#### Features

- **Pagination** - Data table with pagination controls
- **Sorting** - Enable column sorting to help users find and organize data
- **Filtering** - Add filtering capabilities to narrow down data
- **Search** - Search functionality across all columns using the search bar
- **Export** - Export the data to a CSV, JSON, or Excel file
- **Custom Cells** - Customize cells based on data values by using the cell-<column.key> slot
- **Custom Actions** - Add custom action buttons to the table
- **Row Selection** - Select multiple rows with checkboxes
- **Advanced** - Load data from an API endpoint (POST only)

#### Events

| Event | Description |
|-------|-------------|
| `@action` | Fired when an action button is clicked |
| `@bulk-action` | Fired when a bulk action is performed on selected rows |

#### Methods

| Method | Description |
|--------|-------------|
| `reloadData()` | Clear cache and reload data (API mode only) |

### MultiSelect

Powerful multi-selection component with search.

#### Import

```javascript
import { MultiSelect } from 'vue-daisy-components'
```

#### Basic Usage

Simple multi-selection with predefined options.

```vue
<template>
  <MultiSelect
    :options="options"
    v-model="selected"
  />
</template>

<script setup>
  import { ref } from 'vue'
  import { MultiSelect } from 'vue-daisy-components'

  const options = ['Option 1', 'Option 2', 'Option 3']
  const selected = ref([])
</script>
```

## 🔧 API Mode

When using a string URL for the `data` prop, the DataTable will make POST requests to fetch data. The API should handle the following parameters:

### Request Payload

| Parameter | Type | Description |
|-----------|------|-------------|
| `filters` | `Object` | Filters values to apply to the request |
| `page` | `Number` | Page number |
| `perPage` | `Number` | Items per page |
| `search` | `String` | Search term to apply to the request |
| `sort` | `Object` | Sort order to apply to the request |
| `customParameters` | `Object` | Additional parameters to be sent to the API |

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `data` | `Object[]` | Data returned from the request |
| `distinctValues` | `Object` | Distinct values of the columns (for the filters) |
| `page` | `Number` | Page number |
| `perPage` | `Number` | Items per page |
| `total` | `Number` | Total number of items |
| `totalPages` | `Number` | Total number of pages |

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by [Boulteu](https://boulteu.com/)
