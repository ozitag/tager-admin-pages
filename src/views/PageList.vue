<template>
  <page
    title="Pages"
    :header-buttons="[
      { text: 'Create page', href: getPageFormUrl({ pageId: 'create' }) },
    ]"
  >
    <base-table
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      :error-message="errorMessage"
    >
      <template v-slot:cell(actions)="{ row, rowIndex }">
        <base-button
          variant="icon"
          :disabled="isBusy(row.id) || rowIndex === rowData.length - 1"
          @click="handleResourceMove(row.id, 'down')"
        >
          <svg-icon name="south" />
        </base-button>

        <base-button
          variant="icon"
          :disabled="isBusy(row.id) || rowIndex === 0"
          @click="handleResourceMove(row.id, 'up')"
        >
          <svg-icon name="north" />
        </base-button>

        <base-button
          variant="icon"
          title="Edit"
          :disabled="isBusy(row.id)"
          :href="getPageFormUrl({ pageId: row.id })"
        >
          <svg-icon name="edit"></svg-icon>
        </base-button>
        <base-button
          variant="icon"
          title="Add child page"
          :disabled="isBusy(row.id)"
          :href="getChildPageCreationFormUrl({ parentId: row.id })"
        >
          <svg-icon name="addCircle"></svg-icon>
        </base-button>
        <base-button
          variant="icon"
          title="Delete"
          :disabled="hasChild(row.id) || isBusy(row.id)"
          @click="handleResourceDelete(row.id)"
        >
          <svg-icon name="delete"></svg-icon>
        </base-button>
      </template>
    </base-table>
  </page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from '@vue/composition-api';

import { ColumnDefinition } from '@tager/admin-ui';
import {
  useResource,
  useResourceDelete,
  useResourceMove,
} from '@tager/admin-services';

import { PageShort } from '../typings/model';
import { getPageFormUrl } from '../utils/paths';
import { deletePage, getPageList, movePage } from '../services/requests';
import { getNameWithDepth } from '../utils/common';

const COLUMN_DEFS: Array<ColumnDefinition<PageShort>> = [
  {
    id: 1,
    name: 'ID',
    field: 'id',
    style: { width: '50px', textAlign: 'center' },
    headStyle: { width: '50px', textAlign: 'center' },
  },
  {
    id: 3,
    name: 'Title',
    field: 'title',
    format: ({ row }) => getNameWithDepth(row.title, row.depth),
  },
  {
    id: 4,
    name: 'Path',
    field: 'path',
    type: 'link',
    format: ({ row }) => {
      const origin = process.env.VUE_APP_WEBSITE_URL || window.location.origin;
      return {
        url: origin + row.path,
        text: row.path,
      };
    },
    options: {
      shouldOpenNewTab: true,
    },
  },
  {
    id: 5,
    name: 'Template',
    field: 'templateName',
  },

  {
    id: 6,
    name: 'Actions',
    field: 'actions',
    style: { width: '140px', textAlign: 'center', whiteSpace: 'nowrap' },
    headStyle: { width: '140px', textAlign: 'center' },
  },
];

export default defineComponent({
  name: 'PageList',
  setup(props, context) {
    const [
      fetchPageList,
      { data: pageList, loading: isPageListLoading, error },
    ] = useResource<Array<PageShort>>({
      fetchResource: getPageList,
      initialValue: [],
      context,
      resourceName: 'Page list',
    });

    onMounted(() => {
      fetchPageList();
    });

    const { handleResourceDelete, isDeleting } = useResourceDelete({
      deleteResource: deletePage,
      resourceName: 'Page',
      onSuccess: fetchPageList,
      context,
    });

    const { isMoving, handleResourceMove } = useResourceMove({
      moveResource: movePage,
      resourceName: 'Page',
      onSuccess: fetchPageList,
      context,
    });

    function getChildPageCreationFormUrl(params: { parentId: number }) {
      const searchParams = new URLSearchParams({
        parentId: String(params.parentId),
      });
      const searchString = '?' + searchParams.toString();

      const path = getPageFormUrl({ pageId: 'create' });

      return path + searchString;
    }

    function hasChild(parentId: number): boolean {
      return pageList.value.some((page) => page.parent?.id === parentId);
    }

    const isRowDataLoading = computed<boolean>(() => isPageListLoading.value);

    function isBusy(departmentId: number): boolean {
      return (
        isDeleting(departmentId) ||
        isMoving(departmentId) ||
        isRowDataLoading.value
      );
    }

    return {
      columnDefs: COLUMN_DEFS,
      getPageFormUrl,
      getChildPageCreationFormUrl,
      rowData: pageList,
      isRowDataLoading: isPageListLoading,
      errorMessage: error,
      handleResourceDelete,
      handleResourceMove,
      hasChild,
      isBusy,
    };
  },
});
</script>
