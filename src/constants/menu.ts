import { MenuItemType } from '@tager/admin-layout';
import { getPageFormUrl, getPageListUrl } from '../utils/paths';

export const PAGES_MENU_ITEM: MenuItemType = {
  id: 'pages',
  name: 'Pages',
  path: '',
  icon: 'viewList',
  children: [
    { name: 'Pages', path: getPageListUrl() },
    { name: 'Create page', path: getPageFormUrl({ pageId: 'create' }) },
  ],
};
