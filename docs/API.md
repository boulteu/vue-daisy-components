# Vue Daisy Table - Documentation API

## 📋 Table des matières

1. [Types TypeScript](#types-typescript)
2. [Composants](#composants)
3. [Composables](#composables)
4. [Événements](#événements)
5. [Configuration](#configuration)
6. [Exemples avancés](#exemples-avancés)

## 🔧 Types TypeScript

### ColumnState

```typescript
interface ColumnState {
  key: string;                                    // Clé unique de la colonne
  label: string;                                  // Libellé affiché dans l'en-tête
  sortable?: boolean;                             // Permet le tri (défaut: true)
  searchable?: boolean;                           // Permet la recherche (défaut: true)
  filterable?: boolean;                           // Permet le filtrage (défaut: true)
  width?: string;                                 // Largeur CSS (ex: '100px', '20%')
  type?: 'string' | 'number' | 'date' | 'boolean'; // Type de données pour le formatage
  conditionalStyle?: string | ((value: any) => string); // Style conditionnel
}
```

### Action

```typescript
interface Action {
  action: string;                                 // Identifiant de l'action
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  tooltip: string;                                // Texte du tooltip
  icon: string | Component;                       // Nom d'icône ou composant Vue
}
```

### SelectionConfig

```typescript
interface SelectionConfig {
  actions: Action[];                              // Actions disponibles pour la sélection
}
```

### ActionsConfig

```typescript
interface ActionsConfig {
  actions: Action[];                              // Actions indépendantes
}
```

### PaginationConfig

```typescript
interface PaginationConfig {
  maxVisiblePages?: number;                       // Nombre max de pages visibles (défaut: 5)
  showFirstLast?: boolean;                        // Afficher première/dernière page (défaut: true)
  showPageInfo?: boolean;                         // Afficher infos de page (défaut: true)
  perPageOptions?: number[];                      // Options pour éléments par page
  perPage?: number;                               // Éléments par page par défaut
}
```

### SortState

```typescript
interface SortState {
  column: string | null;                          // Colonne triée
  ascending: boolean;                             // Ordre ascendant/descendant
}
```

## 🧩 Composants

### DaisyDataTable

Le composant principal du DataTable.

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `data` | `Record<string, any>[] \| string` | - | Données statiques ou URL API |
| `columns` | `ColumnState[]` | - | Configuration des colonnes |
| `selectionConfig` | `SelectionConfig?` | - | Configuration de la sélection |
| `actionsConfig` | `ActionsConfig?` | - | Configuration des actions |
| `paginationConfig` | `PaginationConfig?` | - | Configuration de la pagination |
| `tableClass` | `string` | `'table-zebra'` | Classes CSS pour la table |
| `exportFilename` | `string` | `'table-export'` | Nom du fichier d'export |

#### Événements

| Événement | Payload | Description |
|-----------|---------|-------------|
| `action` | `string` | Action indépendante déclenchée |
| `bulk-action` | `(action: string, selectedData: Record<string, any>[])` | Action en lot déclenchée |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `cell-{columnKey}` | `{ row, column, value }` | Personnalisation du contenu d'une cellule |

### Exemple d'utilisation des slots

```vue
<template>
  <DaisyDataTable :data="users" :columns="columns">
    <template #cell-status="{ row, value }">
      <span :class="getStatusClass(value)">
        {{ value }}
      </span>
    </template>
    
    <template #cell-actions="{ row }">
      <button @click="editUser(row)">Modifier</button>
    </template>
  </DaisyDataTable>
</template>
```

## 🔄 Composables

### useSearch

Gère la recherche en temps réel avec debouncing.

```typescript
function useSearch(
  searchTerm: Ref<string>,
  data: ComputedRef<Record<string, any>[]>,
  searchableColumns: string[]
): {
  filteredData: ComputedRef<Record<string, any>[]>;
}
```

### useFilters

Gère le filtrage multi-sélection par colonne.

```typescript
function useFilters(
  data: ComputedRef<Record<string, any>[]>,
  columns: ColumnState[]
): {
  filters: Record<string, string[]>;
  filtered: ComputedRef<Record<string, any>[]>;
  resetFilters: () => void;
}
```

### useSort

Gère le tri multi-colonnes avec types de données.

```typescript
function useSort(
  data: ComputedRef<Record<string, any>[]>,
  columns: ColumnState[]
): {
  sort: Ref<SortState>;
  sortBy: (column: string) => void;
  sortedData: ComputedRef<Record<string, any>[]>;
}
```

### usePagination

Gère la pagination intelligente.

```typescript
function usePagination(
  data: ComputedRef<Record<string, any>[]>,
  perPage: Ref<number>,
  config?: PaginationConfig
): {
  page: Ref<number>;
  perPage: Ref<number>;
  totalPages: ComputedRef<number>;
  paginatedData: ComputedRef<Record<string, any>[]>;
  visiblePages: ComputedRef<number[]>;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
}
```

### useSelection

Gère la sélection de lignes.

```typescript
function useSelection(
  data: ComputedRef<Record<string, any>[]>
): {
  selectedRows: Ref<Set<number>>;
  selectAll: Ref<boolean>;
  indeterminate: ComputedRef<boolean>;
  toggleRow: (index: number) => void;
  isSelected: (index: number) => boolean;
  clearSelection: () => void;
}
```

### useApiData

Gère le chargement de données depuis une API.

```typescript
function useApiData(apiUrl: string): {
  data: Ref<Record<string, any>[]>;
  total: Ref<number>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  distinctValues: Ref<Record<string, any[]>>;
  fetchData: (params: ApiParams) => Promise<void>;
}
```

## 📡 Événements

### Format des événements

#### Action indépendante

```typescript
// Événement déclenché lors du clic sur une action indépendante
@action="(action: string) => void"
```

#### Action en lot

```typescript
// Événement déclenché lors du clic sur une action de sélection
@bulk-action="(action: string, selectedData: Record<string, any>[]) => void"
```

### Exemple de gestion d'événements

```vue
<script setup>
const handleAction = (action: string) => {
  switch (action) {
    case 'add':
      showAddModal();
      break;
    case 'export':
      exportAllData();
      break;
    default:
      console.warn('Action non reconnue:', action);
  }
};

const handleBulkAction = (action: string, selectedData: Record<string, any>[]) => {
  switch (action) {
    case 'delete':
      if (confirm(`Supprimer ${selectedData.length} élément(s) ?`)) {
        deleteItems(selectedData.map(item => item.id));
      }
      break;
    case 'edit':
      editItems(selectedData);
      break;
    default:
      console.warn('Action en lot non reconnue:', action);
  }
};
</script>
```

## ⚙️ Configuration

### Configuration complète

```vue
<script setup>
import { ref, reactive } from 'vue';
import { DaisyDataTable } from 'vue-daisy-components';

// Données
const data = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', status: 'Inactive' }
]);

// Configuration des colonnes
const columns = ref([
  { 
    key: 'id', 
    label: 'ID', 
    sortable: true, 
    width: '80px' 
  },
  { 
    key: 'name', 
    label: 'Nom', 
    sortable: true, 
    searchable: true 
  },
  { 
    key: 'email', 
    label: 'Email', 
    sortable: true, 
    searchable: true 
  },
  { 
    key: 'role', 
    label: 'Rôle', 
    sortable: true, 
    searchable: true,
    filterable: true 
  },
  { 
    key: 'status', 
    label: 'Statut', 
    sortable: true,
    conditionalStyle: (value) => 
      value === 'Active' ? 'badge badge-success' : 'badge badge-error'
  }
]);

// Configuration de la sélection
const selectionConfig = reactive({
  actions: [
    {
      action: 'delete',
      variant: 'error',
      tooltip: 'Supprimer la sélection',
      icon: 'delete'
    },
    {
      action: 'edit',
      variant: 'warning',
      tooltip: 'Modifier la sélection',
      icon: 'edit'
    }
  ]
});

// Configuration des actions
const actionsConfig = reactive({
  actions: [
    {
      action: 'add',
      variant: 'success',
      tooltip: 'Ajouter un utilisateur',
      icon: 'add'
    },
    {
      action: 'export',
      variant: 'info',
      tooltip: 'Exporter les données',
      icon: 'download'
    }
  ]
});

// Configuration de la pagination
const paginationConfig = reactive({
  maxVisiblePages: 5,
  showFirstLast: true,
  showPageInfo: true,
  perPageOptions: [5, 10, 25, 50],
  perPage: 10
});
</script>
```

## 🎯 Exemples avancés

### Mode API avec gestion d'erreurs

```vue
<template>
  <div>
    <DaisyDataTable
      data="/api/users"
      :columns="columns"
      :selection-config="selectionConfig"
      :actions-config="actionsConfig"
      @action="handleAction"
      @bulk-action="handleBulkAction"
    />
    
    <!-- Gestion d'erreur -->
    <div v-if="apiError" class="alert alert-error mt-4">
      <span>Erreur de chargement: {{ apiError }}</span>
      <button @click="retryLoad" class="btn btn-sm">Réessayer</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DaisyDataTable } from 'vue-daisy-components';

const apiError = ref(null);

const handleAction = async (action) => {
  try {
    switch (action) {
      case 'add':
        await addUser();
        break;
      case 'export':
        await exportData();
        break;
    }
  } catch (error) {
    console.error('Erreur lors de l\'action:', error);
    apiError.value = error.message;
  }
};

const retryLoad = () => {
  apiError.value = null;
  // Le DataTable se rechargera automatiquement
};
</script>
```

### Personnalisation avancée avec slots

```vue
<template>
  <DaisyDataTable :data="users" :columns="columns">
    <!-- Personnalisation du statut -->
    <template #cell-status="{ row, value }">
      <div class="flex items-center gap-2">
        <div :class="getStatusDot(value)"></div>
        <span :class="getStatusText(value)">{{ value }}</span>
      </div>
    </template>
    
    <!-- Actions personnalisées -->
    <template #cell-actions="{ row }">
      <div class="flex gap-1">
        <button 
          @click="viewUser(row)" 
          class="btn btn-sm btn-ghost"
          title="Voir"
        >
          👁️
        </button>
        <button 
          @click="editUser(row)" 
          class="btn btn-sm btn-ghost"
          title="Modifier"
        >
          ✏️
        </button>
        <button 
          @click="deleteUser(row)" 
          class="btn btn-sm btn-ghost text-error"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </template>
  </DaisyDataTable>
</template>

<script setup>
const getStatusDot = (status) => {
  return `w-2 h-2 rounded-full ${
    status === 'Active' ? 'bg-green-500' : 'bg-red-500'
  }`;
};

const getStatusText = (status) => {
  return `text-sm font-medium ${
    status === 'Active' ? 'text-green-700' : 'text-red-700'
  }`;
};
</script>
```

### Intégration avec un store (Pinia)

```vue
<script setup>
import { useUserStore } from '@/stores/user';
import { DaisyDataTable } from 'vue-daisy-components';

const userStore = useUserStore();

// Utilisation des données du store
const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);

// Actions qui utilisent le store
const handleAction = async (action) => {
  switch (action) {
    case 'add':
      await userStore.addUser();
      break;
    case 'export':
      await userStore.exportUsers();
      break;
  }
};

const handleBulkAction = async (action, selectedData) => {
  switch (action) {
    case 'delete':
      await userStore.deleteUsers(selectedData.map(user => user.id));
      break;
    case 'edit':
      userStore.setUsersToEdit(selectedData);
      break;
  }
};
</script>
```

## 🔍 Dépannage avancé

### Problèmes de performance

**1. Données volumineuses**
```vue
<script setup>
// Utilisez la pagination côté serveur
const paginationConfig = reactive({
  perPage: 25, // Limitez le nombre d'éléments par page
  perPageOptions: [10, 25, 50, 100]
});
</script>
```

**2. Recherche lente**
```vue
<script setup>
// Désactivez la recherche sur certaines colonnes
const columns = ref([
  { key: 'id', label: 'ID', searchable: false }, // Pas de recherche sur l'ID
  { key: 'name', label: 'Nom', searchable: true },
  { key: 'email', label: 'Email', searchable: true }
]);
</script>
```

### Problèmes d'accessibilité

**1. Navigation clavier**
- Utilisez `Tab` pour naviguer entre les éléments
- Utilisez `Espace` ou `Entrée` pour activer les boutons
- Utilisez `Shift+Tab` pour naviguer en arrière

**2. Lecteurs d'écran**
- Tous les éléments ont des attributs ARIA appropriés
- Les tooltips sont accessibles aux lecteurs d'écran
- Les états de chargement sont annoncés

### Problèmes de style

**1. Conflits CSS**
```vue
<script setup>
// Utilisez des classes CSS personnalisées
const tableClass = 'my-custom-table table-zebra';
</script>
```

**2. Responsive**
```vue
<script setup>
// Désactivez certaines colonnes sur mobile
const columns = ref([
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email', className: 'hidden md:table-cell' }, // Caché sur mobile
  { key: 'role', label: 'Rôle', className: 'hidden lg:table-cell' }    // Caché sur tablette
]);
</script>
``` 