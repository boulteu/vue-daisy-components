# Guide de contribution - Vue Daisy Table

Merci de votre intérêt pour contribuer à Vue Daisy Table ! Ce guide vous aidera à comprendre comment contribuer efficacement au projet.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 16+ 
- npm ou yarn
- Vue 3.x
- TypeScript

### Installation du projet

```bash
# Cloner le repository
git clone https://github.com/boulteu/vue-daisy-components.git
cd vue-daisy-components

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Structure du projet

```
vue-daisy-components/
├── src/
│   ├── components/          # Composants Vue
│   │   ├── DataTable.vue   # Composant principal
│   │   ├── Actions.vue     # Actions indépendantes
│   │   ├── BulkActions.vue # Actions en lot
│   │   ├── Export.vue      # Export de données
│   │   ├── Filters.vue     # Filtres
│   │   ├── Pagination.vue  # Pagination
│   │   ├── Search.vue      # Recherche
│   │   ├── Sort.vue        # Tri
│   │   └── ...
│   ├── composables/        # Composables Vue
│   │   ├── useApiData.ts   # Gestion API
│   │   ├── useFilters.ts   # Filtrage
│   │   ├── usePagination.ts # Pagination
│   │   ├── useSearch.ts    # Recherche
│   │   ├── useSelection.ts # Sélection
│   │   └── useSort.ts      # Tri
│   ├── icons/              # Icônes SVG
│   │   ├── add.svg
│   │   ├── edit.svg
│   │   ├── delete.svg
│   │   └── ...
│   └── types.ts            # Types TypeScript
├── docs/                   # Documentation
├── tests/                  # Tests
└── examples/               # Exemples d'utilisation
```

## 🔧 Développement

### Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run preview          # Prévisualisation du build

# Tests
npm run test             # Tests unitaires
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Couverture de tests

# Linting
npm run lint             # ESLint
npm run lint:fix         # ESLint avec auto-fix
npm run type-check       # Vérification TypeScript

# Documentation
npm run docs:dev         # Serveur de documentation
npm run docs:build       # Build de la documentation
```

### Conventions de code

#### Vue Components

```vue
<template>
  <!-- Template avec commentaires explicatifs -->
  <div class="component-name">
    <!-- Contenu du composant -->
  </div>
</template>

<script setup lang="ts">
// Imports organisés
import { ref, computed } from 'vue';
import type { ComponentProps } from '../types';

// Props avec types stricts
interface Props {
  data: Record<string, any>[];
  columns: ColumnState[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

// Emits typés
const emit = defineEmits<{
  'update:data': [data: Record<string, any>[]];
  'action': [action: string];
}>();

// Variables réactives
const searchTerm = ref('');
const selectedRows = ref<Set<number>>(new Set());

// Computed properties
const filteredData = computed(() => {
  // Logique de filtrage
});

// Fonctions
const handleAction = (action: string) => {
  emit('action', action);
};
</script>

<style scoped>
/* Styles scoped avec commentaires */
.component-name {
  /* Styles du composant */
}
</style>
```

#### TypeScript

```typescript
// Types avec documentation JSDoc
/**
 * Configuration d'une colonne du DataTable
 */
export interface ColumnState {
  /** Clé unique de la colonne */
  key: string;
  /** Libellé affiché dans l'en-tête */
  label: string;
  /** Permet le tri (défaut: true) */
  sortable?: boolean;
  /** Permet la recherche (défaut: true) */
  searchable?: boolean;
  /** Permet le filtrage (défaut: true) */
  filterable?: boolean;
  /** Largeur CSS */
  width?: string;
  /** Type de données pour le formatage */
  type?: 'string' | 'number' | 'date' | 'boolean';
  /** Style conditionnel */
  conditionalStyle?: string | ((value: any) => string);
}

// Fonctions avec types stricts
export function useSearch<T>(
  searchTerm: Ref<string>,
  data: ComputedRef<T[]>,
  searchableColumns: string[]
): {
  filteredData: ComputedRef<T[]>;
} {
  // Implémentation
}
```

#### CSS/Tailwind

