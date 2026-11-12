export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  photo: string;
}

export type ContactFormData = Omit<Contact, 'id'>;
