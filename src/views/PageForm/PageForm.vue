<template>
  <Page
    :title="
      isCreation ? $i18n.t('pages:pageCreation') : $i18n.t('pages:pageUpdate')
    "
    :is-content-loading="isLoading"
    :header-buttons="headerButtonList"
    v-model:tab-id="selectedTabId" :tabs="isCreation ? null : tabList"
  >
    <form novalidate @submit.prevent>
      <template v-if="isCreation">
        <FormFieldSelect
          v-model:value="values.status"
          name="status"
          :error="errors.status"
          :label="$i18n.t('pages:status')"
          :options="statusOptions"
        />

        <FormField
          v-model:value="values.title"
          name="title"
          :error="errors.title"
          :label="$i18n.t('pages:title')"
          @input="handleTitleChange"
        />

        <FormFieldSelect
          v-model:value="values.parent"
          name="parent"
          :searchable="true"
          :error="errors.parent"
          :label="$i18n.t('pages:parentPage')"
          :no-options-message="$i18n.t('pages:noParent')"
          :placeholder="$i18n.t('pages:noParent')"
          :options="parentPageOptions"
        />

        <FormFieldUrlAliasInput
          v-model:value="values.path"
          name="path"
          :error="errors.path"
          :label="$i18n.t('pages:path')"
          :url-template="websiteOrigin + pathPrefix"
          @change="handleAliasChange"
        />

        <FormFieldSelect
          v-model:value="values.template"
          name="template"
          :searchable="true"
          :error="errors.template"
          :label="$i18n.t('pages:template')"
          :no-options-message="$i18n.t('pages:noTemplate')"
          :placeholder="$i18n.t('pages:noTemplate')"
          :options="templateOptions"
        />
      </template>
      <template v-else>
        <template v-if="selectedTabId === 'common'">
          <FormFieldSelect
            v-model:value="values.status"
            name="status"
            :error="errors.status"
            :label="$i18n.t('pages:status')"
            :options="statusOptions"
          />
          <FormField
            v-model:value="values.title"
            name="title"
            :error="errors.title"
            :label="$i18n.t('pages:title')"
            @input="handleTitleChange"
          />

          <FormFieldUrlAliasInput
            v-model:value="values.path"
            name="path"
            :error="errors.path"
            :label="$i18n.t('pages:path')"
            :url-template="websiteOrigin"
            @change="handleAliasChange"
          />

          <FieldValue
            v-if="values.template"
            :label="$i18n.t('pages:template')"
            type="text"
            :text="values.template.label"
          />

          <FormFieldFileInput
            v-model:value="values.image"
            name="image"
            :error="errors.image"
            :label="$i18n.t('pages:image')"
            file-type="image"
            :scenario="info.fileScenarios.image"
          />

          <FormField
            v-model:value="values.excerpt"
            name="excerpt"
            :error="errors.excerpt"
            :label="$i18n.t('pages:excerpt')"
            type="textarea"
            :rows="4"
          />

          <FormFieldRichTextInput
            v-model:value="values.body"
            name="body"
            :error="errors.body"
            :label="$i18n.t('pages:body')"
            :get-upload-adapter-options="getUploadAdapterPluginOptions"
          />

          <FormFieldSelect
            v-model:value="values.parent"
            name="parent"
            :searchable="true"
            :error="errors.parent"
            :label="$i18n.t('pages:parentPage')"
            :no-options-message="$i18n.t('pages:noParent')"
            :placeholder="$i18n.t('pages:noParent')"
            :options="parentPageOptions"
          />

          <FormField
            v-model:value="values.datetime"
            name="title"
            type="date"
            :error="errors.datetime"
            :label="$i18n.t('pages:publishedDate')"
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
          <SeoFieldGroup
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

          <FormFieldCheckbox
            v-model:checked="values.hiddenFromSeoIndexation"
            name="hiddenFromSeoIndexation"
            :error="errors.hiddenFromSeoIndexation"
            :label="$i18n.t('pages:hiddenFromSeoIndexation')"
          />
        </template>
      </template>
    </form>

    <template #footer>
      <FormFooter
        :back-href="getPageListUrl()"
        :is-submitting="isSubmitting"
        :is-creation="isCreation"
        :can-create-another="isCreation"
        @submit="submitForm"
      />
    </template>
  </Page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  convertRequestErrorToMap,
  isNotNullish,
  notEmpty,
  type Nullable,
  useResource,
  urlTranslit,
  useI18n,
  navigateBack,
  useToast
} from "@tager/admin-services";
import {
  type OptionType,
  type SeoChangeEvent,
  type TabType,
  FormFooter,
  SeoFieldGroup,
  FormField,
  FormFieldSelect,
  FormFieldCheckbox,
  FormFieldRichTextInput,
  FormFieldUrlAliasInput,
  FieldValue,
  FormFieldFileInput,
  type TagerFormSubmitEvent
} from "@tager/admin-ui";
import {
  DynamicField,
  type FieldConfigUnion,
  type FieldShortType,
  type FieldUnion,
  type IncomingValueUnion,
  universalFieldUtils
} from "@tager/admin-dynamic-field";
import { Page, type TopButtonConfigType } from "@tager/admin-layout";

