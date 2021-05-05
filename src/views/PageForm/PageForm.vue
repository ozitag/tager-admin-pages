<template>
  <page
    :title="isCreation ? t('pages:pageCreation') : t('pages:pageUpdate')"
    :is-content-loading="isLoading"
    :header-buttons="headerButtonList"
  >
    <form novalidate @submit.prevent>
      <template v-if="isCreation">
        <form-field
          v-model="values.title"
          name="title"
          :error="errors.title"
          :label="t('pages:title')"
        />

        <form-field-select
          v-model="values.template"
          name="template"
          :error="errors.template"
          :label="t('pages:template')"
          :no-options-message="t('pages:noTemplate')"
          :placeholder="t('pages:noTemplate')"
          :options="templateOptions"
        />

        <form-field-select
          v-model="values.parent"
          name="parent"
          :error="errors.parent"
          :label="t('pages:parentPage')"
          :no-options-message="t('pages:noParent')"
          :placeholder="t('pages:noParent')"
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
            :label="t('pages:title')"
          />

          <form-field-url-alias-input
            v-model="values.path"
            name="path"
            :error="errors.path"
            :label="t('pages:path')"
            :url-template="websiteOrigin"
          />

          <field-value
            v-if="values.template"
            :label="t('pages:template')"
            type="text"
            :text="values.template.label"
          />

          <form-field-rich-text-input
            v-model="values.body"
            name="body"
            :error="errors.body"
            :label="t('pages:body')"
            :get-upload-adapter-options="getUploadAdapterPluginOptions"
          />

          <form-field-file-input
            v-model="values.image"
            name="image"
            :error="errors.image"
            :label="t('pages:image')"
            file-type="image"
            :scenario="info.fileScenarios.image"
          />

          <form-field
            v-model="values.excerpt"
            name="excerpt"
            :error="errors.excerpt"
            :label="t('pages:excerpt')"
            type="textarea"
            :rows="4"
          />

          <form-field-select
            v-model="values.parent"
            name="parent"
            :error="errors.parent"
            :label="t('pages:parentPage')"
            :no-options-message="t('pages:noParent')"
            :placeholder="t('pages:noParent')"
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
          <seo-field-group
            :title="values.pageTitle"
            :title-error-message="errors.pageTitle"
            :description="values.pageDescription"
            :description-error-message="errors.pageDescription"
            :should-display-keywords="info.seoKeywordsEnabled"
            :keywords="values.pageKeywords"
            :keywords-error-message="errors.pageKeywords"
            :image="values.openGraphImage"
            :image-scenario="info.fileScenarios.openGraph"
            :image-error-message="errors.openGraphImage"
            @change="handleSeoFieldGroupChange"
          />
        </template>
      </template>
    </form>

    <template v-slot:footer>
      <FormFooter
        :back-href="getPageListUrl()"
        :on-submit="submitForm"
        :is-submitting="isSubmitting"
        :is-creation="isCreation"
        :can-create-another="isCreation"
      />
    </template>
  </page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { computed, onMounted, ref, watch } from '@vue/composition-api';

import {
  convertRequestErrorToMap,
  isNotNullish,
  notEmpty,
  Nullable,
  useResource,
} from '@tager/admin-services';
import {
  OptionType,
  SeoChangeEvent,
  TagerFormSubmitEvent,
  FormFooter,
  useTranslation,
} from '@tager/admin-ui';
import {
  DynamicField,
  FieldConfigUnion,
  FieldShortType,
  FieldUnion,
  IncomingValueUnion,
  universalFieldUtils,
} from '@tager/admin-dynamic-field';

import { InfoModel, TemplateFull } from '../../typings/model';
import {
  createPage,
  getPageById,
  getPageInfo,
  getPageList,
  getPageTemplateById,
  getPageTemplateList,
  updatePage,
} from '../../services/requests';
import { getPageFormUrl, getPageListUrl } from '../../utils/paths';
import { getNameWithDepth } from '../../utils/common';

