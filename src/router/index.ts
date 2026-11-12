import { createRouter, createWebHistory } from 'vue-router';
import ListeContacts from '../views/ListeContacts.vue';
import DetailContact from '../views/DetailContact.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'liste-contacts',
      component: ListeContacts,
    },
    {
      path: '/contact/nouveau',
      name: 'nouveau-contact',
      component: DetailContact,
    },
    {
      path: '/contact/:id',
      name: 'detail-contact',
      component: DetailContact,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
