<template>
  <page
    :title="`Page ${isCreation ? 'creation' : 'update'}`"
    :is-content-loading="isLoading"
    :footer="{
      backHref: getPageListUrl(),
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <form novalidate @submit.prevent>
      <template v-if="isCreation">
        <form-field
          v-model="values.title"
          name="title"
          :error="errors.title"
          label="Title"
        />

        <form-field-select
          v-model="values.template"
          name="template"
          :error="errors.template"
          label="Template"
          no-options-message="No Template"
          placeholder="No Template"
          :options="templateOptions"
        />

        <form-field-select
          v-model="values.parent"
          name="parent"
          :error="errors.parent"
          label="Parent page"
          no-options-message="No Parent"
          placeholder="No Parent"
          :options="parentPageOptions"
        />
      </template>
      <template v-else>
        <tab-list
          :tab-list="tabList"
          :selected-tab-id="selectedTabId"
          @tab:update="selectedTabId = $event.tabId"
        />

        <template v-if="selectedTabId === 'common'">
          <form-field
            v-model="values.title"
            name="title"
            :error="errors.title"
            label="Title"
          />

          <form-field-url-alias-input
            v-model="values.path"
            name="path"
            :error="errors.path"
            label="Path"
            :url-template="websiteOrigin"
          />

          <form-field-select
            v-model="values.template"
            name="template"
            :error="errors.template"
            label="Template"
            no-options-message="No Template"
            placeholder="No Template"
            :options="templateOptions"
          />

          <form-field-rich-text-input
            v-model="values.body"
            name="body"
            :error="errors.body"
            label="Body"
          />

          <form-field-file-input
            v-model="values.image"
            name="image"
            :error="errors.image"
            label="Image"
            file-type="image"
          />

          <form-field
            v-model="values.excerpt"
            name="excerpt"
            :error="errors.excerpt"
            label="Excerpt"
            type="textarea"
            rows="4"
          />

          <form-field-select
            v-model="values.parent"
            name="parent"
            :error="errors.parent"
            label="Parent page"
            no-options-message="No Parent"
            placeholder="No Parent"
            :options="parentPageOptions"
          />
        </template>

        <template v-if="selectedTabId === 'template'">
          <DynamicField
            v-for="field of templateValues"
            :key="field.config.name"
            :field="field"
          />
        </template>

        <template v-if="selectedTabId === 'seo'">
          <form-field
            v-model="values.pageTitle"
            name="pageTitle"
            :error="errors.pageTitle"
            label="Page title"
          />

          <form-field
            v-model="values.pageDescription"
            name="pageDescription"
            :error="errors.pageDescription"
            label="Page description"
            type="textarea"
            rows="4"
          />

          <form-field
            v-model="values.openGraphTitle"
            name="openGraphTitle"
            :error="errors.openGraphTitle"
            label="Open Graph Title"
          />

          <form-field
            v-model="values.openGraphDescription"
            name="openGraphDescription"
            :error="errors.openGraphDescription"
            label="Open Graph Description"
            type="textarea"
            rows="4"
          />

          <form-field-file-input
            v-model="values.openGraphImage"
            name="openGraphImage"
            :error="errors.openGraphImage"
            label="Open Graph Image"
            file-type="image"
          />
        </template>
      </template>
    </form>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { computed, onMounted, ref, watch } from '@vue/composition-api';

import {
  convertRequestErrorToMap,
  notEmpty,
  useResource,
} from '@tager/admin-services';
import { OptionType } from '@tager/admin-ui';

import {
  FieldConfigUnion,
  FieldShortType,
  FieldUnion,
  IncomingValueUnion,
  TemplateFull,
} from '../../typings/model';
import {
  createPage,
  getPageById,
  getPageList,
  getPageTemplateById,
  getPageTemplateList,
  updatePage,
} from '../../services/requests';
import { getPageFormUrl, getPageListUrl } from '../../utils/paths';
import { getNameWithDepth } from '../../utils/common';
import { universalFieldUtils } from '../../services/fields';

import DynamicField from './components/DynamicField.vue';
import {
  convertPageFormValuesToCreationPayload,
  convertPageFormValuesToUpdatePayload,
  FormValues,
  getPageFormValues,
} from './PageForm.helpers';
import TabList, { TabType } from './components/TabList';

