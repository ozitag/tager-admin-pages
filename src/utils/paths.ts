import { compile } from 'path-to-regexp';

import { PAGES_ROUTE_PATHS } from '../constants/paths';

export function getPageListUrl(): string {
  return PAGES_ROUTE_PATHS.PAGE_LIST;
}

export function getPageFormUrl(params: { pageId: string }): string {
  return compile(PAGES_ROUTE_PATHS.PAGE_FORM)(params);
}
