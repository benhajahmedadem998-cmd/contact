<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  taille: {
    type: String,
    default: 'md',
    validator: (v: string) => ['sm', 'md', 'lg'].includes(v),
  },
});

const imageEnErreur = ref(false);

watch(
  () => props.src,
  () => {
    imageEnErreur.value = false;
  }
);

const initiales = computed(() => {
  const premiere = props.prenom.trim().charAt(0) || '';
  const nomLettre = props.nom.trim().charAt(0) || '';
  return `${nomLettre}${premiere}`.toUpperCase() || 'CT';
});

const classeTaille = computed(() => {
  if (props.taille === 'lg') return 'w-28 h-28 text-2xl';
  if (props.taille === 'sm') return 'w-10 h-10 text-xs';
  return 'w-14 h-14 text-sm';
});

const afficherImage = computed(() => Boolean(props.src) && !imageEnErreur.value);
</script>

<template>
  <div
    class="relative rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center select-none"
    :class="classeTaille"
  >
    <img
      v-if="afficherImage"
      :src="src"
      :alt="`Photo de ${prenom} ${nom}`"
      referrerpolicy="no-referrer"
      class="w-full h-full object-cover"
      @error="imageEnErreur = true"
    />
    <span
      v-else
      class="font-display font-semibold text-slate-600 tracking-wide"
      aria-hidden="true"
    >
      {{ initiales }}
    </span>
  </div>
</template>
