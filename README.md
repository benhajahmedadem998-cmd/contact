# Carnet Contacts — Application Vue.js

Application web Vue.js de gestion des contacts réalisée avec Vue 3 (`<script setup>`), Vue Router et Tailwind CSS, structurée selon les principes du chapitre **Composants** :

## Architecture des composants

- **Conteneurs (Pages / Vues)** :
  - `ListeContacts.vue` : gère le filtre de recherche et la navigation vers la fiche d'un contact.
  - `DetailContact.vue` : gère le formulaire, la validation, la sélection de photo (galerie / caméra) et la sauvegarde.
- **Composants de présentation et de base (`PascalCase`)** :
  - `AppEnTete.vue` : barre de navigation unique de l'application (préfixe `App`).
  - `BaseCarte.vue` : carte générique à **slot par défaut** et **slot nommé** `#entete`.
  - `BaseModale.vue` : fenêtre modale à **slots nommés** (`#titre`, `#actions`) et slot par défaut.
  - `BaseChamp.vue` : champ de formulaire réutilisable avec `defineModel`, `defineOptions({ inheritAttrs: false })`, `v-bind="$attrs"` et slot de label.
  - `ListeGenerique.vue` : composant de liste générique avec **slot à portée limitée** (`scoped slot`).
  - `BarreRecherche.vue` : composant de recherche bidirectionnelle avec `defineModel`.
  - `AvatarContact.vue` : affichage de la photo avec validation de prop (`taille`) et initiales de repli.
  - `CarteContact.vue` : composant de présentation pur (*props down, events up* : reçoit `contact`, émet `modifier`).
  - `ModaleCamera.vue` : capture photo via `getUserMedia` avec solution de repli (`capture`) en cas d'indisponibilité.

## Installation et exécution

```bash
npm install
npm run dev
```

Pour compiler le projet en production :

```bash
npm run build
```
