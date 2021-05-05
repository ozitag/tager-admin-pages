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
              label="Шаблоны"
            />
          </div>
        </advanced-search>
      </template>
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
          :title="t('pages:edit')"
          :disabled="isBusy(row.id)"
          :href="getPageFormUrl({ pageId: row.id })"
        >
          <svg-icon name="edit"></svg-icon>
        </base-button>

        <base-button
          variant="icon"
          :title="t('pages:AddChildPage')"
          :disabled="isBusy(row.id)"
          :href="getChildPageCreationFormUrl({ parentId: row.id })"
        >
          <svg-icon name="addCircle"></svg-icon>
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

    /** Category filter **/

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

    /** filter params **/

    const filterParams = computed(() => {
      return getFilterParams({
        template: templateFilter.value.map((template) => template.value),
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

    watch(filterParams, () => {
      const newQuery = {
        ...filterParams.value,
        query: (context.root.$route.query.query ?? '') as string,
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

    const isRowDataLoading = computed<boolean>(
      () => isPageListLoading.value || isShortTemplateListLoading.value
    );

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
        name: 'ID',
        field: 'id',
        style: { width: '50px', textAlign: 'center' },
        headStyle: { width: '50px', textAlign: 'center' },
      },
      {
        id: 3,
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
        id: 4,
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
        id: 5,
        name: t('pages:template'),
        field: 'templateName',
      },

      {
        id: 6,
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
    }

    const tags = computed<Array<TagType>>(() => [
      ...templateFilter.value.map((template) => ({
        value: template.value,
        label: template.label,
        name: 'template',
        title: 'Шаблоны',
      })),
    ]);

    return {
      columnDefs,
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
      templateOptionList,
    };
  },
});
</script>
