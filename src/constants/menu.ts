import { MenuItemType } from '@tager/admin-layout';
import { getPageFormUrl, getPageListUrl } from '../utils/paths';

export const PAGES_MENU_ITEM: MenuItemType = {
  id: 'pages',
  text: 'Pages',
  icon: 'viewList',
  children: [
    { text: 'Pages', url: getPageListUrl() },
    { text: 'Create page', url: getPageFormUrl({ pageId: 'create' }) },
  ],
};
