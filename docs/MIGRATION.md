# Guide de migration - Vue Daisy Table

Ce guide vous aide à migrer de la version précédente vers la v0.3.0 de Vue Daisy Table.

## 🔄 Changements majeurs

### 1. Props simplifiées

#### Avant (v0.2.0)
```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
    :loading="loading"
    :enable-selection="true"
    :pagination-config="paginationConfig"
  />
</template>
```

#### Après (v0.3.0)
```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
    :selection-config="selectionConfig"
    :pagination-config="paginationConfig"
  />
</template>
```

**Changements :**
- ❌ `loading` : Supprimé (automatique en mode API)
- ❌ `enable-selection` : Remplacé par `selectionConfig`
- ✅ `selectionConfig` : Nouveau prop pour configurer la sélection

### 2. Configuration de la sélection

#### Avant (v0.2.0)
```vue
<script setup>
// Pas de configuration de sélection
const enableSelection = true;
</script>
```

#### Après (v0.3.0)
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
    }
  ]
};
</script>
```

### 3. Actions indépendantes

#### Avant (v0.2.0)
```vue
<template>
  <div>
    <!-- Actions manuelles -->
    <button @click="addUser">Ajouter</button>
    <button @click="exportData">Exporter</button>
    
    <DaisyDataTable :data="users" :columns="columns" />
  </div>
</template>
```

#### Après (v0.3.0)
```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
    :actions-config="actionsConfig"
    @action="handleAction"
  />
</template>

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
      tooltip: 'Exporter les données',
      icon: 'download'
    }
  ]
};

const handleAction = (action) => {
  switch (action) {
    case 'add':
      addUser();
      break;
    case 'export':
      exportData();
      break;
  }
};
</script>
```

### 4. Gestion des événements

#### Avant (v0.2.0)
```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup>
const handleSelectionChange = (selectedRows) => {
  // Gestion de la sélection
};
</script>
```

#### Après (v0.3.0)
```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
    :selection-config="selectionConfig"
    @bulk-action="handleBulkAction"
  />
</template>

<script setup>
const handleBulkAction = (action, selectedData) => {
  switch (action) {
    case 'delete':
      deleteUsers(selectedData);
      break;
    case 'edit':
      editUsers(selectedData);
      break;
  }
};
</script>
```

## 🆕 Nouvelles fonctionnalités

### 1. Mode API

#### Nouveau : Chargement depuis une API
```vue
<template>
  <DaisyDataTable
    data="/api/users"
    :columns="columns"
    :selection-config="selectionConfig"
  />
</template>
```

### 2. Styling conditionnel

#### Nouveau : Badges et couleurs conditionnels
```vue
<script setup>
const columns = [
  {
    key: 'status',
    label: 'Statut',
    conditionalStyle: (value) => 
      value === 'Active' ? 'badge badge-success' : 'badge badge-error'
  },
  {
    key: 'priority',
    label: 'Priorité',
    conditionalStyle: (value) => {
      switch (value) {
        case 'High': return 'text-red-600 font-bold';
        case 'Medium': return 'text-yellow-600 font-semibold';
        default: return 'text-green-600';
      }
    }
  }
];
</script>
```

### 3. Icônes SVG intégrées

#### Nouveau : Utilisation d'icônes par nom
```vue
<script setup>
const selectionConfig = {
  actions: [
    {
      action: 'delete',
      variant: 'error',
      tooltip: 'Supprimer',
      icon: 'delete'  // Nom d'icône au lieu d'un composant
    },
    {
      action: 'edit',
      variant: 'warning',
      tooltip: 'Modifier',
      icon: 'edit'    // Nom d'icône au lieu d'un composant
    }
  ]
};
</script>
```

## 🔧 Migration étape par étape

### Étape 1 : Mettre à jour les imports

```javascript
// Avant
import DaisyDataTable from 'vue-daisy-components';

// Après (pas de changement)
import DaisyDataTable from 'vue-daisy-components';
```

### Étape 2 : Supprimer la prop `loading`

```vue
<!-- Avant -->
<DaisyDataTable :loading="isLoading" />

<!-- Après -->
<!-- Supprimé - automatique en mode API -->
```

### Étape 3 : Remplacer `enable-selection` par `selectionConfig`

```vue
<!-- Avant -->
<DaisyDataTable :enable-selection="true" />

<!-- Après -->
<DaisyDataTable :selection-config="selectionConfig" />
```

### Étape 4 : Ajouter la configuration de sélection

```vue
<script setup>
// Avant
const enableSelection = true;

// Après
const selectionConfig = {
  actions: [
    {
      action: 'delete',
      variant: 'error',
      tooltip: 'Supprimer la sélection',
      icon: 'delete'
    }
  ]
};
</script>
```

### Étape 5 : Mettre à jour les gestionnaires d'événements

```vue
<script setup>
// Avant
const handleSelectionChange = (selectedRows) => {
  // Logique de sélection
};

// Après
const handleBulkAction = (action, selectedData) => {
  switch (action) {
    case 'delete':
      deleteItems(selectedData);
      break;
  }
};
</script>
```

### Étape 6 : Ajouter les actions indépendantes (optionnel)

```vue
<template>
  <DaisyDataTable
    :actions-config="actionsConfig"
    @action="handleAction"
  />
