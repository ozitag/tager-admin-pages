<template>
  <page
    :title="t('pages:pages')"
    :header-buttons="[
      {
        text: t('pages:createPage'),
        href: getPageFormUrl({ pageId: 'create' }),
      },
    ]"
  >
    <data-table
      :column-defs="columnDefs"
      :row-data="rowData"
      :loading="isRowDataLoading"
      :error-message="errorMessage"
      :search-query="searchQuery"
      :pagination="{
        pageSize,
        pageCount,
        pageNumber,
        disabled: isRowDataLoading,
      }"
      @change="handleChange"
    >
      <template v-slot:filters>
        <advanced-search :tags="tags" @click:tag="handleTagRemove">
          <div class="filters">
            <form-field-multi-select
              v-model="templateFilter"
              :options="templateOptionList"
              name="templateFilter"
              :searchable="true"
              :label="t('pages:templates')"
              class="filter"
            />
            <form-field-multi-select
              v-model="parentFilter"
              :options="parentOptionList"
              name="parentPage"
              :searchable="true"
              :label="t('pages:parentPage')"
              class="filter"
            />
          </div>
        </advanced-search>
      </template>
      <template v-slot:cell(actions)="{ row, rowIndex }">
        <base-button
          variant="icon"
          :title="t('pages:viewOnWebsite')"
          :href="origin + row.path"
          target="_blank"
        >
          <svg-icon name="openInBrowser"></svg-icon>
        </base-button>

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
          :title="t('pages:addChildPage')"
          :disabled="isBusy(row.id)"
          :href="getChildPageCreationFormUrl({ parentId: row.id })"
        >
          <svg-icon name="addCircle"></svg-icon>
        </base-button>

        <base-button
          variant="icon"
          :title="t('pages:edit')"
          :disabled="isBusy(row.id)"
          :href="getPageFormUrl({ pageId: row.id })"
        >
          <svg-icon name="edit"></svg-icon>
        </base-button>

        <base-button
          variant="icon"
          :title="t('pages:delete')"
          :disabled="hasChild(row.id) || isBusy(row.id)"
          @click="handleResourceDelete(row.id)"
        >
          <svg-icon name="delete"></svg-icon>
        </base-button>
      </template>
    </data-table>
  </page>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import {
  ColumnDefinition,
  getFilterParamAsStringArray,
  getFilterParams,
  OptionType,
  useDataTable,
  useTranslation,
} from '@tager/admin-ui';
import {
  useResource,
  useResourceDelete,
  useResourceMove,
} from '@tager/admin-services';

import { PageShort, TagType } from '../typings/model';
import { getPageFormUrl } from '../utils/paths';
import {
  deletePage,
  getPageList,
  getPageListWithChildren,
  getPageTemplateList,
  movePage,
} from '../services/requests';
import { getNameWithDepth } from '../utils/common';

