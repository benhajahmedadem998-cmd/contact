<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft,
  Camera,
  Check,
  Image as ImageIcon,
  Mail,
  Phone,
  Trash2,
  AlertCircle,
} from 'lucide-vue-next';
import { useContacts } from '../composables/useContacts';
import { createPortraitSvg } from '../utils/avatars';
import BaseCarte from '../components/BaseCarte.vue';
import BaseChamp from '../components/BaseChamp.vue';
import AvatarContact from '../components/AvatarContact.vue';
import ModaleCamera from '../components/ModaleCamera.vue';

const route = useRoute();
const router = useRouter();
const { getContactById, addContact, updateContact, deleteContact } = useContacts();

const galleryInputRef = ref<HTMLInputElement | null>(null);
const afficherModaleCamera = ref(false);
const erreurPhoto = ref('');
const confirmerSuppression = ref(false);

// --- ÉTAT DU FORMULAIRE (Chapitre 5) ---
const formulaire = reactive({
  nom: '',
  prenom: '',
  telephone: '',
  email: '',
  photo: '',
});

// État "touché" par champ : n'affiche l'erreur qu'après avoir quitté le champ ou tenté l'envoi
const touche = reactive({
  nom: false,
  prenom: false,
  telephone: false,
  email: false,
});

const contactId = computed(() => {
  if (route.name === 'nouveau-contact') return null;
  const parsed = Number(route.params.id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
});

const modeCreation = computed(() => route.name === 'nouveau-contact');

const contactExistant = computed(() => {
  if (modeCreation.value || contactId.value === null) return undefined;
  return getContactById(contactId.value);
});

const introuvable = computed(() => !modeCreation.value && !contactExistant.value);

watchEffect(() => {
  if (introuvable.value) {
    document.title = 'Contact introuvable — Carnet Contacts';
  } else if (modeCreation.value) {
    document.title = 'Nouveau contact — Carnet Contacts';
  } else {
    document.title = `${formulaire.nom} ${formulaire.prenom}`.trim() + ' — Carnet Contacts';
  }
});

function initialiserFormulaire() {
  touche.nom = false;
  touche.prenom = false;
  touche.telephone = false;
  touche.email = false;
  erreurPhoto.value = '';
  confirmerSuppression.value = false;

  if (modeCreation.value) {
    Object.assign(formulaire, {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      photo: '',
    });
    return;
  }

  if (contactExistant.value) {
    Object.assign(formulaire, {
      nom: contactExistant.value.nom,
      prenom: contactExistant.value.prenom,
      telephone: contactExistant.value.telephone,
      email: contactExistant.value.email,
      photo: contactExistant.value.photo,
    });
  }
}

watch(
  () => [route.name, route.params.id],
  () => {
    initialiserFormulaire();
  },
  { immediate: true }
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// --- RÈGLES DE VALIDATION CALCULÉES (Chapitre 5, §4.2) ---
const erreurs = computed(() => {
  const e: Partial<Record<'nom' | 'prenom' | 'telephone' | 'email', string>> = {};

  if (!formulaire.nom.trim()) {
    e.nom = 'Le nom est obligatoire.';
  }
  if (!formulaire.prenom.trim()) {
    e.prenom = 'Le prénom est obligatoire.';
  }

  const tel = formulaire.telephone.trim();
  const chiffres = tel.replace(/\D/g, '');
  if (!tel) {
    e.telephone = 'Le numéro de téléphone est obligatoire.';
  } else if (chiffres.length < 6) {
    e.telephone = 'Entrez un numéro valide (au moins 6 chiffres).';
  }

  const mail = formulaire.email.trim();
  if (!mail) {
    e.email = "L'adresse e-mail est obligatoire.";
  } else if (!EMAIL_REGEX.test(mail)) {
    e.email = "Format d'adresse e-mail invalide (ex. nom@domaine.com).";
  }

  return e;
});

const formulaireValide = computed(() => Object.keys(erreurs.value).length === 0);

const telephoneNettoye = computed(() => formulaire.telephone.replace(/[^\d+]/g, ''));
const appelPossible = computed(() => telephoneNettoye.value.length >= 6);
const lienTel = computed(() => (appelPossible.value ? `tel:${telephoneNettoye.value}` : undefined));

const emailValide = computed(() => EMAIL_REGEX.test(formulaire.email.trim()));
const lienMailto = computed(() =>
  emailValide.value ? `mailto:${encodeURIComponent(formulaire.email.trim())}` : undefined
);

function ouvrirGalerie() {
  erreurPhoto.value = '';
  galleryInputRef.value?.click();
}

function surFichierGalerie(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    erreurPhoto.value = 'Le fichier choisi doit être une image (JPG, PNG, WebP...).';
    return;
  }

  if (file.size > 4 * 1024 * 1024) {
    erreurPhoto.value = "L'image dépasse 4 Mo. Choisissez une image plus légère.";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      formulaire.photo = reader.result;
      erreurPhoto.value = '';
    }
  };
  reader.onerror = () => {
    erreurPhoto.value = "Impossible de lire le fichier image sélectionné.";
  };
  reader.readAsDataURL(file);
}

