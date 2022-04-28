<template>
  <ul class="tab-list">
    <li
      v-for="tab of tabList"
      :key="tab.id"
      :class="['tab', { active: tabId === tab.id }]"
    >
      <button class="tab-button" type="button" @click="handleTabClick(tab)">
        {{ tab.label }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { TabType } from "./TabList.types";

interface Props {
  tabList: Array<TabType>;
  tabId: string;
}

export default defineComponent({
  name: "TabList",
  props: {
    tabList: {
      type: Array as () => Array<TabType>,
      required: true,
    },
    tabId: {
      type: String,
      required: true,
    },
  },
  emits: ["update:tab-id"],
  setup(props: Props, context) {
    function handleTabClick(tab: TabType) {
      if (props.tabId === tab.id) return;

      context.emit("update:tab-id", tab.id);
    }

    return {
      handleTabClick,
    };
  },
});
</script>

<style scoped lang="scss">
.tab-list {
  display: flex;
  border-bottom: 1px solid #eee;
  margin: -1rem -1rem 1.5rem -1rem;
}

.tab {
  display: block;
  //margin-top: 3px;
  border-top: 3px solid transparent;

  margin-bottom: -1px;

  &:not(.active):hover {
    color: var(--secondary);
  }

  &.active {
    background-color: #fff;
    border-top-color: var(--primary);

    &:not(:first-child) .tab-button {
      border-left-color: #eee;
    }

    .tab-button {
      cursor: default;
      border-right-color: #eee;
    }
  }
}

.tab-button {
  padding: 0.7rem 2rem;
  border-right: 1px solid transparent;
  border-left: 1px solid transparent;
  color: inherit;
}
</style>
