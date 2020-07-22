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
      <form-field
        v-model="values.title"
        name="title"
        :error="errors.title"
        label="Title"
      />
      <form-field
        v-if="!isCreation"
        v-model="values.path"
        name="path"
        :error="errors.path"
        label="Path"
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
      <form-field-rich-text-input
        v-model="values.body"
        name="body"
        :error="errors.body"
        label="Body"
      />

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

      <form-field-select
        v-model="values.template"
        name="template"
        :error="errors.template"
        label="Template"
        :options="templateOptions"
      />
    </form>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  convertRequestErrorToMap,
  FileType,
  Nullable,
} from '@tager/admin-services';
import { OptionType } from '@tager/admin-ui';

import {
  PageFull,
  PageShort,
  TemplateFieldType,
  TemplateFull,
  TemplateShort,
} from '../typings/model';
import { computed, onMounted, ref, watch } from '@vue/composition-api';
import useResource from '../hooks/useResource';
import {
  createPage,
  getPageById,
  getTemplateById,
  getTemplateList,
  PageCreatePayload,
  PageUpdatePayload,
  updatePage,
} from '../services/requests';
import { getPageListUrl } from '../utils/paths';

type FormValues = {
  title: string;
  path: string;
  parent: Nullable<PageShort['id']>;
  image: Nullable<FileType>;
  excerpt: string;
  body: string;

  pageTitle: Nullable<string>;
  pageDescription: Nullable<string>;
  openGraphTitle: Nullable<string>;
  openGraphDescription: Nullable<string>;
  openGraphImage: Nullable<FileType>;

  template: Nullable<OptionType<TemplateShort['id']>>;
  templateFields: Array<Pick<TemplateFieldType, 'name' | 'value'>>;
};

export default Vue.extend({
  name: 'PageForm',
  setup(props, context) {
    const errors = ref({});
    const isSubmitting = ref(false);

    const pageId = computed(() => context.root.$route.params.pageId);
    const isCreation = computed(() => pageId.value === 'create');

    const [fetchTemplateList, { data: shortTemplateList }] = useResource({
      fetchResource: getTemplateList,
      initialValue: [],
    });

    const templateOptions = computed(() =>
      shortTemplateList.value.map<OptionType>((template) => ({
        value: template.id,
        label: template.label,
      }))
    );

    const [fetchPage, { data: page, loading }] = useResource({
      fetchResource: () => getPageById(pageId.value),
      initialValue: null,
    });

    onMounted(() => {
      fetchTemplateList();

      if (isCreation.value) return;

      fetchPage();
    });

    watch(pageId, () => {
      fetchPage();
    });

    const fullTemplateList = ref<Array<TemplateFull>>([]);

    watch(shortTemplateList, (currentTemplateList) => {
      if (currentTemplateList.length === 0) return;

      Promise.all(
        currentTemplateList.map((shortTemplate) =>
          getTemplateById(shortTemplate.id).then((response) => response.data)
        )
      )
        .then((list) => {
          fullTemplateList.value = list;
        })
        .catch(console.error);
    });

    function convertPageToFormValues(pageData: Nullable<PageFull>): FormValues {
      if (!pageData) {
        return {
          title: '',
          path: '',
          parent: null,
          image: null,
          excerpt: '',
          body: '',
          pageTitle: '',
          pageDescription: '',
          openGraphTitle: '',
          openGraphDescription: '',
          openGraphImage: null,
          template: null,
          templateFields: [],
        };
      }

      return {
        title: pageData.title,
        path: pageData.path,
        parent: pageData.parent,
        image: pageData.image,
        excerpt: pageData.excerpt ?? '',
        body: pageData.body ?? '',
        pageTitle: pageData.pageTitle,
        pageDescription: pageData.pageDescription,
        openGraphTitle: pageData.openGraphTitle,
        openGraphDescription: pageData.openGraphDescription,
        openGraphImage: pageData.openGraphImage,
        template:
          templateOptions.value.find(
            (option) => option.value === pageData.template
          ) ?? null,
        templateFields: pageData.templateValues,
      };
    }

    const values = ref<FormValues>(convertPageToFormValues(null));

    watch(page, (currentPage) => {
      values.value = convertPageToFormValues(currentPage);
    });

    function submitForm() {
      isSubmitting.value = true;

      const creationPayload: PageCreatePayload = {
        ...values.value,
        image: values.value.image?.id ?? null,
        openGraphImage: values.value.openGraphImage?.id ?? null,
        template: values.value.template?.value ?? null,
      };

      const updatePayload: PageUpdatePayload = {
        ...creationPayload,
        path: values.value.path,
      };

      const requestPromise = isCreation.value
        ? createPage(creationPayload)
        : updatePage(pageId.value, updatePayload);

      requestPromise
        .then(() => {
          errors.value = {};
          context.root.$router.push(getPageListUrl());
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

    return {
      submitForm,
      isSubmitting,
      isCreation,
      getPageListUrl,
      isLoading: loading,
      values,
      errors,
      templateOptions,
    };
  },
});
</script>
