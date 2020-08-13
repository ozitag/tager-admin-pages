<script lang="ts">
import Vue, { RenderContext } from 'vue';
import {
  FormField,
  FormFieldFileInput,
  FormFieldRichTextInput,
} from '@tager/admin-ui';

import { TemplateFieldType } from '../typings/model';

type Props = Readonly<{
  field: TemplateFieldType;
}>;

const TemplateField = Vue.extend({
  name: 'TemplateField',
  functional: true,
  props: ['field'],
  render(h, context: RenderContext<Props>) {
    function emitUpdateEvent(event: TemplateFieldType['value']) {
      const listeners = context.listeners.update;

      const newEvent = {
        ...context.props.field,
        value: event,
      } as TemplateFieldType;

      if (Array.isArray(listeners)) {
        listeners.forEach((listener) => listener(newEvent));
      } else {
        listeners(newEvent);
      }
    }

    const commonProps = {
      label: context.props.field.label,
      name: context.props.field.name,
      value: context.props.field.value,
    };

    switch (context.props.field.type) {
      case 'STRING':
        return h(FormField, {
          props: {
            ...commonProps,
          },
          on: {
            ...context.listeners,
            input: emitUpdateEvent,
          },
        });
      case 'TEXT':
        return h(FormField, {
          props: {
            ...commonProps,
            type: 'textarea',
            rows: 4,
          },
          on: {
            ...context.listeners,
            input: emitUpdateEvent,
          },
        });
      case 'HTML':
        return h(FormFieldRichTextInput, {
          props: {
            ...commonProps,
          },
          on: {
            ...context.listeners,
            input: emitUpdateEvent,
          },
        });
      case 'IMAGE':
        return h(FormFieldFileInput, {
          props: {
            ...commonProps,
          },
          attrs: {
            fileType: 'image',
          },
          on: {
            ...context.listeners,
            change: emitUpdateEvent,
          },
        });
      case 'FILE':
        return h(FormFieldFileInput, {
          props: {
            ...commonProps,
          },
          on: {
            ...context.listeners,
            change: emitUpdateEvent,
          },
        });
      case 'REPEATER':
        return h('div', [h('h2')]);
      default:
        return h('div', `Unknown field with type: ${context.props.field.type}`);
    }
  },
});

export default TemplateField;
</script>

<style scoped></style>