import type { InfoModel, TemplateFull } from "../../typings/model";
import {
  createPage,
  getPageById,
  getPageInfo,
  getPageListAll,
  getPageTemplateById,
  getPageTemplateList,
  updatePage
} from "../../services/requests";
import { getPageFormUrl, getPageListUrl } from "../../utils/paths";
import { getNameWithDepth } from "../../utils/common";

import {
  convertPageFormValuesToCreationPayload,
  convertPageFormValuesToUpdatePayload,
  type FormValues,
  getPageFormValues,
  getStatusOptions
} from "./PageForm.helpers";

export default defineComponent({
  name: "PageForm",
  components: {
    Page,
    DynamicField,
    FormFooter,
    SeoFieldGroup,
    FormField,
    FormFieldSelect,
    FormFieldRichTextInput,
    FormFieldFileInput,
    FieldValue,
    FormFieldUrlAliasInput,
    FormFieldCheckbox
  },
  setup() {
    const i18n = useI18n();
    const urlAliasChanged = ref(false);
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const pageId = computed(() => route.params.pageId as string | undefined);

    const isCreation = computed(() => pageId.value === "create");

    const initialParentId = computed<string | null>(() => {
      if (!isCreation.value) return null;

      const parentIdQueryParam = route.query.parentId;

      return Array.isArray(parentIdQueryParam)
        ? parentIdQueryParam[0]
        : parentIdQueryParam;
    });

    /** Page fetching */

    const [fetchPage, { data: page, loading: isPageLoading }] = useResource({
      fetchResource: () => {
        if (pageId.value && !isCreation.value) {
          return getPageById(pageId.value);
        }

        return Promise.resolve({ data: null });
      },
      initialValue: null,
      resourceName: "Page"
    });

    onMounted(fetchPage);

    const statusOptions = computed<OptionType[]>(() => getStatusOptions(i18n));

    watch(pageId, fetchPage);

    /** Page list fetching */

    const [fetchPageList, { data: pageList, loading: isPageListLoading }] =
      useResource({
        fetchResource: () => getPageListAll(),
        initialValue: [],
        resourceName: "Page list"
      });

    onMounted(() => {
      fetchPageList();
    });

    let websiteOrigin: string =
      process.env.VUE_APP_WEBSITE_URL || window.location.origin;
    if (websiteOrigin.substr(-1) === "/") {
      websiteOrigin = websiteOrigin.substr(0, websiteOrigin.length - 1);
    }

    watch(pageId, fetchPageList);

    const parentPageOptions = computed<Array<OptionType<Nullable<number>>>>(
      () => {
        const defaultPageOption = [
          { value: null, label: i18n.t("pages:noParent") }
        ];

        const pageLists = pageList.value
          /** Page cannot be parent for herself */
          .filter((shortPage) => shortPage.id !== page.value?.id)
          .map((shortPage) => ({
            value: shortPage.id,
            label: getNameWithDepth(shortPage.title, shortPage.depth)
          }));

        return [...defaultPageOption, ...pageLists];
      }
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

    const templateOptions = computed(() => {
      const defaultTemplate = [
        { value: null, label: i18n.t("pages:noTemplate") }
      ];

      const templates = shortTemplateList.value.map<OptionType>((template) => ({
        value: template.id,
        label: template.label
      }));

      return [...defaultTemplate, ...templates];
    });

    onMounted(() => {
      fetchTemplateList();
    });

    /** Fetch page info **/

    const [fetchPageInfo, { data: pageInfo, loading: isPageInfoLoading }] =
      useResource<Nullable<InfoModel>>({
        fetchResource: getPageInfo,
        initialValue: null,
        resourceName: "Page info"
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
            content: "custom",
            openGraph: null
          }
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
        initialParentId.value,
        statusOptions.value
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
        initialParentId.value,
        statusOptions.value
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

    const pathPrefix = computed<string>(() => {
      if (!isCreation.value) {
        return "";
      }

      if (!values.value?.parent?.value) {
        return "/";
      }

      const parent = pageList.value.find(
        (shortPage) => shortPage.id === values.value?.parent?.value
      );
      if (parent?.path === "/") {
        return "/";
      } else {
        return parent?.path + "/";
      }
    });

    function submitForm(event: TagerFormSubmitEvent) {
      isSubmitting.value = true;

      const creationPayload = convertPageFormValuesToCreationPayload(
        values.value
      );

      if (isCreation.value) {
        if (
          creationPayload.path.trim().length > 0 &&
          pathPrefix.value !== "/"
        ) {
          creationPayload.path = pathPrefix.value + creationPayload.path;
        } else if (creationPayload.path.trim().length === 0) {
          creationPayload.path = "/";
        }
      }

      const updatePayload = convertPageFormValuesToUpdatePayload(
        values.value,
        templateValues.value
      );

      const requestPromise = isCreation.value
        ? createPage(creationPayload)
        : updatePage(pageId.value || "", updatePayload);

      requestPromise
        .then((response) => {
          errors.value = {};

          if (event.type === "create") {
            router.push(getPageFormUrl({ pageId: response.data.id }));
          }

          if (event.type === "create_exit" || event.type === "save_exit") {
            navigateBack(router, getPageListUrl());
          }

          if (event.type === "create_create-another") {
            values.value = getPageFormValues(
              null,
              shortTemplateList.value,
              parentPageOptions.value,
              initialParentId.value,
              statusOptions.value
            );
          }

          toast.show({
            variant: "success",
            title: i18n.t("pages:success"),
            body: isCreation.value
              ? i18n.t("pages:createdSuccessMessage")
              : i18n.t("pages:updatedSuccessMessage")
          });
        })
        .catch((error) => {
          console.error(error);
          errors.value = convertRequestErrorToMap(error);
          toast.show({
            variant: "danger",
            title: i18n.t("pages:error"),
            body: isCreation.value
              ? i18n.t("pages:createdErrorMessage")
              : i18n.t("pages:updatedErrorMessage")
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
        { id: "common", label: i18n.t("pages:tabs.common") },
        shouldDisplayTemplateTab.value
          ? { id: "template", label: i18n.t("pages:tabs.template") }
          : null,
        { id: "seo", label: i18n.t("pages:tabs.seo") }
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

    const isLoading = computed<boolean>(
      () =>
        isPageLoading.value ||
        isPageListLoading.value ||
        isShortTemplateListLoading.value ||
        isFullTemplateListLoading.value ||
        isPageInfoLoading.value
    );

    const headerButtonList = computed<Array<TopButtonConfigType>>(() =>
      [
        page.value
          ? {
            text: i18n.t("pages:viewPage"),
            href: websiteOrigin + page.value.path,
            target: "_blank"
          }
          : null
      ].filter(isNotNullish)
    );

    function handleSeoFieldGroupChange({
                                         title,
                                         description,
                                         keywords,
                                         image
                                       }: SeoChangeEvent) {
      values.value.pageTitle = title;
      values.value.pageDescription = description;
      values.value.pageKeywords = keywords;
      values.value.openGraphImage = image;
    }

    function getUploadAdapterPluginOptions() {
      return { uploadScenario: info.value.fileScenarios.content ?? "custom" };
    }

    function handleTitleChange(value: string) {
      if (isCreation.value) {
        if (urlAliasChanged.value === false) {
          values.value.path = urlTranslit(value);
        }
      }
    }

    function handleAliasChange() {
      urlAliasChanged.value = true;
    }

    return {
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
      handleTitleChange,
      handleAliasChange,
      pathPrefix,
      statusOptions
    };
  }
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
