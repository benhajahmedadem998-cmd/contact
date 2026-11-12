<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const modele = defineModel<string>({ default: '' });

defineProps({
  id: {
    type: String,
    required: true,
  },
  erreur: {
    type: String,
    default: '',
  },
  obligatoire: {
    type: Boolean,
    default: false,
  },
  monospace: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  quitter: null,
  saisie: null,
});
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-slate-800 mb-1.5">
      <slot />
      <span v-if="obligatoire" class="text-red-600 ml-0.5" aria-hidden="true">*</span>
    </label>
    <input
      :id="id"
      v-model="modele"
      v-bind="$attrs"
      :required="obligatoire"
      class="w-full min-h-[42px] px-3.5 py-2 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors"
      :class="[
        monospace ? 'font-mono-tabular' : '',
        erreur
          ? 'border-red-500 focus:border-red-600 focus:ring-red-600/15'
          : 'border-slate-300 focus:border-blue-700 focus:ring-blue-700/15',
      ]"
      @blur="emit('quitter')"
      @input="emit('saisie')"
    />
    <p v-if="erreur" class="mt-1.5 text-xs text-red-600">{{ erreur }}</p>
  </div>
</template>
