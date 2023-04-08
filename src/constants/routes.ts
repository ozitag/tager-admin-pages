import type { RouteRecordRaw } from "vue-router";

import PageList from "../views/PageList";
import PageForm from "../views/PageForm";

import { PAGES_ROUTE_PATHS } from "./paths";

export const PAGE_LIST_ROUTE: RouteRecordRaw = {
  path: PAGES_ROUTE_PATHS.PAGE_LIST,
  component: PageList,
  name: "Page List",
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: "/", text: i18n.t("pages:home") },
      { url: route.path, text: i18n.t("pages:pageList") }
    ]
  }
};

export const PAGE_FORM_ROUTE: RouteRecordRaw = {
  path: PAGES_ROUTE_PATHS.PAGE_FORM,
  component: PageForm,
  name: "Page Form",
  meta: {
    getBreadcrumbs: (route, i18n) => [
      { url: "/", text: i18n.t("pages:home") },
      { url: PAGE_LIST_ROUTE.path, text: i18n.t("pages:pageList") },
      { url: route.path, text: i18n.t("pages:pageForm") }
    ]
  }
};
