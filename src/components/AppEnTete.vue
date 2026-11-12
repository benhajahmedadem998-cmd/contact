<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { Plus } from 'lucide-vue-next';

const route = useRoute();
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
      <!-- Zone 1 : Nom de l'application -->
      <RouterLink
        to="/"
        class="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
      >
        Carnet Contacts
      </RouterLink>

      <!-- Zone 2 : Liens de navigation -->
      <nav aria-label="Navigation principale" class="hidden sm:flex items-center gap-6 text-sm font-medium">
        <RouterLink
          to="/"
          class="py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          :class="
            route.name === 'liste-contacts'
              ? 'text-slate-900 border-blue-700'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
          "
        >
          Liste des contacts
        </RouterLink>
        <RouterLink
          to="/contact/nouveau"
          class="py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
          :class="
            route.name === 'nouveau-contact'
              ? 'text-slate-900 border-blue-700'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
          "
        >
          Nouveau contact
        </RouterLink>
      </nav>

      <!-- Zone 3 : Action principale -->
      <div class="flex items-center shrink-0">
        <RouterLink
          to="/contact/nouveau"
          class="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <Plus class="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Ajouter</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
