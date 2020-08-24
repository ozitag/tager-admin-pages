<script lang="ts">
import Vue from 'vue';
import kebabCase from 'lodash.kebabcase';
import { ScopedSlot } from 'vue/types/vnode';
import { BaseButton, ColumnDefinition, SvgIcon, Table } from '@tager/admin-ui';

import { FieldUnion, RepeaterField } from '../../../../../typings/model';

import TemplateField from '../../TemplateField.vue';
import { moveItem, removeItem } from '../RepeatedItemTree.helpers';

type Props = Readonly<{
  field: RepeaterField;
}>;

export default Vue.extend<Props>({
  name: 'RepeatedItemTable',
  functional: true,
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  render(h, context) {
    const repeaterField = context.props.field;

    type RowData = Record<string, FieldUnion>;

    const columnDefs: Array<ColumnDefinition<
      RowData
    >> = repeaterField.template.fields.map((fieldTemplate, index) => ({
      id: index + 1,
      name: fieldTemplate.label,
      field: fieldTemplate.name,
      useCustomDataCell: true,
    }));

    columnDefs.push({
      id: columnDefs.length + 1,
      name: 'Actions',
      field: 'actions',
      useCustomDataCell: true,
    });

    const rowData: Array<RowData> = repeaterField.value.map((entity) =>
      entity.value.reduce(
        (row, field) => ({ ...row, [field.template.name]: field }),
        {}
      )
    );

    const columnWidth = `calc(100% / ${repeaterField.template.fields.length})`;

    const scopedSlots: Record<
      string,
      ScopedSlot
    > = repeaterField.template.fields.reduce((scopedSlots, fieldTemplate) => {
      const slotName = `cell(${kebabCase(fieldTemplate.name)})`;

      return {
        ...scopedSlots,
        [slotName]: (props: {
          row: RowData;
          column: ColumnDefinition<RowData>;
        }) =>
          h('td', { style: { width: columnWidth } }, [
            h(TemplateField, {
              props: {
                field: props.row[fieldTemplate.name],
                isLabelHidden: true,
              },
            }),
          ]),
      };
    }, {});

    function handleItemRemove(index: number) {
      removeItem(context.props.field, index);
    }

    function handleItemMove(index: number, direction: 'up' | 'down') {
      moveItem(context.props.field, index, direction);
    }

    return h(Table, {
      props: { columnDefs, enumerable: true, rowData: rowData },
      class: 'repeated-field-table',
      scopedSlots: {
        ...scopedSlots,
        'cell(actions)': ({ rowIndex }) =>
          h('td', { style: { width: '140px', whiteSpace: 'nowrap' } }, [
            h(
              BaseButton,
              {
                props: { variant: 'icon', disabled: rowIndex === 0 },
                on: { click: () => handleItemMove(rowIndex, 'up') },
              },
              [h(SvgIcon, { props: { name: 'north' } })]
            ),
            h(
              BaseButton,
              {
                props: {
                  variant: 'icon',
                  disabled: rowIndex === repeaterField.value.length - 1,
                },
                on: { click: () => handleItemMove(rowIndex, 'down') },
              },
              [h(SvgIcon, { props: { name: 'south' } })]
            ),
            h(
              BaseButton,
              {
                props: { variant: 'icon' },
                on: { click: () => handleItemRemove(rowIndex) },
              },
              [h(SvgIcon, { props: { name: 'delete' } })]
            ),
          ]),
      },
    });
  },
});
</script>
