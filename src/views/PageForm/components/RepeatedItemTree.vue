<template>
  <div class="repeated-field">
    <h3>{{ field.label }}</h3>
    <ul class="nested-element-list">
      <li
        v-for="(nestedElement, index) of field.value"
        :key="index"
        class="nested-element-container"
      >
        <repeated-item
          :field-list="nestedElement"
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
import Vue from 'vue';

import { RepeatedField } from '../../../typings/model';
import RepeatedItem from './RepeatedItem.vue';

type Props = Readonly<{
  field: RepeatedField;
}>;

export default Vue.extend<object, object, object, Props>({
  name: 'RepeatedItemTree',
  components: { RepeatedItem },
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.repeated-field {
  h3 {
    margin-bottom: 1rem;
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
