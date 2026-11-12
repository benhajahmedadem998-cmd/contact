<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Camera, Upload, AlertCircle } from 'lucide-vue-next';
import BaseModale from './BaseModale.vue';

const emit = defineEmits({
  capture: (dataUrl: string) => typeof dataUrl === 'string' && dataUrl.startsWith('data:image/'),
  fermer: null,
});

const videoRef = ref<HTMLVideoElement | null>(null);
const fallbackInputRef = ref<HTMLInputElement | null>(null);
const chargement = ref(true);
const messageErreur = ref('');
const fluxPret = ref(false);
let fluxActif: MediaStream | null = null;

function arreterFluxCamera() {
  if (fluxActif) {
    fluxActif.getTracks().forEach((track) => track.stop());
    fluxActif = null;
  }
}

async function demarrerCamera() {
  chargement.value = true;
  messageErreur.value = '';
  fluxPret.value = false;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    chargement.value = false;
    messageErreur.value =
      "La capture vidéo en direct n'est pas prise en charge par ce navigateur. Utilisez l'appareil photo natif ou la galerie ci-dessous.";
    return;
  }

  try {
    fluxActif = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      audio: false,
    });

    if (videoRef.value) {
      videoRef.value.srcObject = fluxActif;
      await videoRef.value.play();
      fluxPret.value = true;
    }
  } catch (err) {
    const domErr = err as DOMException;
    if (domErr?.name === 'NotAllowedError' || domErr?.name === 'PermissionDeniedError') {
      messageErreur.value =
        "L'accès à la caméra a été refusé. Autorisez la caméra dans votre navigateur ou utilisez l'option de repli ci-dessous.";
    } else if (domErr?.name === 'NotFoundError' || domErr?.name === 'DevicesNotFoundError') {
      messageErreur.value =
        "Aucune caméra détectée sur cet appareil. Vous pouvez sélectionner une image depuis votre appareil.";
    } else {
      messageErreur.value =
        "Impossible d'accéder à la caméra pour le moment. Utilisez la solution de repli ci-dessous.";
    }
  } finally {
    chargement.value = false;
  }
}

function capturerPhoto() {
  const video = videoRef.value;
  if (!video || !fluxPret.value) return;

  const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const offsetX = Math.max(0, (video.videoWidth - size) / 2);
  const offsetY = Math.max(0, (video.videoHeight - size) / 2);
  ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  arreterFluxCamera();
  emit('capture', dataUrl);
}

function ouvrirCaptureNative() {
  fallbackInputRef.value?.click();
}

function surFichierNatif(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    messageErreur.value = 'Veuillez sélectionner un fichier image valide.';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      arreterFluxCamera();
      emit('capture', reader.result);
    }
  };
  reader.readAsDataURL(file);
}

function fermerModale() {
  arreterFluxCamera();
  emit('fermer');
}

onMounted(() => {
  demarrerCamera();
});

onUnmounted(() => {
  arreterFluxCamera();
});
</script>

<template>
  <BaseModale titre-label-id="camera-modal-title" @fermer="fermerModale">
    <template #titre>Prendre une photo</template>

    <div class="space-y-4">
      <div
        v-if="chargement"
        class="aspect-square w-full rounded-lg bg-slate-100 flex flex-col items-center justify-center gap-2 text-sm text-slate-600"
      >
        <Camera class="w-8 h-8 text-slate-400" aria-hidden="true" />
        <span>Initialisation de la caméra...</span>
      </div>

      <div
        v-else-if="messageErreur"
        class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3"
      >
        <div class="flex items-start gap-2.5">
          <AlertCircle class="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <p class="leading-relaxed">{{ messageErreur }}</p>
        </div>
        <div class="pt-1">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 w-full min-h-[40px] px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-amber-300 hover:bg-amber-100/60 rounded-lg transition-colors whitespace-nowrap"
            @click="ouvrirCaptureNative"
          >
            <Upload class="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Appareil photo natif / Choisir une image</span>
          </button>
        </div>
      </div>

      <div
        v-show="fluxPret && !messageErreur"
        class="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-950"
      >
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="w-full h-full object-cover"
        />
      </div>

      <input
        ref="fallbackInputRef"
        type="file"
        accept="image/*"
        capture="user"
        class="hidden"
        @change="surFichierNatif"
      />
    </div>

    <template #actions>
      <button
        type="button"
        class="inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
        @click="fermerModale"
      >
        Annuler
      </button>
      <button
        v-if="fluxPret && !messageErreur"
        type="button"
        class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
        @click="capturerPhoto"
      >
        <Camera class="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Capturer</span>
      </button>
    </template>
  </BaseModale>
</template>
