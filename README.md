# Vue Daisy Table

Un composant DataTable moderne et optimisé pour Vue 3, stylé avec Tailwind CSS et DaisyUI.

## 🚀 Fonctionnalités

- ✅ **Recherche en temps réel** avec debouncing
- ✅ **Filtrage multi-sélection** par colonne
- ✅ **Tri multi-colonnes** avec types de données
- ✅ **Pagination intelligente** avec navigation rapide
- ✅ **Sélection de lignes** (individuelle/globale)
- ✅ **Actions en lot** et **actions indépendantes**
- ✅ **Export de données** (CSV, JSON, Excel)
- ✅ **Support API** avec chargement automatique
- ✅ **Styling conditionnel** (badges, couleurs)
- ✅ **Interface responsive** et accessible
- ✅ **Support TypeScript** complet
- ✅ **Icônes SVG** intégrées

## 📦 Installation

```bash
npm install vue-daisy-components
```

## 🔧 Prérequis

- Vue 3.x
- Tailwind CSS
- DaisyUI

## 🎯 Utilisation de base

```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
  />
</template>

<script setup>
import { DaisyDataTable } from 'vue-daisy-components';

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nom', sortable: true, searchable: true },
  { key: 'email', label: 'Email', searchable: true },
  { key: 'role', label: 'Rôle', sortable: true }
];

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' }
];
</script>
```

## ⚙️ Configuration avancée

### Props principales

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `data` | `Record<string, any>[] \| string` | - | Données statiques ou URL API |
| `columns` | `ColumnState[]` | - | Configuration des colonnes |
| `selectionConfig` | `SelectionConfig?` | - | Configuration de la sélection |
| `actionsConfig` | `ActionsConfig?` | - | Configuration des actions |
| `paginationConfig` | `PaginationConfig?` | - | Configuration de la pagination |
| `tableClass` | `string` | `'table-zebra'` | Classes CSS pour la table |
| `exportFilename` | `string` | `'table-export'` | Nom du fichier d'export |

### Configuration des colonnes

```typescript
interface ColumnState {
  key: string;                    // Clé de la colonne
  label: string;                  // Libellé affiché
  sortable?: boolean;             // Triable (défaut: true)
  searchable?: boolean;           // Recherchable (défaut: true)
  filterable?: boolean;           // Filtrable (défaut: true)
  width?: string;                 // Largeur CSS
  type?: 'string' | 'number' | 'date' | 'boolean'; // Type de données
  conditionalStyle?: string | ((value: any) => string); // Style conditionnel
}
```

### Exemple de colonnes avancées

```vue
<script setup>
const columns = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Nom', sortable: true, searchable: true },
  { 
    key: 'status', 
    label: 'Statut', 
    sortable: true,
    conditionalStyle: (value) => value === 'Active' ? 'badge badge-success' : 'badge badge-error'
  },
  { 
    key: 'active', 
    label: 'Actif', 
    sortable: true,
    conditionalStyle: (value) => value ? 'badge badge-success' : 'badge badge-error'
  },
  { key: 'created_at', label: 'Créé le', sortable: true, type: 'date' }
];
</script>
```

## 🎮 Actions et sélection

### Configuration de la sélection

```vue
<script setup>
const selectionConfig = {
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
    },
    {
      action: 'view',
      variant: 'info',
      tooltip: 'Voir la sélection',
      icon: 'eye'
    }
  ]
};
</script>
```

### Actions indépendantes

```vue
<script setup>
const actionsConfig = {
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
      tooltip: 'Exporter toutes les données',
      icon: 'download'
    }
  ]
};
</script>
```

### Gestionnaires d'événements

```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
    :selection-config="selectionConfig"
    :actions-config="actionsConfig"
    @action="handleAction"
    @bulk-action="handleBulkAction"
  />
</template>

<script setup>
const handleAction = (action) => {
  switch (action) {
    case 'add':
      // Logique pour ajouter
      break;
    case 'export':
      // Logique pour exporter
      break;
  }
};

const handleBulkAction = (action, selectedData) => {
  switch (action) {
    case 'delete':
      // Logique pour supprimer les éléments sélectionnés
      break;
    case 'edit':
      // Logique pour modifier les éléments sélectionnés
      break;
  }
};
</script>
```

