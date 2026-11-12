<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Plus, RotateCcw, Users } from 'lucide-vue-next';
import { useContacts } from '../composables/useContacts';
import BarreRecherche from '../components/BarreRecherche.vue';
import ListeGenerique from '../components/ListeGenerique.vue';
import CarteContact from '../components/CarteContact.vue';

const router = useRouter();
const { contacts, resetDemoContacts } = useContacts();
const recherche = ref('');

function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const contactsFiltres = computed(() => {
  const q = normaliser(recherche.value.trim());
  if (!q) return contacts.value;

  return contacts.value.filter((contact) => {
    const nomComplet = normaliser(`${contact.nom} ${contact.prenom}`);
    const nomInverse = normaliser(`${contact.prenom} ${contact.nom}`);
    return (
      nomComplet.includes(q) ||
      nomInverse.includes(q) ||
      normaliser(contact.telephone).includes(q) ||
      normaliser(contact.email).includes(q)
    );
  });
});

watchEffect(() => {
  document.title = `Contacts (${contacts.value.length}) — Carnet Contacts`;
});

function ouvrirFicheContact(id: number) {
  router.push({ name: 'detail-contact', params: { id } });
}

function effacerRecherche() {
  recherche.value = '';
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
    <!-- En-tête de la page -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Liste des contacts
        </h1>
        <p class="mt-1.5 text-sm text-slate-500 flex items-center gap-2">
          <span class="font-mono-tabular font-medium text-slate-700">{{ contacts.length }}</span>
          <span>{{ contacts.length > 1 ? 'contacts enregistrés' : 'contact enregistré' }}</span>
          <span aria-hidden="true">·</span>
          <span>Répertoire local</span>
        </p>
      </div>

      <div class="flex items-center gap-3 w-full sm:w-auto">
        <BarreRecherche
          v-model="recherche"
          placeholder="Rechercher nom, tél, e-mail..."
        />
      </div>
    </div>

    <!-- État vide du répertoire -->
    <div
      v-if="contacts.length === 0"
      class="mt-8 bg-white border border-slate-200 rounded-xl p-10 text-center"
    >
      <div class="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
        <Users class="w-6 h-6" aria-hidden="true" />
      </div>
      <h2 class="mt-4 font-display text-lg font-semibold text-slate-900">
        Aucun contact enregistré
      </h2>
      <p class="mt-1.5 text-sm text-slate-600 max-w-md mx-auto">
        Votre répertoire est vide. Ajoutez un premier contact ou restaurez la liste initiale.
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
        <RouterLink
          to="/contact/nouveau"
          class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus class="w-4 h-4" aria-hidden="true" />
          <span>Ajouter un contact</span>
        </RouterLink>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          @click="resetDemoContacts"
        >
          <RotateCcw class="w-4 h-4" aria-hidden="true" />
          <span>Restaurer les contacts initiaux</span>
        </button>
      </div>
    </div>

    <!-- Aucun résultat pour la recherche -->
    <div
      v-else-if="contactsFiltres.length === 0"
      class="mt-8 bg-white border border-slate-200 rounded-xl p-10 text-center"
    >
      <h2 class="font-display text-base font-semibold text-slate-900">
        Aucun contact ne correspond à « {{ recherche }} »
      </h2>
      <p class="mt-1 text-sm text-slate-600">
        Vérifiez l'orthographe ou effacez le filtre de recherche.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
        @click="effacerRecherche"
      >
        Effacer la recherche
      </button>
    </div>

    <!-- Grille des contacts via ListeGenerique (clé unique "id") + CarteContact -->
    <div v-else class="mt-6">
      <ListeGenerique :elements="contactsFiltres" cle="id">
        <template #default="{ element }">
          <CarteContact
            :contact="element"
            @modifier="ouvrirFicheContact"
          />
        </template>
      </ListeGenerique>
    </div>

    <!-- Pied de liste discret -->
    <div
      v-if="contacts.length > 0"
      class="mt-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500"
    >
      <span>
        {{ contactsFiltres.length }} {{ contactsFiltres.length > 1 ? 'affichés' : 'affiché' }} sur {{ contacts.length }}
      </span>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 underline underline-offset-4 transition-colors"
        @click="resetDemoContacts"
      >
        <RotateCcw class="w-3.5 h-3.5" aria-hidden="true" />
        <span>Réinitialiser la liste initiale</span>
      </button>
    </div>
  </section>
</template>