function surPhotoCapturee(dataUrl: string) {
  formulaire.photo = dataUrl;
  erreurPhoto.value = '';
  afficherModaleCamera.value = false;
}

function genererPortraitParDefaut(): string {
  const palettes = [
    { bgTop: '#DBEAFE', bgBottom: '#BFDBFE', shirt: '#1D4ED8', collar: '#EFF6FF' },
    { bgTop: '#DCFCE7', bgBottom: '#BBF7D0', shirt: '#0F766E', collar: '#F0FDFA' },
    { bgTop: '#FEF3C7', bgBottom: '#FDE68A', shirt: '#B45309', collar: '#FFFBEB' },
    { bgTop: '#E0E7FF', bgBottom: '#C7D2FE', shirt: '#4338CA', collar: '#EEF2FF' },
  ];
  const seed = (formulaire.nom.length + formulaire.prenom.length) % palettes.length;
  const p = palettes[seed];
  return createPortraitSvg({
    bgTop: p.bgTop,
    bgBottom: p.bgBottom,
    skin: '#E6B89C',
    skinShadow: '#D49E7E',
    hair: '#1E293B',
    shirt: p.shirt,
    collar: p.collar,
    hairStyle: seed % 2 === 0 ? 'short' : 'waves',
  });
}

function enregistrerContact() {
  (Object.keys(touche) as Array<keyof typeof touche>).forEach((champ) => {
    touche[champ] = true;
  });

  if (!formulaireValide.value) return;

  const photoFinale = formulaire.photo || genererPortraitParDefaut();

  if (modeCreation.value) {
    addContact({
      nom: formulaire.nom,
      prenom: formulaire.prenom,
      telephone: formulaire.telephone,
      email: formulaire.email,
      photo: photoFinale,
    });
  } else if (contactId.value !== null) {
    updateContact(contactId.value, {
      nom: formulaire.nom,
      prenom: formulaire.prenom,
      telephone: formulaire.telephone,
      email: formulaire.email,
      photo: photoFinale,
    });
  }

  router.push('/');
}

function retourSansEnregistrer() {
  router.push('/');
}

