<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';

const recherche = defineModel<string>({ default: '' });

defineProps({
  placeholder: {
    type: String,
    default: 'Rechercher (Échap pour vider)...',
  },
});

function effacer() {
  recherche.value = '';
}
</script>

<template>
  <div class="relative flex-1 sm:w-72">
    <Search
      class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      aria-hidden="true"
    />
    <input
      v-model.trim="recherche"
      type="search"
      aria-label="Rechercher un contact"
      :placeholder="placeholder"
      class="w-full min-h-[42px] pl-10 pr-9 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
      @keyup.esc="effacer"
    />
    <button
      v-if="recherche"
      type="button"
      aria-label="Effacer la recherche"
      class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded"
      @click="effacer"
    >
      <X class="w-4 h-4" aria-hidden="true" />
    </button>
  </div>
</template>
