import Vue, { CreateElement } from 'vue';
import VueCompositionApi, { createApp } from '@vue/composition-api';

import { configStore, i18n } from '@tager/admin-services';
import { AdminUiPlugin } from '@tager/admin-ui';
import { AdminLayoutPlugin, createRouter } from '@tager/admin-layout';

import '@tager/admin-ui/dist/admin-ui.css';

import EN from './locales/en';
import RU from './locales/ru';
import config from './config/config.json';
import App from './views/App.vue';
import { PAGE_FORM_ROUTE, PAGE_LIST_ROUTE } from './constants/routes';

configStore.setConfig(config);

const router = createRouter(
  {
    routes: [PAGE_LIST_ROUTE, PAGE_FORM_ROUTE],
  },
  { useTitleSync: false }
);

i18n.addTranslations('en', 'pages', EN);
i18n.addTranslations('ru', 'pages', RU);

i18n.init({ debug: false, lng: 'en' }).then(() => {
  Vue.use(VueCompositionApi);

  const app = createApp({
    router,
    render: (h: CreateElement) => h(App),
  });

  app.use(i18n.getPlugin());
  app.use(AdminUiPlugin);
  app.use(AdminLayoutPlugin);

  app.mount('#app');
});
