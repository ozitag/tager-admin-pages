import { CustomRouteConfig } from '@tager/admin-layout';

import PageList from '../views/PageList.vue';
import PageForm from '../views/PageForm/index.vue';

import { PAGES_ROUTE_PATHS } from './paths';

const HOME_BREADCRUMB = { path: '/', label: 'Home' };

export const PAGE_LIST_ROUTE: CustomRouteConfig = {
  path: PAGES_ROUTE_PATHS.PAGE_LIST,
  component: PageList,
  name: 'Page List',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { path: route.path, label: route.name },
    ],
  },
};

export const PAGE_FORM_ROUTE: CustomRouteConfig = {
  path: PAGES_ROUTE_PATHS.PAGE_FORM,
  component: PageForm,
  name: 'Page Form',
  meta: {
    getBreadcrumbs: (route) => [
      HOME_BREADCRUMB,
      { path: route.path, label: route.name },
    ],
  },
};
