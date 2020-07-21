import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { configStore, i18n } from '@tager/admin-services';
import { AdminUiPlugin } from '@tager/admin-ui';
import { AdminLayoutPlugin, createRouter } from '@tager/admin-layout';

import '@tager/admin-ui/dist/admin-ui.css';

import config from './config/config.json';
import App from './views/App.vue';
import { PAGE_FORM_ROUTE, PAGE_LIST_ROUTE } from './constants/routes';

configStore.setConfig(config);

Vue.use(AdminUiPlugin);
Vue.use(AdminLayoutPlugin);
Vue.use(VueCompositionAPI);

const router = createRouter(
  {
    routes: [PAGE_LIST_ROUTE, PAGE_FORM_ROUTE],
  },
  { useTitleSync: false }
);

i18n.init().then(() => {
  Vue.use(i18n.getPlugin());

  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
});