```vue
<template>
  <!-- Classes organisées par catégorie -->
  <div 
    class="
      /* Layout */
      flex items-center justify-between
      /* Spacing */
      p-4 gap-2
      /* Colors */
      bg-white dark:bg-gray-800
      /* Borders */
      border border-gray-200 dark:border-gray-700
      /* Responsive */
      flex-col sm:flex-row
    "
  >
    <!-- Contenu -->
  </div>
</template>
```

### Tests

#### Tests unitaires

```typescript
// tests/composables/useSearch.test.ts
import { describe, it, expect } from 'vitest';
import { ref, computed } from 'vue';
import { useSearch } from '../../src/composables/useSearch';

describe('useSearch', () => {
  it('should filter data based on search term', () => {
    const searchTerm = ref('');
    const data = computed(() => [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' }
    ]);
    
    const { filteredData } = useSearch(searchTerm, data, ['name', 'email']);
    
    // Test initial state
    expect(filteredData.value).toHaveLength(2);
    
    // Test with search term
    searchTerm.value = 'alice';
    expect(filteredData.value).toHaveLength(1);
    expect(filteredData.value[0].name).toBe('Alice');
  });
});
```

#### Tests de composants

```typescript
// tests/components/DataTable.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DataTable from '../../src/components/DataTable.vue';

describe('DataTable', () => {
  it('should render table with data', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ],
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' }
        ]
      }
    });
    
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.findAll('tr')).toHaveLength(3); // Header + 2 rows
  });
});
```

## 🎯 Types de contributions

### 1. Corrections de bugs

1. **Identifier le bug** : Créez une issue avec une description détaillée
2. **Reproduire le bug** : Fournissez un exemple minimal
3. **Corriger** : Implémentez la correction
4. **Tester** : Ajoutez des tests pour éviter la régression
5. **Documenter** : Mettez à jour la documentation si nécessaire

### 2. Nouvelles fonctionnalités

1. **Proposer** : Créez une issue pour discuter de la fonctionnalité
2. **Planifier** : Définissez l'API et l'implémentation
3. **Implémenter** : Codez la fonctionnalité
4. **Tester** : Ajoutez des tests complets
5. **Documenter** : Mise à jour de la documentation

### 3. Améliorations de la documentation

1. **Identifier** : Trouvez des sections à améliorer
2. **Rédiger** : Écrivez du contenu clair et complet
3. **Exemples** : Ajoutez des exemples pratiques
4. **Réviser** : Vérifiez la cohérence et l'exactitude

### 4. Optimisations de performance

1. **Mesurer** : Identifiez les goulots d'étranglement
2. **Analyser** : Comprenez la cause du problème
3. **Optimiser** : Implémentez les améliorations
4. **Valider** : Vérifiez les gains de performance

## 📝 Processus de contribution

### 1. Fork et clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/boulteu/vue-daisy-components.git
cd vue-daisy-components

# Ajoutez le repository original comme upstream
git remote add upstream https://github.com/original-owner/vue-daisy-components.git
```

### 2. Créer une branche

```bash
# Synchronisez avec upstream
git fetch upstream
git checkout main
git merge upstream/main

# Créez une branche pour votre contribution
git checkout -b feature/nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

### 3. Développer

```bash
# Installez les dépendances
npm install

# Démarrez le serveur de développement
npm run dev

# Codez votre contribution
# ...

# Testez votre code
npm run test
npm run lint
npm run type-check
```

### 4. Commiter

```bash
# Ajoutez vos changements
git add .

# Commitez avec un message descriptif
git commit -m "feat: ajouter la fonctionnalité X

- Description détaillée des changements
- Impact sur l'API
- Tests ajoutés

Closes #123"
```

**Conventions de commit :**
- `feat:` : Nouvelle fonctionnalité
- `fix:` : Correction de bug
- `docs:` : Documentation
- `style:` : Formatage, style
- `refactor:` : Refactoring
- `test:` : Tests
- `chore:` : Maintenance

### 5. Pousser et créer une PR

```bash
# Poussez votre branche
git push origin feature/nouvelle-fonctionnalite

# Créez une Pull Request sur GitHub
```

### 6. Template de Pull Request

