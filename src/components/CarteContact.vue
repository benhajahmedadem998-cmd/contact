<script setup lang="ts">
import type { PropType } from 'vue';
import { Pencil, Phone } from 'lucide-vue-next';
import type { Contact } from '../types/contact';
import AvatarContact from './AvatarContact.vue';

const props = defineProps({
  contact: {
    type: Object as PropType<Contact>,
    required: true,
  },
});

const emit = defineEmits({
  modifier: (id: number) => typeof id === 'number' && id > 0,
});

function demanderModification() {
  emit('modifier', props.contact.id);
}
</script>

<template>
  <article
    class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors cursor-pointer"
    @click="demanderModification"
  >
    <div class="flex items-center gap-4 min-w-0 flex-1 group">
      <AvatarContact
        :src="contact.photo"
        :nom="contact.nom"
        :prenom="contact.prenom"
        taille="md"
      />

      <div class="min-w-0 flex-1">
        <h2 class="font-display text-base font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
          {{ contact.nom }} {{ contact.prenom }}
        </h2>
        <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-600">
          <span class="inline-flex items-center gap-1.5 font-mono-tabular text-slate-700">
            <Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            {{ contact.telephone }}
          </span>
          <span class="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
          <span class="text-slate-500 truncate max-w-[220px] hidden sm:inline">
            {{ contact.email }}
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      @click.stop="demanderModification"
    >
      <Pencil class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>Modifier</span>
    </button>
  </article>
</template>
