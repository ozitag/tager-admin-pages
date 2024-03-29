<template>
  <Page
    :title="$i18n.t('pages:pages')"
    :header-buttons="[
      {
        text: $i18n.t('pages:createPage'),
        href: getPageFormUrl({ pageId: 'create' }),
      },
    ]"
  >
    <DataTable
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
      :sort="{ options: sortOptions, value: sortValue }"
      @change="handleChange"
    >
      <template #filters>
        <AdvancedSearch :tags="tags" @click:tag="handleTagRemove">
          <div class="row-cols-3">
            <FormFieldMultiSelect
              v-model:selected-options="templateFilter"
              :options="templateOptionList"
              name="templateFilter"
              :searchable="true"
              :label="$i18n.t('pages:templates')"
              container-class="filter"
            />
            <FormFieldMultiSelect
              v-model:selected-options="parentFilter"
              :options="parentOptionList"
              name="parentPage"
              :searchable="true"
              :label="$i18n.t('pages:parentPage')"
              container-class="filter"
            />
            <FormFieldMultiSelect
              v-model:selected-options="statusFilter"
              :options="statusOptionList"
              name="statusFilter"
              :label="$i18n.t('pages:status')"
              container-class="filter"
            />
          </div>
        </AdvancedSearch>
      </template>

      <template #cell(status)="{ row }">
        <div class="status">
          <span :class="{status: true, 'status-draft' : row.status === 'DRAFT'}">{{ statusLabels[row.status] }}</span>
          <span v-if="row.hiddenFromSeoIndexation" class="status-hidden-seo">
            {{ $i18n.t('pages:hiddenFromSeoIndexation') }}
          </span>
        </div>
      </template>

      <template #cell(actions)="{ row, rowIndex }">
        <BaseButton
          variant="icon"
          :title="$i18n.t('pages:viewOnWebsite')"
          :href="origin + row.path"
          target="_blank"
        >
          <OpenInBrowserIcon />
        </BaseButton>

        <BaseButton
          variant="icon"
          :title="$i18n.t('pages:edit')"
          :disabled="isBusy(row.id)"
          :href="getPageFormUrl({ pageId: row.id })"
        >
          <EditIcon />
        </BaseButton>

        <BaseButton
          v-if="sortValue === 'default'"
          variant="icon"
          :disabled="isBusy(row.id) || rowIndex === rowData.length - 1"
          @click="handleResourceMove(row.id, 'down')"
        >
          <SouthIcon />
        </BaseButton>

        <BaseButton
          v-if="sortValue === 'default'"
          variant="icon"
          :disabled="isBusy(row.id) || rowIndex === 0"
          @click="handleResourceMove(row.id, 'up')"
        >
          <NorthIcon />
        </BaseButton>

        <BaseButton
          variant="icon"
          :title="$i18n.t('pages:addChildPage')"
          :disabled="isBusy(row.id)"
          :href="getChildPageCreationFormUrl({ parentId: row.id })"
        >
          <AddCircleIcon />
        </BaseButton>

        <BaseButton
          variant="icon"
          :title="$i18n.t('pages:clone')"
          :disabled="isBusy(row.id)"
          @click="handleResourceClone(row.id)"
        >
          <ContentCopyIcon />
        </BaseButton>

        <BaseButton
          variant="icon"
          :title="$i18n.t('pages:delete')"
          :disabled="hasChild(row.id) || isBusy(row.id)"
          @click="handleResourceDelete(row.id)"
        >
          <DeleteIcon />
        </BaseButton>
      </template>
    </DataTable>
  </Page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import isEqual from "lodash.isequal";
import pick from "lodash.pick";
import { useRoute, useRouter } from "vue-router";