function supprimerContact() {
  if (contactId.value === null) return;
  deleteContact(contactId.value);
  router.push('/');
}
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
    <!-- Retour sans enregistrement -->
    <div class="mb-6 flex items-center justify-between gap-4">
      <button
        type="button"
        class="inline-flex items-center gap-2 min-h-[40px] px-3 py-2 -ml-3 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-700"
        @click="retourSansEnregistrer"
      >
        <ArrowLeft class="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Retour</span>
      </button>
    </div>

    <!-- Contact introuvable -->
    <BaseCarte v-if="introuvable">
      <div class="p-8 text-center">
        <h1 class="font-display text-xl font-bold text-slate-900">Contact introuvable</h1>
        <p class="mt-2 text-sm text-slate-600">
          Ce contact n'existe plus ou l'identifiant demandé est invalide.
        </p>
        <button
          type="button"
          class="mt-6 inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
          @click="retourSansEnregistrer"
        >
          Retour à la liste
        </button>
      </div>
    </BaseCarte>

    <!-- Fiche contact -->
    <BaseCarte v-else>
      <template #entete>
        <h1 class="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {{ modeCreation ? 'Nouveau contact' : 'Fiche contact — Modification' }}
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          {{
            modeCreation
              ? 'Renseignez les coordonnées et choisissez une photo de profil.'
              : `${formulaire.nom || 'Contact'} ${formulaire.prenom}`.trim()
          }}
        </p>
      </template>

      <form
        class="p-6 sm:p-8 space-y-8"
        novalidate
        @submit.prevent="enregistrerContact"
        @keydown.ctrl.s.prevent="enregistrerContact"
      >
        <!-- Photo et remplacement (Galerie / Caméra) -->
        <div class="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200">
          <AvatarContact
            :src="formulaire.photo"
            :nom="formulaire.nom || 'Nouveau'"
            :prenom="formulaire.prenom || 'Contact'"
            taille="lg"
          />

          <div class="flex-1 text-center sm:text-left space-y-3">
            <div>
              <h2 class="font-display text-sm font-semibold text-slate-900">
                Photo du contact
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Importez une image depuis la galerie ou capturez une photo avec la caméra.
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-700"
                @click="ouvrirGalerie"
              >
                <ImageIcon class="w-4 h-4 text-slate-700 shrink-0" aria-hidden="true" />
                <span>Galerie</span>
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-700"
                @click="afficherModaleCamera = true"
              >
                <Camera class="w-4 h-4 text-slate-700 shrink-0" aria-hidden="true" />
                <span>Caméra</span>
              </button>
            </div>

            <input
              ref="galleryInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="surFichierGalerie"
            />

            <p v-if="erreurPhoto" class="text-xs text-red-600 flex items-center justify-center sm:justify-start gap-1.5">
              <AlertCircle class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{{ erreurPhoto }}</span>
            </p>
          </div>
        </div>

        <!-- Champs via BaseChamp (v-model.trim + erreurs calculées + état touche) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <BaseChamp
            id="contact-nom"
            v-model.trim="formulaire.nom"
            type="text"
            autocomplete="family-name"
            placeholder="Ex. Ben Ali"
            obligatoire
            :erreur="touche.nom ? erreurs.nom : ''"
            @quitter="touche.nom = true"
          >
            Nom
          </BaseChamp>

          <BaseChamp
            id="contact-prenom"
            v-model.trim="formulaire.prenom"
            type="text"
            autocomplete="given-name"
            placeholder="Ex. Ahmed"
            obligatoire
            :erreur="touche.prenom ? erreurs.prenom : ''"
            @quitter="touche.prenom = true"
          >
            Prénom
          </BaseChamp>

          <BaseChamp
            id="contact-telephone"
            v-model.trim="formulaire.telephone"
            type="tel"
            autocomplete="tel"
            placeholder="Ex. 22 345 678"
            obligatoire
            monospace
            :erreur="touche.telephone ? erreurs.telephone : ''"
            @quitter="touche.telephone = true"
          >
            Téléphone
          </BaseChamp>

          <BaseChamp
            id="contact-email"
            v-model.trim="formulaire.email"
            type="email"
            autocomplete="email"
            placeholder="Ex. ahmed.benali@example.com"
            obligatoire
            :erreur="touche.email ? erreurs.email : ''"
            @quitter="touche.email = true"
          >
            E-mail
          </BaseChamp>
        </div>

        <!-- Actions rapides : Appeler (tel:) et E-mail (mailto:) -->
        <div class="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs font-medium text-slate-500 mb-2">Actions rapides</p>
            <div class="flex flex-wrap items-center gap-2.5">
              <a
                v-if="appelPossible"
                :href="lienTel"
                class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-emerald-700"
              >
                <Phone class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Appeler</span>
              </a>
              <span
                v-else
                aria-disabled="true"
                title="Saisissez un numéro de téléphone valide pour appeler"
                class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed whitespace-nowrap"
              >
                <Phone class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Appeler</span>
              </span>

              <a
                v-if="emailValide"
                :href="lienMailto"
                class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-sky-700"
              >
                <Mail class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>E-mail</span>
              </a>
              <span
                v-else
                aria-disabled="true"
                title="Saisissez une adresse e-mail valide pour écrire"
                class="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed whitespace-nowrap"
              >
                <Mail class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>E-mail</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Pied de formulaire : Supprimer / Retour / Enregistrer -->
        <div class="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <template v-if="!modeCreation">
              <div v-if="confirmerSuppression" class="flex items-center gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center min-h-[40px] px-3.5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap"
                  @click="supprimerContact"
                >
                  Confirmer la suppression
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center min-h-[40px] px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                  @click="confirmerSuppression = false"
                >
                  Annuler
                </button>
              </div>
              <button
                v-else
                type="button"
                class="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                @click="confirmerSuppression = true"
              >
                <Trash2 class="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Supprimer</span>
              </button>
            </template>
          </div>

          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center min-h-[42px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-700"
              @click="retourSansEnregistrer"
            >
              Retour
            </button>

            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              <Check class="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>
      </form>
    </BaseCarte>

    <ModaleCamera
      v-if="afficherModaleCamera"
      @capture="surPhotoCapturee"
      @fermer="afficherModaleCamera = false"
    />
  </section>
</template>
