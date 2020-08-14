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
      <template v-slot:cell(actions)="{ row }">
        <base-button
          variant="icon"
          title="Edit"
          :disabled="isEntityDeleting(row.id) || isRowDataLoading"
          :href="getPageFormUrl({ pageId: row.id })"
        >
          <svg-icon name="edit"></svg-icon>
        </base-button>
        <base-button
          variant="icon"
          title="Add child page"
          :disabled="isEntityDeleting(row.id) || isRowDataLoading"
          :href="getChildPageCreationFormUrl({ parentId: row.id })"
        >
          <svg-icon name="addCircle"></svg-icon>
        </base-button>
        <base-button
          variant="icon"
          title="Delete"
          :disabled="isEntityDeleting(row.id) || isRowDataLoading"
          @click="handleEntityDelete(row.id)"
        >
          <svg-icon name="delete"></svg-icon>
        </base-button>
      </template>
    </base-table>
  </page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api';
import { ColumnDefinition } from '@tager/admin-ui';

import { PageShort } from '../typings/model';
import { getPageFormUrl } from '../utils/paths';
import { deletePage, getPageList } from '../services/requests';
import useEntityDelete from '../hooks/useEntityDelete';
import useResource from '../hooks/useResource';

const COLUMN_DEFS: Array<ColumnDefinition<PageShort>> = [
  {
    id: 1,
    name: 'ID',
    field: 'id',
    style: { width: '50px', textAlign: 'center' },
    headStyle: { width: '50px', textAlign: 'center' },
  },
  { id: 3, name: 'Title', field: 'title' },
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
    name: 'Actions',
    field: 'actions',
    style: { width: '120px', textAlign: 'center', whiteSpace: 'nowrap' },
    headStyle: { width: '120px', textAlign: 'center' },
  },
];

export default defineComponent({
  name: 'PageList',
  setup(props, context) {
    const [fetchPageList, { data, loading, error }] = useResource<
      Array<PageShort>
    >({
      fetchResource: getPageList,
      initialValue: [],
    });

    onMounted(() => {
      fetchPageList();
    });

    const { handleEntityDelete, isDeleting } = useEntityDelete({
      deleteEntity: deletePage,
      entityName: 'Page',
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

    return {
      columnDefs: COLUMN_DEFS,
      getPageFormUrl,
      getChildPageCreationFormUrl,
      rowData: data,
      isRowDataLoading: loading,
      errorMessage: error,
      isEntityDeleting: isDeleting,
      handleEntityDelete,
    };
  },
});
</script>
