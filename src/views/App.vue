<template>
  <page-layout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </page-layout>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { PAGES_MENU_ITEM } from '../constants/menu';

export default defineComponent({
  name: 'App',
  data() {
    return {
      sidebarMenuList: [PAGES_MENU_ITEM],
    };
  },
});
</script>

<style scoped lang="scss"></style>
