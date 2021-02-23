import { CustomRouteConfig } from '@tager/admin-layout';

import PageList from '../views/PageList.vue';
import PageForm from '../views/PageForm';

import { PAGES_ROUTE_PATHS } from './paths';

export const PAGE_LIST_ROUTE: CustomRouteConfig = {
  path: PAGES_ROUTE_PATHS.PAGE_LIST,
  component: PageList,
  name: 'Page List',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('pages:home') },
      { url: route.path, text: t('pages:pageList') },
    ],
  },
};

export const PAGE_FORM_ROUTE: CustomRouteConfig = {
  path: PAGES_ROUTE_PATHS.PAGE_FORM,
  component: PageForm,
  name: 'Page Form',
  meta: {
    getBreadcrumbs: (route, t) => [
      { url: '/', text: t('pages:home') },
      { url: PAGE_LIST_ROUTE.path, text: t('pages:pageList') },
      { url: route.path, text: t('pages:pageForm') },
    ],
  },
};