export default defineComponent({
  name: 'PageList',
  setup(props, context) {
    const { t } = useTranslation(context);

    /** Short template list */
    const [
      fetchTemplateList,
      { data: shortTemplateList, loading: isShortTemplateListLoading },
    ] = useResource({
      fetchResource: getPageTemplateList,
      initialValue: [],
      context,
      resourceName: 'Template list',
    });

    const templateOptionList = computed(() =>
      shortTemplateList.value.map<OptionType>((template) => ({
        value: template.id,
        label: template.label,
      }))
    );

    onMounted(() => {
      fetchTemplateList();
    });

    /** Parent page list */
    const [
      fetchParentList,
      { data: shortParentList, loading: isShortParentListLoading },
    ] = useResource({
      fetchResource: getPageListWithChildren,
      initialValue: [],
      context,
      resourceName: 'Template list',
    });

    const parentOptionList = computed(() =>
      shortParentList.value.map<OptionType>((parent) => ({
        value: parent.id.toString(),
        label: getNameWithDepth(parent.title, parent.depth),
      }))
    );

    onMounted(() => {
      fetchParentList();
    });

    /** Template filter **/

    const initialTemplateFilter = computed(() => {
      const queryValue = getFilterParamAsStringArray(
        context.root.$route.query,
        'template'
      );
      return templateOptionList.value.filter((option) =>
        queryValue.some((selected) => option.value === selected)
      );
    });

    const templateFilter = ref<Array<OptionType>>(initialTemplateFilter.value);

    watch(initialTemplateFilter, () => {
      templateFilter.value = initialTemplateFilter.value;
    });

    /** Parent filter **/

    const initialParentFilter = computed(() => {
      const queryValue = getFilterParamAsStringArray(
        context.root.$route.query,
        'parent'
      );
      return parentOptionList.value.filter((option) =>
        queryValue.some((selected) => option.value === selected)
      );
    });

    const parentFilter = ref<Array<OptionType>>(initialParentFilter.value);

    watch(initialParentFilter, () => {
      parentFilter.value = initialParentFilter.value;
    });

    /** filter params **/

    const filterParams = computed(() => {
      return getFilterParams({
        template: templateFilter.value.map((template) => template.value),
        parent: parentFilter.value.map((parent) => parent.value),
      });
    });

    const {
      fetchEntityList: fetchPageList,
      isLoading: isPageListLoading,
      rowData: pageList,
      errorMessage,
      searchQuery,
      handleChange,
      pageSize,
      pageCount,
      pageNumber,
    } = useDataTable<PageShort>({
      fetchEntityList: (params) =>
        getPageList({
          query: params.searchQuery,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          ...filterParams.value,
        }),
      initialValue: [],
      context,
      resourceName: 'Page list',
      pageSize: 100,
    });

    const isRowDataLoading = computed<boolean>(
      () =>
        isPageListLoading.value ||
        isShortTemplateListLoading.value ||
        isShortParentListLoading.value
    );

    watch(filterParams, () => {
      if (!isRowDataLoading) {
        return;
      }

      const newQuery = {
        ...pick(context.root.$route.query, ['query', 'pageNumber']),
        ...filterParams.value,
      };

      if (!isEqual(context.root.$route.query, newQuery)) {
        context.root.$router.replace({ query: newQuery });
        fetchPageList();
      }
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

    function isBusy(departmentId: number): boolean {
      return (
        isDeleting(departmentId) ||
        isMoving(departmentId) ||
        isRowDataLoading.value
      );
    }

    const columnDefs: Array<ColumnDefinition<PageShort>> = [
      {
        id: 1,
        name: t('pages:title'),
        field: 'title',
        format: ({ row }) => ({
          url: getPageFormUrl({ pageId: row.id }),
          text: getNameWithDepth(row.title, row.depth),
        }),
        type: 'link',
        options: {
          shouldUseRouter: true,
        },
      },
      {
        id: 2,
        name: t('pages:path'),
        field: 'path',
        type: 'link',
        format: ({ row }) => {
          const origin =
            process.env.VUE_APP_WEBSITE_URL || window.location.origin;
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
        id: 3,
        name: t('pages:template'),
        field: 'templateName',
      },

      {
        id: 4,
        name: t('pages:actions'),
        field: 'actions',
        style: { width: '140px', textAlign: 'center', whiteSpace: 'nowrap' },
        headStyle: { width: '140px', textAlign: 'center' },
      },
    ];

    function handleTagRemove(event: TagType) {
      if (event.name === 'template') {
        templateFilter.value = templateFilter.value.filter(
          (template) => template.value !== event.value
        );
      }
      if (event.name === 'parent') {
        parentFilter.value = parentFilter.value.filter(
          (parent) => parent.value !== event.value
        );
      }
    }

    const tags = computed<Array<TagType>>(() => [
      ...templateFilter.value.map((template) => ({
        value: template.value,
        label: template.label,
        name: 'template',
        title: t('pages:templates'),
      })),
      ...parentFilter.value.map((parent) => ({
        value: parent.value,
        label: parent.label,
        name: 'parent',
        title: t('pages:parentPage'),
      })),
    ]);

    const origin = process.env.VUE_APP_WEBSITE_URL || window.location.origin;

    return {
      columnDefs,
      origin,
      getPageFormUrl,
      getChildPageCreationFormUrl,
      rowData: pageList,
      isRowDataLoading,
      errorMessage: errorMessage,
      handleResourceDelete,
      handleResourceMove,
      hasChild,
      isBusy,
      searchQuery,
      handleChange,
      pageSize,
      pageCount,
      pageNumber,
      t,
      tags,
      handleTagRemove,
      templateFilter,
      parentFilter,
      templateOptionList,
      parentOptionList,
    };
  },
});
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  margin: 0 -10px;

  &:not(:first-child) {
    margin-top: 10px;
  }

  .filter {
    padding: 10px 10px 0;
    width: 50%;
    margin: 0;
  }
}
</style>
