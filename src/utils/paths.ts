import { compile } from 'path-to-regexp';

import { PAGES_ROUTE_PATHS } from '../constants/paths';

export function getPageListUrl(filter?: { template: string }): string {
  const result = compile(PAGES_ROUTE_PATHS.PAGE_LIST)();

  if (filter) {
    const query = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      query.append('filter[' + key + ']', value);
    });

    return result + '?' + query;
  } else {
    return result;
  }
}

export function getPageFormUrl(params: { pageId: string | number }): string {
  return compile(PAGES_ROUTE_PATHS.PAGE_FORM)(params);
}
