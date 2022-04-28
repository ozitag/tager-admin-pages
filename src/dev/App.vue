<template>
  <PageLayout :sidebar-menu-list="sidebarMenuList">
    <router-view />
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { type MenuItemType, PageLayout } from "@tager/admin-layout";
import { useI18n } from "@tager/admin-services";
import { ViewListIcon } from "@tager/admin-ui";

import { getPageFormUrl, getPageListUrl } from "../utils/paths";

export default defineComponent({
  name: "App",
  components: { PageLayout },
  setup() {
    const i18n = useI18n();

    const sidebarMenuList: Array<MenuItemType> = [
      {
        id: "pages",
        text: i18n.t("pages:pages"),
        icon: ViewListIcon,
        children: [
          { text: i18n.t("pages:pages"), url: getPageListUrl() },
          {
            text: i18n.t("pages:createPage"),
            url: getPageFormUrl({ pageId: "create" }),
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