</template>

<script setup>
const actionsConfig = {
  actions: [
    {
      action: 'add',
      variant: 'success',
      tooltip: 'Ajouter',
      icon: 'add'
    }
  ]
};

const handleAction = (action) => {
  if (action === 'add') {
    addItem();
  }
};
</script>
```

## 🐛 Problèmes courants lors de la migration

### 1. Erreur : "Property 'loading' does not exist"

**Solution :** Supprimez la prop `loading` - elle est maintenant automatique en mode API.

```vue
<!-- ❌ Incorrect -->
<DaisyDataTable :loading="isLoading" />

<!-- ✅ Correct -->
<DaisyDataTable />
```

### 2. Erreur : "Property 'enable-selection' does not exist"

**Solution :** Remplacez par `selectionConfig`.

```vue
<!-- ❌ Incorrect -->
<DaisyDataTable :enable-selection="true" />

<!-- ✅ Correct -->
<DaisyDataTable :selection-config="selectionConfig" />
```

### 3. Les actions de sélection ne fonctionnent plus

**Solution :** Utilisez le nouvel événement `@bulk-action`.

```vue
<!-- ❌ Incorrect -->
<DaisyDataTable @selection-change="handleSelection" />

<!-- ✅ Correct -->
<DaisyDataTable @bulk-action="handleBulkAction" />
```

### 4. Les icônes ne s'affichent plus

**Solution :** Utilisez les noms d'icônes intégrés ou importez vos composants.

```vue
<script setup>
// ❌ Incorrect (si l'icône n'existe pas)
icon: 'my-custom-icon'

// ✅ Correct (icônes intégrées)
icon: 'delete'
icon: 'edit'
icon: 'add'

// ✅ Correct (composant personnalisé)
import MyIcon from './MyIcon.vue';
icon: MyIcon
</script>
```

## 📋 Checklist de migration

- [ ] Supprimer la prop `loading`
- [ ] Remplacer `enable-selection` par `selectionConfig`
- [ ] Ajouter la configuration des actions de sélection
- [ ] Mettre à jour les gestionnaires d'événements
- [ ] Tester les fonctionnalités de sélection
- [ ] Ajouter les actions indépendantes (optionnel)
- [ ] Tester le mode API (si utilisé)
- [ ] Vérifier l'affichage des icônes
- [ ] Tester le styling conditionnel (si utilisé)

## 🆘 Support

Si vous rencontrez des problèmes lors de la migration :

1. **Vérifiez la console** pour les erreurs TypeScript
2. **Consultez la documentation API** pour les détails techniques
3. **Testez étape par étape** pour isoler les problèmes
4. **Ouvrez une issue** sur GitHub avec les détails de l'erreur

## 🎯 Exemple de migration complète

### Avant (v0.2.0)

```vue
<template>
  <div>
    <button @click="addUser">Ajouter</button>
    <button @click="exportData">Exporter</button>
    
    <DaisyDataTable
      :data="users"
      :columns="columns"
      :loading="loading"
      :enable-selection="true"
      :pagination-config="paginationConfig"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DaisyDataTable from 'vue-daisy-components';

const users = ref([/* ... */]);
const loading = ref(false);

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'status', label: 'Statut', sortable: true }
];

const paginationConfig = {
  maxVisiblePages: 5,
  showFirstLast: true
};

const handleSelectionChange = (selectedRows) => {
  console.log('Sélection:', selectedRows);
};

const addUser = () => {
  // Logique d'ajout
};

const exportData = () => {
  // Logique d'export
};
</script>
```

### Après (v0.3.0)

```vue
<template>
  <DaisyDataTable
    :data="users"
    :columns="columns"
    :selection-config="selectionConfig"
    :actions-config="actionsConfig"
    :pagination-config="paginationConfig"
    @action="handleAction"
    @bulk-action="handleBulkAction"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';
import DaisyDataTable from 'vue-daisy-components';

const users = ref([/* ... */]);

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Nom', sortable: true },
  { 
    key: 'status', 
    label: 'Statut', 
    sortable: true,
    conditionalStyle: (value) => 
      value === 'Active' ? 'badge badge-success' : 'badge badge-error'
  }
];

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

const paginationConfig = reactive({
  maxVisiblePages: 5,
  showFirstLast: true,
  perPageOptions: [5, 10, 25, 50],
  perPage: 10
});

const handleAction = (action) => {
  switch (action) {
    case 'add':
      addUser();
      break;
    case 'export':
      exportData();
      break;
  }
};

const handleBulkAction = (action, selectedData) => {
  switch (action) {
    case 'delete':
      deleteUsers(selectedData);
      break;
    case 'edit':
      editUsers(selectedData);
      break;
  }
};

const addUser = () => {
  // Logique d'ajout
};

const exportData = () => {
  // Logique d'export
};

const deleteUsers = (users) => {
  // Logique de suppression
};

const editUsers = (users) => {
  // Logique de modification
};
</script>
```

Cette migration vous donne accès à toutes les nouvelles fonctionnalités tout en conservant la compatibilité avec votre code existant ! 