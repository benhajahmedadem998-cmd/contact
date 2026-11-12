<template>
  <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
    <div v-if="$slots.entete" class="px-6 sm:px-8 py-5 border-b border-slate-200">
      <slot name="entete" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