## 🌐 Mode API

### Utilisation avec API

```vue
<template>
  <DaisyDataTable
    data="/api/users"
    :columns="columns"
    :selection-config="selectionConfig"
    :actions-config="actionsConfig"
    @action="handleAction"
    @bulk-action="handleBulkAction"
  />
</template>
```

### Format de l'API

L'API doit accepter les paramètres POST suivants :

```typescript
interface ApiParams {
  filters: Record<string, string[]>;    // Filtres par colonne
  search: string;                       // Terme de recherche
  sort: {                              // Tri
    column: string;
    ascending: boolean;
  };
  page: number;                        // Page courante
  perPage: number;                     // Éléments par page
}
```

Et retourner :

```typescript
interface ApiResponse {
  data: Record<string, any>[];         // Données de la page
  total: number;                       // Nombre total d'éléments
  distinctValues: Record<string, any[]>; // Valeurs distinctes pour les filtres
}
```

### Exemple d'API Laravel

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        
        // Recherche
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }
        
        // Filtres
        foreach ($request->filters as $column => $values) {
            if (!empty($values)) {
                $query->whereIn($column, $values);
            }
        }
        
        // Tri
        if ($request->sort['column']) {
            $query->orderBy($request->sort['column'], $request->sort['ascending'] ? 'asc' : 'desc');
        }
        
        // Pagination
        $perPage = $request->perPage ?? 10;
        $data = $query->paginate($perPage);
        
        // Valeurs distinctes pour les filtres
        $distinctValues = [
            'role' => User::distinct()->pluck('role')->toArray(),
            'status' => User::distinct()->pluck('status')->toArray(),
        ];
        
        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'distinctValues' => $distinctValues
        ]);
    }
}
```

## 📊 Configuration de la pagination

```vue
<script setup>
const paginationConfig = {
  maxVisiblePages: 5,        // Nombre max de pages visibles
  showFirstLast: true,       // Afficher les boutons première/dernière page
  showPageInfo: true,        // Afficher les informations de page
  perPageOptions: [5, 10, 25, 50], // Options pour éléments par page
  perPage: 10                // Éléments par page par défaut
};
</script>
```

## 🎨 Styling conditionnel

### Badges colorés

```vue
<script setup>
const columns = [
  {
    key: 'status',
    label: 'Statut',
    conditionalStyle: (value) => {
      switch (value) {
        case 'Active': return 'badge badge-success';
        case 'Inactive': return 'badge badge-error';
        case 'Pending': return 'badge badge-warning';
        default: return 'badge badge-neutral';
      }
    }
  }
];
</script>
```

### Classes CSS personnalisées

```vue
<script setup>
const columns = [
  {
    key: 'priority',
    label: 'Priorité',
    conditionalStyle: (value) => {
      if (value === 'High') return 'text-red-600 font-bold';
      if (value === 'Medium') return 'text-yellow-600 font-semibold';
      return 'text-green-600';
    }
  }
];
</script>
```

## 🔧 Icônes disponibles

Le composant utilise des icônes SVG intégrées. Voici les icônes disponibles :

- `'add'` - Ajouter
- `'edit'` - Modifier
- `'delete'` - Supprimer
- `'eye'` - Voir
- `'download'` - Télécharger
- `'close'` - Fermer
- `'export'` - Exporter
- `'filter'` - Filtrer
- `'search'` - Rechercher
- `'sort'` - Trier
- `'sort-asc'` - Tri ascendant
- `'sort-desc'` - Tri descendant
- `'chevron-down'` - Flèche vers le bas
- `'no-result'` - Aucun résultat

### Utilisation d'icônes personnalisées

```vue
<script setup>
import MyCustomIcon from './MyCustomIcon.vue';

