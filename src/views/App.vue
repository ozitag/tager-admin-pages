<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';

import { useTranslation } from '@tager/admin-ui';
import { MenuItemType } from '@tager/admin-layout';

import { getPageFormUrl, getPageListUrl } from '../utils/paths';

export default defineComponent({
  name: 'App',
  setup(props, context: SetupContext) {
    const { t } = useTranslation(context);

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: 'pages',
        text: t('pages:pages'),
        icon: 'viewList',
        children: [
          { text: t('pages:pages'), url: getPageListUrl() },
          {
            text: t('pages:createPage'),
            url: getPageFormUrl({ pageId: 'create' }),
          },
        ],
      },
    ];

    return {
      sidebarMenuList,
    };
  },
});
</script>

<style scoped lang="scss"></style>
