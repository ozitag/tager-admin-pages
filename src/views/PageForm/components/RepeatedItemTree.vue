<template>
  <div class="repeated-field">
    <div class="title-row">
      <span class="title">{{ field.label }}</span>
      <base-button variant="icon" title="Add item" @click="addElement">
        <svg-icon name="addCircle" />
      </base-button>
    </div>

    <ul class="nested-element-list">
      <li
        v-for="(nestedElement, index) of field.value"
        :key="nestedElement.id"
        class="nested-element-container"
      >
        <repeated-item
          :item="nestedElement"
          :index="index"
          :parent-field="field"
          :index-path="[]"
          v-on="$listeners"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { v4 as uuid } from 'uuid';

import { RepeatedField } from '../../../typings/model';
import { mergeValuesIntoDefinitions } from '../PageForm.helpers';
import RepeatedItem from './RepeatedItem.vue';

type Props = Readonly<{
  field: RepeatedField;
}>;

export default defineComponent<Props>({
  name: 'RepeatedItemTree',
  components: { RepeatedItem },
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    function addElement() {
      const newElement = mergeValuesIntoDefinitions(props.field.fields, []);
      const newNestedField = { id: uuid(), value: newElement };

      props.field.value.unshift(newNestedField);
    }

    return { addElement };
  },
});
</script>

<style scoped lang="scss">
.repeated-field {
  .title-row {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }
}

.nested-element-list {
}

.nested-element-container {
  margin-bottom: 0.7rem;

  .nested-element-list {
    padding-left: 3rem;
  }
}
</style>
