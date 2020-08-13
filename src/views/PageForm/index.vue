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

      <div class="divider" />

      <h4 class="section-title">Template</h4>

      <form-field-select
        v-model="values.template"
        name="template"
        :error="errors.template"
        label="Template"
        no-options-message="No Template"
        :options="templateOptions"
      />

      <template-field
        v-for="field of templateValues"
        :key="field.name"
        :field="field"
        @update="handleTemplateFieldUpdate"
      />

      <div class="divider" />

      <h4 class="section-title">SEO</h4>

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
    </form>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';
import { convertRequestErrorToMap } from '@tager/admin-services';
import { OptionType } from '@tager/admin-ui';

import { TemplateFieldType, TemplateFull } from '../../typings/model';
import { computed, onMounted, ref, watch } from '@vue/composition-api';
import useResource from '../../hooks/useResource';
import {
  createPage,
  getPageById,
  getTemplateById,
  getTemplateList,
  updatePage,
} from '../../services/requests';
import { getPageListUrl } from '../../utils/paths';
import TemplateField from '../../components/TemplateField.vue';
import {
  convertPageFormValuesToCreationPayload,
  convertPageFormValuesToUpdatePayload,
  FormValues,
  getPageFormValues,
} from './PageForm.helpers';

export default Vue.extend({
  name: 'PageForm',
  components: { TemplateField },
  setup(props, context) {
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

    watch(pageId, fetchPage);

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

    const errors = ref<Record<string, string>>({});
    const values = ref<FormValues>(
      getPageFormValues(page.value, shortTemplateList.value)
    );
    const isSubmitting = ref<boolean>(false);
    const templateValues = ref<Record<string, TemplateFieldType>>({});

    const selectedTemplate = computed(() =>
      fullTemplateList.value.find(
        (template) => template.id === values.value.template?.value
      )
    );

    function updateTemplateValues() {
      const newTemplateValues: Record<string, TemplateFieldType> = {};

      if (selectedTemplate.value) {
        selectedTemplate.value.fields.forEach((fieldDefinition) => {
          function getFieldValue() {
            if (!page.value) return null;

            const foundField = page.value.templateValues.find(
              (templateField) => templateField.name === fieldDefinition.name
            );

            return foundField ? foundField.value : null;
          }

          newTemplateValues[fieldDefinition.name] = {
            ...fieldDefinition,
            value: getFieldValue(),
          } as TemplateFieldType;
        });
      }

      templateValues.value = newTemplateValues;
    }

    function updateFormValues() {
      values.value = getPageFormValues(page.value, shortTemplateList.value);
    }

    onMounted(() => {
      updateFormValues();
      updateTemplateValues();
    });

    watch([page, shortTemplateList], () => {
      updateFormValues();
    });

    watch([page, selectedTemplate], () => {
      updateTemplateValues();
    });

    function handleTemplateFieldUpdate(updatedField: TemplateFieldType) {
      templateValues.value[updatedField.name] = updatedField;
    }

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
      templateValues,
      handleTemplateFieldUpdate,
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