```markdown
## Description
Brève description des changements apportés.

## Type de changement
- [ ] Bug fix (correction qui ne change pas l'API)
- [ ] Nouvelle fonctionnalité (ajout qui étend l'API)
- [ ] Breaking change (correction ou fonctionnalité qui casse l'API)

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests manuels effectués

## Documentation
- [ ] Documentation mise à jour
- [ ] Exemples ajoutés/mis à jour

## Checklist
- [ ] Mon code suit les conventions du projet
- [ ] J'ai effectué un auto-review de mon code
- [ ] J'ai commenté mon code, particulièrement dans les parties difficiles
- [ ] J'ai fait les changements correspondants dans la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction fonctionne
- [ ] Les tests unitaires et d'intégration passent avec mes changements
- [ ] J'ai testé manuellement ma fonctionnalité

## Screenshots (si applicable)
Ajoutez des captures d'écran pour les changements visuels.

## Informations supplémentaires
Toute information supplémentaire pertinente.
```

## 🧪 Tests

### Exécuter les tests

```bash
# Tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage

# Tests spécifiques
npm run test -- --grep "useSearch"
```

### Écrire des tests

```typescript
// Structure recommandée pour les tests
describe('NomDuComposant', () => {
  describe('quand la prop X est fournie', () => {
    it('devrait faire Y', () => {
      // Arrange
      const wrapper = mount(Component, {
        props: { x: 'value' }
      });
      
      // Act
      await wrapper.find('button').trigger('click');
      
      // Assert
      expect(wrapper.emitted('event')).toBeTruthy();
    });
  });
  
  describe('quand la prop X n\'est pas fournie', () => {
    it('devrait utiliser la valeur par défaut', () => {
      // Test de la valeur par défaut
    });
  });
});
```

## 📚 Documentation

### Structure de la documentation

```
docs/
├── README.md           # Documentation principale
├── API.md             # Documentation technique
├── MIGRATION.md       # Guide de migration
├── CONTRIBUTING.md    # Guide de contribution
├── examples/          # Exemples d'utilisation
│   ├── basic.vue
│   ├── advanced.vue
│   └── api.vue
└── assets/            # Images et ressources
```

### Écrire de la documentation

1. **Clarté** : Utilisez un langage simple et direct
2. **Exemples** : Fournissez des exemples concrets
3. **Cohérence** : Suivez le style existant
4. **Complétude** : Couvrez tous les cas d'usage
5. **Mise à jour** : Gardez la doc synchronisée avec le code

## 🐛 Signaler un bug

### Template d'issue pour les bugs

```markdown
## Description du bug
Description claire et concise du bug.

## Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

## Comportement attendu
Description claire de ce qui devrait se passer.

## Comportement actuel
Description de ce qui se passe actuellement.

## Captures d'écran
Si applicable, ajoutez des captures d'écran.

## Environnement
- OS: [ex: macOS, Windows, Linux]
- Navigateur: [ex: Chrome, Safari, Firefox]
- Version: [ex: 22]
- Version de Vue: [ex: 3.3.0]

## Informations supplémentaires
Toute autre information pertinente.
```

## 💡 Proposer une fonctionnalité

### Template d'issue pour les fonctionnalités

```markdown
## Problème
Description claire du problème que cette fonctionnalité résoudrait.

## Solution proposée
Description claire de la solution souhaitée.

## Alternatives considérées
Description des alternatives que vous avez considérées.

## Informations supplémentaires
Contexte supplémentaire, captures d'écran, etc.
```

## 🤝 Code de conduite

### Nos standards

- Utilisez un langage accueillant et inclusif
- Respectez les différents points de vue et expériences
- Acceptez gracieusement les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour la communauté
- Montrez de l'empathie envers les autres membres

### Nos responsabilités

- Clarifier les standards de comportement acceptable
- Prendre des mesures correctives appropriées et équitables
- Supprimer, éditer ou rejeter les commentaires, commits, code, etc.

## 📞 Support

### Obtenir de l'aide

1. **Documentation** : Consultez d'abord la documentation
2. **Issues** : Recherchez dans les issues existantes
3. **Discussions** : Utilisez les discussions GitHub
4. **Discord** : Rejoignez notre serveur Discord

### Ressources utiles

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/)

## 🎉 Remerciements

Merci de contribuer à Vue Daisy Table ! Votre contribution aide à améliorer l'écosystème Vue et à créer de meilleurs outils pour les développeurs.

---

**Note** : Ce guide est un document vivant. N'hésitez pas à proposer des améliorations via une Pull Request ! 