import {
  convertPageFormValuesToCreationPayload,
  convertPageFormValuesToUpdatePayload,
  FormValues,
  getPageFormValues,
} from './PageForm.helpers';
import TabList, { TabType } from './components/TabList';

export default defineComponent({
  name: 'PageForm',
  components: { DynamicField, TabList, FormFooter },
  setup(props, context) {
    const { t } = useTranslation(context);

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

    /** Fetch page info **/

    const [
      fetchPageInfo,
      { data: pageInfo, loading: isPageInfoLoading },
    ] = useResource<Nullable<InfoModel>>({
      fetchResource: getPageInfo,
      initialValue: null,
      context,
      resourceName: 'Page info',
    });

    onMounted(() => {
      fetchPageInfo();
    });

    const info = computed<InfoModel>(
      () =>
        pageInfo.value || {
          seoKeywordsEnabled: false,
          fileScenarios: {
            image: null,
            content: 'custom',
            openGraph: null,
          },
        }
    );

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

    function submitForm(event: TagerFormSubmitEvent) {
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

          if (event.type === 'create') {
            context.root.$router.push(
              getPageFormUrl({ pageId: response.data.id })
            );
          }

          if (event.type === 'create_exit' || event.type === 'save_exit') {
            if (context.root.$previousRoute) {
              context.root.$router.back();
            } else {
              context.root.$router.push(getPageListUrl());
            }
          }

          if (event.type === 'create_create-another') {
            values.value = getPageFormValues(
              null,
              shortTemplateList.value,
              parentPageOptions.value,
              initialParentId.value
            );
          }

          context.root.$toast({
            variant: 'success',
            title: t('pages:success'),
            body: isCreation.value
              ? t('pages:createdSuccessMessage')
              : t('pages:updatedSuccessMessage'),
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          context.root.$toast({
            variant: 'danger',
            title: t('pages:error'),
            body: isCreation.value
              ? t('pages:createdErrorMessage')
              : t('pages:updatedErrorMessage'),
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

    const tabList = computed<Array<TabType>>(() => {
      return [
        { id: 'common', label: t('pages:tabs.common') },
        shouldDisplayTemplateTab.value
          ? { id: 'template', label: t('pages:tabs.template') }
          : null,
        { id: 'seo', label: t('pages:tabs.seo') },
      ].filter(notEmpty);
    });

    const selectedTabId = ref<string>(
      shouldDisplayTemplateTab.value ? tabList.value[1].id : tabList.value[0].id
    );

    watch(shouldDisplayTemplateTab, () => {
      if (shouldDisplayTemplateTab.value) {
        selectedTabId.value = tabList.value[1].id;
      }
    });

    const websiteOrigin: string =
      process.env.VUE_APP_WEBSITE_URL || window.location.origin;

    const isLoading = computed<boolean>(
      () =>
        isPageLoading.value ||
        isPageListLoading.value ||
        isShortTemplateListLoading.value ||
        isFullTemplateListLoading.value ||
        isPageInfoLoading.value
    );

    const headerButtonList = computed<
      Array<{ text: string; href: string; target?: string }>
    >(() =>
      [
        page.value
          ? {
              text: t('pages:viewPage'),
              href: websiteOrigin + page.value.path,
              target: '_blank',
            }
          : null,
      ].filter(isNotNullish)
    );

    function handleSeoFieldGroupChange({
      title,
      description,
      keywords,
      image,
    }: SeoChangeEvent) {
      values.value.pageTitle = title;
      values.value.pageDescription = description;
      values.value.pageKeywords = keywords;
      values.value.openGraphImage = image;
    }

    function getUploadAdapterPluginOptions() {
      return { uploadScenario: info.value.fileScenarios.content ?? 'custom' };
    }

    return {
      t,
      submitForm,
      isSubmitting,
      isCreation,
      getPageListUrl,
      isLoading,
      info,
      values,
      errors,
      templateOptions,
      templateValues,
      tabList,
      selectedTabId,
      parentPageOptions,
      websiteOrigin,
      headerButtonList,
      handleSeoFieldGroupChange,
      getUploadAdapterPluginOptions,
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
