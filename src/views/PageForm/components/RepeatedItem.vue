<template>
  <div class="menu-item">
    <div class="inner">
      <div class="left">
        <h4>#{{ index + 1 }}</h4>
      </div>
    </div>
    <div class="item-form">
      <fieldset>
        <component
          :is="components.TemplateField"
          v-for="(field, fieldIndex) of fieldList"
          :key="fieldIndex"
          :field="field"
        />
      </fieldset>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { RepeatedField, TemplateFieldType } from '../../../typings/model';
import TemplateField from './TemplateField.vue';

type Props = Readonly<{
  fieldList: Array<TemplateFieldType>;
  parentField: RepeatedField;
  index: number;
  indexPath: Array<number>;
  components: { TemplateField: typeof TemplateField };
}>;

export default Vue.extend<object, object, object, Props>({
  name: 'RepeatedItem',
  props: {
    /**
     * Here we use hack: (https://github.com/vuejs/vue/issues/7492#issuecomment-369507267)
     * because vue don't understand functional component in "components" option
     */
    components: {
      type: Object,
      default() {
        return {
          TemplateField,
        };
      },
    },
    fieldList: {
      type: Array,
      required: true,
    },
    parentField: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    indexPath: {
      type: Array,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.menu-item {
  border: 1px solid #ccc;
  border-radius: 3px;

  &:not(:last-child) {
    margin-bottom: 0.7rem;
  }

  .inner {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: #eee;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .item-form {
    border-top: 1px solid #ccc;

    fieldset {
      padding: 1rem 1rem 0 1rem;
      border: 0;
    }

    .form-bottom {
      padding: 1rem;

      border-top: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