const actionsConfig = {
  actions: [
    {
      action: 'custom',
      variant: 'primary',
      tooltip: 'Action personnalisée',
      icon: MyCustomIcon  // Composant Vue personnalisé
    }
  ]
};
</script>
```

## 📱 Responsive et accessibilité

Le composant est entièrement responsive et accessible :

- **Navigation clavier** : Tab, Espace, Entrée
- **ARIA labels** : Attributs d'accessibilité complets
- **Responsive** : Adaptation automatique sur mobile
- **Focus visible** : Indicateurs de focus clairs

## 🎯 Exemple complet

```vue
<template>
  <div class="p-6">
    <DaisyDataTable
      :data="isApiMode ? '/api/users' : users"
      :columns="columns"
      :selection-config="selectionConfig"
      :actions-config="actionsConfig"
      :pagination-config="paginationConfig"
      table-class="table-zebra"
      export-filename="users-export"
      @action="handleAction"
      @bulk-action="handleBulkAction"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { DaisyDataTable } from 'vue-daisy-components';

// Données
const users = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'Active', active: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', status: 'Inactive', active: false }
]);

// Configuration des colonnes
const columns = ref([
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Nom', sortable: true, searchable: true },
  { key: 'email', label: 'Email', sortable: true, searchable: true },
  { key: 'role', label: 'Rôle', sortable: true, searchable: true },
  { 
    key: 'status', 
    label: 'Statut', 
    sortable: true,
    conditionalStyle: (value) => value === 'Active' ? 'badge badge-success' : 'badge badge-error'
  },
  { 
    key: 'active', 
    label: 'Actif', 
    sortable: true,
    conditionalStyle: (value) => value ? 'badge badge-success' : 'badge badge-error'
  }
]);

// Configuration de la sélection
const selectionConfig = reactive({
  actions: [
    { action: 'delete', variant: 'error', tooltip: 'Supprimer', icon: 'delete' },
    { action: 'edit', variant: 'warning', tooltip: 'Modifier', icon: 'edit' },
    { action: 'view', variant: 'info', tooltip: 'Voir', icon: 'eye' }
  ]
});

// Configuration des actions
const actionsConfig = reactive({
  actions: [
    { action: 'add', variant: 'success', tooltip: 'Ajouter', icon: 'add' },
    { action: 'export', variant: 'info', tooltip: 'Exporter', icon: 'download' }
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

// Mode API
const isApiMode = ref(false);

// Gestionnaires d'événements
const handleAction = (action) => {
  console.log('Action:', action);
  // Votre logique ici
};

const handleBulkAction = (action, selectedData) => {
  console.log('Action en lot:', action, selectedData);
  // Votre logique ici
};
</script>
```

## 🐛 Dépannage

### Problèmes courants

**1. Les données ne se chargent pas en mode API**
- Vérifiez que l'URL de l'API est correcte
- Assurez-vous que l'API retourne le bon format
- Vérifiez les logs de la console pour les erreurs

**2. Les filtres ne fonctionnent pas**
- Vérifiez que `filterable: true` est défini sur les colonnes
- En mode API, assurez-vous que `distinctValues` est retourné

**3. La pagination ne s'affiche pas**
- Vérifiez que `total` est correctement retourné par l'API
- Assurez-vous que `perPage` est dans `perPageOptions`

**4. Les actions ne se déclenchent pas**
- Vérifiez que les gestionnaires d'événements sont correctement définis
- Assurez-vous que les icônes sont valides

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆕 Changelog

### v0.3.0
- ✨ Support API avec chargement automatique
- ✨ Actions indépendantes et en lot
- ✨ Styling conditionnel (badges, couleurs)
- ✨ Icônes SVG intégrées
- ✨ Optimisation des performances
- 🐛 Corrections de bugs et améliorations

### v0.2.0
- ✨ Recherche en temps réel
- ✨ Filtrage multi-sélection
- ✨ Tri multi-colonnes
- ✨ Pagination intelligente
- ✨ Export de données

### v0.1.0
- 🎉 Version initiale
- ✨ Composant DataTable de base
- ✨ Support Vue 3 + TypeScript