import {
  AddCircleIcon,
  AdvancedSearch,
  BaseButton,
  ContentCopyIcon,
  DataTable,
  DeleteIcon,
  EditIcon,
  FormFieldMultiSelect,
  getFilterParamAsStringArray,
  getFilterParams,
  NorthIcon,
  OpenInBrowserIcon,
  type OptionType,
  SouthIcon,
  useDataTable
} from "@tager/admin-ui";
import {
  useResource,
  useResourceDelete,
  useResourceMove,
  useResourceClone,
  useI18n, getNameWithDepth
} from "@tager/admin-services";
import { Page } from "@tager/admin-layout";

import type { PageFull } from "../../typings/model";
import type { PageShort, TagType } from "../../typings/model";
import { getPageFormUrl } from "../../utils/paths";
import {
  clonePage,
  deletePage,
  getPageList,
  getPageListWithChildren,
  getPageTemplateList,
  movePage
} from "../../services/requests";

import { getStatusOptions } from "../PageForm/PageForm.helpers";
import { getColumnDefs, getSortOptions } from "./PageList.helpers";

export default defineComponent({
  name: "PageList",
  components: {
    Page,
    DeleteIcon,
    ContentCopyIcon,
    AddCircleIcon,
    NorthIcon,
    SouthIcon,
    EditIcon,
    OpenInBrowserIcon,
    FormFieldMultiSelect,
    AdvancedSearch,
    DataTable,
    BaseButton
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const i18n = useI18n();

    const statusLabels = computed(() => ({
      PUBLISHED: i18n.t("pages:statusPublished"),
      DRAFT: i18n.t("pages:statusDraft")
    }));

    const statusOptionList = computed<OptionType[]>(() =>
      getStatusOptions(i18n)
    );

    /** Short template list */
    const [
      fetchTemplateList,
      { data: shortTemplateList, loading: isShortTemplateListLoading }
    ] = useResource({
      fetchResource: getPageTemplateList,
      initialValue: [],
      resourceName: "Template list"
    });

    const templateOptionList = computed(() =>
      shortTemplateList.value.map<OptionType>((template) => ({
        value: template.id,
        label: template.label
      }))
    );

    onMounted(() => {
      fetchTemplateList();
    });

    /** Parent page list */
    const [
      fetchParentList,
      { data: shortParentList, loading: isShortParentListLoading }
    ] = useResource({
      fetchResource: getPageListWithChildren,
      initialValue: [],
      resourceName: "Parent pages"
    });

    const parentOptionList = computed(() =>
      shortParentList.value.map<OptionType>((parent) => ({
        value: parent.id.toString(),
        label: getNameWithDepth(parent.title, parent.depth)
      }))
    );

    onMounted(() => {
      fetchParentList();
    });

    /** Template filter **/

    const initialTemplateFilter = computed(() => {
      const queryValue = getFilterParamAsStringArray(route.query, "template");
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
      const queryValue = getFilterParamAsStringArray(route.query, "parent");
      return parentOptionList.value.filter((option) =>
        queryValue.some((selected) => option.value === selected)
      );
    });

    const parentFilter = ref<Array<OptionType>>(initialParentFilter.value);

    watch(initialParentFilter, () => {
      parentFilter.value = initialParentFilter.value;
    });

    /** Status filter **/

    const initialStatusFilter = computed(() => {
      const queryValue = getFilterParamAsStringArray(route.query, "status");
      return statusOptionList.value.filter((option) =>
        queryValue.some((selected) => option.value === selected)
      );
    });

    const statusFilter = ref<Array<OptionType>>(initialStatusFilter.value);

    watch(initialStatusFilter, () => {
      statusFilter.value = initialStatusFilter.value;
    });

    /** filter params **/

    const filterParams = computed(() => {
      return getFilterParams({
        template: templateFilter.value.map((template) => template.value),
        parent: parentFilter.value.map((parent) => parent.value),
        status: statusFilter.value.map((status) => status.value)
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
      sort,
    } = useDataTable<PageShort>({
      fetchEntityList: (params) =>
        getPageList({
          query: params.searchQuery,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
          sort: params.sort || '',
          ...filterParams.value
        }),
      initialValue: [],
      resourceName: "Page list",
      pageSize: 100,
      defaultSort: getSortOptions(i18n.t)[0].value
    });

    const isRowDataLoading = computed<boolean>(
      () =>
        isPageListLoading.value ||
        isShortTemplateListLoading.value ||
        isShortParentListLoading.value
    );

    watch(filterParams, () => {
      const newQuery = {
        ...pick(route.query, ["query", "pageNumber"]),
        ...filterParams.value
      };

      if (!isEqual(route.query, newQuery)) {
        router.replace({ query: newQuery });
        fetchPageList();
      }
    });

    const { isDeleting, handleResourceDelete } = useResourceDelete({
      deleteResource: deletePage,
      resourceName: "Page",
      onSuccess: fetchPageList
    });

    const { isMoving, handleResourceMove } = useResourceMove({
      moveResource: movePage,
      resourceName: "Page",
      onSuccess: fetchPageList
    });

    const { isCloning, handleResourceClone } = useResourceClone({
      cloneResource: clonePage,
      confirmMessage: i18n.t("pages:cloneConfirm"),
      successMessage: i18n.t("pages:cloneSuccess"),
      failureMessage: i18n.t("pages:cloneFailure"),
      onSuccessRedirectTo: (data: PageFull) => "/pages/" + data.id
    });

    function getChildPageCreationFormUrl(params: { parentId: number }) {
      const searchParams = new URLSearchParams({
        parentId: String(params.parentId)
      });
      const searchString = "?" + searchParams.toString();

      const path = getPageFormUrl({ pageId: "create" });

      return path + searchString;
    }

    function hasChild(parentId: number): boolean {
      return pageList.value.some((page) => page.parent?.id === parentId);
    }

    function isBusy(pageId: number): boolean {
      return (
        isDeleting(pageId) ||
        isMoving(pageId) ||
        isCloning(pageId) ||
        isRowDataLoading.value
      );
    }

    const origin = "";


    function handleTagRemove(event: TagType) {
      if (event.name === "template") {
        templateFilter.value = templateFilter.value.filter(
          (template) => template.value !== event.value
        );
      }
      if (event.name === "parent") {
        parentFilter.value = parentFilter.value.filter(
          (parent) => parent.value !== event.value
        );
      }
      if (event.name === "status") {
        statusFilter.value = statusFilter.value.filter(
          (status) => status.value !== event.value
        );
      }
    }

    const tags = computed<Array<TagType>>(() => [
      ...templateFilter.value.map((template) => ({
        value: template.value,
        label: template.label,
        name: "template",
        title: i18n.t("pages:templates")
      })),
      ...parentFilter.value.map((parent) => ({
        value: parent.value,
        label: parent.label,
        name: "parent",
        title: i18n.t("pages:parentPage")
      })),
      ...statusFilter.value.map((status) => ({
        value: status.value,
        label: status.label,
        name: "status",
        title: i18n.t("pages:status")
      }))
    ]);

    return {
      columnDefs: getColumnDefs(i18n.t),
      sortOptions: getSortOptions(i18n.t),
      sortValue: sort,

      origin,
      getPageFormUrl,
      getChildPageCreationFormUrl,
      rowData: pageList,
      isRowDataLoading: isRowDataLoading,
      errorMessage: errorMessage,
      handleResourceDelete,
      handleResourceMove,
      handleResourceClone,
      hasChild,
      isBusy,
      searchQuery,
      handleChange,
      pageSize,
      pageCount,
      pageNumber,
      tags,
      handleTagRemove,
      templateFilter,
      parentFilter,
      statusFilter,
      templateOptionList,
      parentOptionList,
      getStatusOptions,
      statusOptionList,
      statusLabels
    };
  }
});
</script>

<style lang="scss">
.status-draft{
}

.status{
  .status-name{
    &.draft{
      color: var(--red-dark);
    }
  }

  .status-hidden-seo{
    display: block;
    font-size: 12px;
    color: var(--red-dark);
    margin-top: 5px;
  }
}
</style>
