<script lang="ts">
import Vue, { RenderContext } from 'vue';
import { FormField, FormFieldRichTextInput } from '@tager/admin-ui';

import { TemplateFieldType } from '../../typings/model';

type Props = Readonly<{
  field: TemplateFieldType;
}>;

export default Vue.extend({
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

    switch (context.props.field.type) {
      case 'STRING':
        return h(FormField, {
          props: {
            label: context.props.field.label,
            name: context.props.field.name,
            value: context.props.field.value,
          },
          on: {
            ...context.listeners,
            input: emitUpdateEvent,
          },
        });
      case 'TEXT':
        return h(FormField, {
          props: {
            label: context.props.field.label,
            name: context.props.field.name,
            value: context.props.field.value,
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
            label: context.props.field.label,
            name: context.props.field.name,
            value: context.props.field.value,
          },
          on: {
            ...context.listeners,
            input: emitUpdateEvent,
          },
        });
      default:
        return h('div', `Unknown field with type: ${context.props.field.type}`);
    }
  },
});
</script>

<style scoped></style>
