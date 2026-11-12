<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppEnTete from './components/AppEnTete.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <AppEnTete />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
