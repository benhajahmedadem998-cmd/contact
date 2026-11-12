import { ref, watch } from 'vue';
import type { Contact, ContactFormData } from '../types/contact';
import { createPortraitSvg } from '../utils/avatars';

const STORAGE_KEY = 'tp_vuejs_contacts_v1';

function buildInitialContacts(): Contact[] {
  return [
    {
      id: 1,
      nom: 'Ben Ali',
      prenom: 'Ahmed',
      telephone: '22 345 678',
      email: 'ahmed.benali@example.com',
      photo: createPortraitSvg({
        bgTop: '#DBEAFE',
        bgBottom: '#BFDBFE',
        skin: '#E6B89C',
        skinShadow: '#D49E7E',
        hair: '#1E293B',
        shirt: '#1D4ED8',
        collar: '#EFF6FF',
        hairStyle: 'parted',
        glasses: true,
        beard: true,
      }),
    },
    {
      id: 2,
      nom: 'Trabelsi',
      prenom: 'Sarra',
      telephone: '98 765 432',
      email: 'sarra.trabelsi@example.com',
      photo: createPortraitSvg({
        bgTop: '#FCE7F3',
        bgBottom: '#FBCFE8',
        skin: '#F1C6AD',
        skinShadow: '#DFAA8B',
        hair: '#3B2314',
        shirt: '#0F766E',
        collar: '#F0FDFA',
        hairStyle: 'waves',
      }),
    },
    {
      id: 3,
      nom: 'Gharbi',
      prenom: 'Mohamed',
      telephone: '55 234 567',
      email: 'mohamed.gharbi@example.com',
      photo: createPortraitSvg({
        bgTop: '#DCFCE7',
        bgBottom: '#BBF7D0',
        skin: '#D6A17E',
        skinShadow: '#BE8763',
        hair: '#111827',
        shirt: '#334155',
        collar: '#F8FAFC',
        hairStyle: 'buzz',
        beard: true,
      }),
    },
    {
      id: 4,
      nom: 'Jaziri',
      prenom: 'Ines',
      telephone: '29 456 123',
      email: 'ines.jaziri@example.com',
      photo: createPortraitSvg({
        bgTop: '#FEF3C7',
        bgBottom: '#FDE68A',
        skin: '#F3CCB5',
        skinShadow: '#DFB095',
        hair: '#29170B',
        shirt: '#B45309',
        collar: '#FFFBEB',
        hairStyle: 'bob',
        glasses: true,
      }),
    },
    {
      id: 5,
      nom: 'Mansouri',
      prenom: 'Yasmine',
      telephone: '52 819 304',
      email: 'yasmine.mansouri@example.com',
      photo: createPortraitSvg({
        bgTop: '#E0E7FF',
        bgBottom: '#C7D2FE',
        skin: '#E7B99D',
        skinShadow: '#CE9B7D',
        hair: '#1F140E',
        shirt: '#4338CA',
        collar: '#EEF2FF',
        hairStyle: 'curly',
      }),
    },
    {
      id: 6,
      nom: 'Khelifi',
      prenom: 'Sami',
      telephone: '94 612 785',
      email: 'sami.khelifi@example.com',
      photo: createPortraitSvg({
        bgTop: '#E2E8F0',
        bgBottom: '#CBD5E1',
        skin: '#DEAE8E',
        skinShadow: '#C79270',
        hair: '#27272A',
        shirt: '#0369A1',
        collar: '#F0F9FF',
        hairStyle: 'short',
      }),
    },
  ];
}

function loadContacts(): Contact[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial seed data if localStorage is unavailable or malformed
  }
  return buildInitialContacts();
}

const contacts = ref<Contact[]>(loadContacts());

watch(
  contacts,
  (updated) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors cleanly
    }
  },
  { deep: true }
);

export function useContacts() {
  function getContactById(id: number): Contact | undefined {
    return contacts.value.find((c) => c.id === id);
  }

  function addContact(data: ContactFormData): Contact {
    const nextId =
      contacts.value.length > 0
        ? Math.max(...contacts.value.map((c) => c.id)) + 1
        : 1;
    const created: Contact = {
      id: nextId,
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      telephone: data.telephone.trim(),
      email: data.email.trim(),
      photo: data.photo,
    };
    contacts.value.unshift(created);
    return created;
  }

  function updateContact(id: number, data: ContactFormData): boolean {
    const index = contacts.value.findIndex((c) => c.id === id);
    if (index === -1) return false;

    contacts.value[index] = {
      id,
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      telephone: data.telephone.trim(),
      email: data.email.trim(),
      photo: data.photo,
    };
    return true;
  }

  function deleteContact(id: number): boolean {
    const index = contacts.value.findIndex((c) => c.id === id);
    if (index === -1) return false;
    contacts.value.splice(index, 1);
    return true;
  }

  function resetDemoContacts(): void {
    contacts.value = buildInitialContacts();
  }

  return {
    contacts,
    getContactById,
    addContact,
    updateContact,
    deleteContact,
    resetDemoContacts,
  };
}