export default Vue.extend({
  name: 'PageForm',
  components: { DynamicField, TabList },
  setup(props, context) {
    const pageId = computed(() => context.root.$route.params.pageId);

    const isCreation = computed(() => pageId.value === 'create');

    const initialParentId = computed<string | null>(() => {
      if (!isCreation) return null;

      const parentIdQueryParam = context.root.$route.query.parentId;

      return Array.isArray(parentIdQueryParam)
        ? parentIdQueryParam[0]
        : parentIdQueryParam;
    });

    /** Page fetching */

    const [fetchPage, { data: page, loading: isPageLoading }] = useResource({
      fetchResource: () => getPageById(pageId.value),
      initialValue: null,
      context,
      resourceName: 'Page',
    });

    onMounted(() => {
      if (isCreation.value) return;

      fetchPage();
    });

    watch(pageId, fetchPage);

    /** Page list fetching */

    const [
      fetchPageList,
      { data: pageList, loading: isPageListLoading },
    ] = useResource({
      fetchResource: () => getPageList(),
      initialValue: [],
      context,
      resourceName: 'Page list',
    });

    onMounted(() => {
      fetchPageList();
    });

    watch(pageId, fetchPageList);

    const parentPageOptions = computed<Array<OptionType<number>>>(() =>
      pageList.value
        /** Page cannot be parent for herself */
        .filter((shortPage) => shortPage.id !== page.value?.id)
        .map((shortPage) => ({
          value: shortPage.id,
          label: getNameWithDepth(shortPage.title, shortPage.depth),
        }))
    );

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

    const templateOptions = computed(() =>
      shortTemplateList.value.map<OptionType>((template) => ({
        value: template.id,
        label: template.label,
      }))
    );

    onMounted(() => {
      fetchTemplateList();
    });

    /** Full template list */

    const fullTemplateList = ref<Array<TemplateFull>>([]);
    const isFullTemplateListLoading = ref<boolean>(false);

    watch(shortTemplateList, (currentTemplateList) => {
      if (currentTemplateList.length === 0) return;

      isFullTemplateListLoading.value = true;

      Promise.all(
        currentTemplateList.map((shortTemplate) =>
          getPageTemplateById(shortTemplate.id).then(
            (response) => response.data
          )
        )
      )
        .then((list) => {
          fullTemplateList.value = list;
        })
        .catch(console.error)
        .finally(() => {
          isFullTemplateListLoading.value = false;
        });
    });

    /** Form state */

    const errors = ref<Record<string, string>>({});
    const values = ref<FormValues>(
      getPageFormValues(
        page.value,
        shortTemplateList.value,
        parentPageOptions.value,
        initialParentId.value
      )
    );
    const isSubmitting = ref<boolean>(false);
    const templateValues = ref<Array<FieldUnion>>([]);

    const selectedTemplate = computed(() =>
      fullTemplateList.value.find(
        (template) => template.id === values.value.template?.value
      )
    );

    function updateTemplateValues() {
      const fieldTemplateList: Array<FieldConfigUnion> =
        selectedTemplate.value?.fields ?? [];

      const incomingFieldList: Array<FieldShortType<IncomingValueUnion>> =
        page.value?.templateValues ?? [];

      templateValues.value = fieldTemplateList.map((fieldConfig, index) =>
        universalFieldUtils.createFormField(
          fieldConfig,
          incomingFieldList[index]?.value
        )
      );
    }

    function updateFormValues() {
      values.value = getPageFormValues(
        page.value,
        shortTemplateList.value,
        parentPageOptions.value,
        initialParentId.value
      );
    }

    onMounted(() => {
      updateFormValues();
      updateTemplateValues();
    });

    watch([page, shortTemplateList, parentPageOptions], () => {
      updateFormValues();
    });

    watch([page, selectedTemplate], () => {
      updateTemplateValues();
    });

    function submitForm() {
      isSubmitting.value = true;

      const creationPayload = convertPageFormValuesToCreationPayload(
        values.value,
        templateValues.value
      );

      const updatePayload = convertPageFormValuesToUpdatePayload(
        values.value,
        templateValues.value
      );

      const requestPromise = isCreation.value
        ? createPage(creationPayload)
        : updatePage(pageId.value, updatePayload);

      requestPromise
        .then((response) => {
          errors.value = {};

          if (isCreation.value) {
            context.root.$router.push(
              getPageFormUrl({ pageId: response.data.id })
            );
          } else {
            context.root.$router.push(getPageListUrl());
          }

          context.root.$toast({
            variant: 'success',
            title: 'Success',
            body: `Page has been successfully ${
              isCreation.value ? 'created' : 'updated'
            }`,
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          context.root.$toast({
            variant: 'danger',
            title: 'Error',
            body: `Page ${
              isCreation.value ? 'creation' : 'update'
            } has been failed`,
          });
        })
        .finally(() => {
          isSubmitting.value = false;
        });
    }

    /** Tabs */

    const shouldDisplayTemplateTab = computed<boolean>(() =>
      fullTemplateList.value.some(
        (template) =>
          template.id === values.value.template?.value &&
          template.fields.length > 0
      )
    );

    const tabList = computed<Array<TabType>>(() =>
      [
        { id: 'common', label: 'Common' },
        shouldDisplayTemplateTab.value
          ? { id: 'template', label: 'Template' }
          : null,
        { id: 'seo', label: 'SEO' },
      ].filter(notEmpty)
    );
    const selectedTabId = ref<string>(tabList.value[0].id);

    const websiteOrigin: string =
      process.env.VUE_APP_WEBSITE_URL || window.location.origin;

    const isLoading = computed<boolean>(
      () =>
        isPageLoading.value ||
        isPageListLoading.value ||
        isShortTemplateListLoading.value ||
        isFullTemplateListLoading.value
    );

    return {
      submitForm,
      isSubmitting,
      isCreation,
      getPageListUrl,
      isLoading,
      values,
      errors,
      templateOptions,
      templateValues,
      tabList,
      selectedTabId,
      parentPageOptions,
      websiteOrigin,
    };
  },
});
</script>

<style lang="scss" scoped>
.divider {
  margin: 2rem 0 1.6rem 0;
  height: 1px;
  background-color: #eee;
}

.section-title {
  color: #000;
  letter-spacing: 0.1em;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
