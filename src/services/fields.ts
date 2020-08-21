import { v4 as uuid } from 'uuid';
import {
  DateField,
  DateFieldTemplate,
  DateIncomingField,
  DateOutgoingField,
  DateTimeField,
  DateTimeFieldTemplate,
  DateTimeIncomingField,
  DateTimeOutgoingField,
  DefaultField,
  DefaultFieldTemplate,
  DefaultIncomingField,
  DefaultOutgoingField,
  Field,
  FieldTemplateUnion,
  FieldUnion,
  FileField,
  FileFieldTemplate,
  FileIncomingField,
  FileOutgoingField,
  GalleryField,
  GalleryFieldTemplate,
  GalleryIncomingField,
  GalleryOutgoingField,
  HtmlField,
  HtmlFieldTemplate,
  HtmlIncomingField,
  HtmlOutgoingField,
  ImageField,
  ImageFieldTemplate,
  ImageIncomingField,
  ImageOutgoingField,
  IncomingFieldUnion,
  OutgoingFieldUnion,
  RepeaterField,
  RepeaterFieldTemplate,
  RepeaterIncomingField,
  RepeaterOutgoingField,
  StringField,
  StringFieldTemplate,
  StringIncomingField,
  StringOutgoingField,
  TextField,
  TextFieldTemplate,
  TextIncomingField,
  TextOutgoingField,
} from '../typings/model';
import { Nullish } from '@tager/admin-services';

interface FieldUtils<Type, IF, Template, F extends Field<any>, OF> {
  type: Type;
  getDefaultFieldValue(): F['value'];
  createField(fieldTemplate: Template, incomingField: Nullish<IF>): F;
  getOutgoingField(field: F): OF;
}

type StringFieldUtilsType = FieldUtils<
  'STRING',
  StringIncomingField,
  StringFieldTemplate,
  StringField,
  StringOutgoingField
>;

const stringFieldUtils: StringFieldUtilsType = {
  type: 'STRING',
  getDefaultFieldValue() {
    return '';
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return { name: field.template.name, value: field.value };
  },
};

type DateFieldUtilsType = FieldUtils<
  'DATE',
  DateIncomingField,
  DateFieldTemplate,
  DateField,
  DateOutgoingField
>;

const dateFieldUtils: DateFieldUtilsType = {
  type: 'DATE',
  getDefaultFieldValue() {
    return '';
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return { name: field.template.name, value: field.value };
  },
};

type DateTimeFieldUtilsType = FieldUtils<
  'DATETIME',
  DateTimeIncomingField,
  DateTimeFieldTemplate,
  DateTimeField,
  DateTimeOutgoingField
>;

const dateTimeFieldUtils: DateTimeFieldUtilsType = {
  type: 'DATETIME',
  getDefaultFieldValue() {
    return '';
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return { name: field.template.name, value: field.value };
  },
};

type TextFieldUtilsType = FieldUtils<
  'TEXT',
  TextIncomingField,
  TextFieldTemplate,
  TextField,
  TextOutgoingField
>;

const textFieldUtils: TextFieldUtilsType = {
  type: 'TEXT',
  getDefaultFieldValue() {
    return '';
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return { name: field.template.name, value: field.value };
  },
};

type HtmlFieldUtilsType = FieldUtils<
  'HTML',
  HtmlIncomingField,
  HtmlFieldTemplate,
  HtmlField,
  HtmlOutgoingField
>;

const htmlFieldUtils: HtmlFieldUtilsType = {
  type: 'HTML',
  getDefaultFieldValue() {
    return '';
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return { name: field.template.name, value: field.value };
  },
};

type ImageFieldUtilsType = FieldUtils<
  'IMAGE',
  ImageIncomingField,
  ImageFieldTemplate,
  ImageField,
  ImageOutgoingField
>;

const imageFieldUtils: ImageFieldUtilsType = {
  type: 'IMAGE',
  getDefaultFieldValue() {
    return null;
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return {
      name: field.template.name,
      value: field.value ? field.value.id : null,
    };
  },
};

type FileFieldUtilsType = FieldUtils<
  'FILE',
  FileIncomingField,
  FileFieldTemplate,
  FileField,
  FileOutgoingField
>;

const fileFieldUtils: FileFieldUtilsType = {
  type: 'FILE',
  getDefaultFieldValue() {
    return null;
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return {
      name: field.template.name,
      value: field.value ? field.value.id : null,
    };
  },
};

type GalleryFieldUtilsType = FieldUtils<
  'GALLERY',
  GalleryIncomingField,
  GalleryFieldTemplate,
  GalleryField,
  GalleryOutgoingField
>;

const galleryFieldUtils: GalleryFieldUtilsType = {
  type: 'GALLERY',
  getDefaultFieldValue() {
    return [];
  },
  createField(fieldTemplate, incomingField) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField ? incomingField.value : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return {
      name: field.template.name,
      value: field.value.map((image) => image.id),
    };
  },
};

type RepeaterFieldUtilsType = FieldUtils<
  'REPEATER',
  RepeaterIncomingField,
  RepeaterFieldTemplate,
  RepeaterField,
  RepeaterOutgoingField
>;

const repeaterFieldUtils: RepeaterFieldUtilsType = {
  type: 'REPEATER',
  getDefaultFieldValue() {
    return [];
  },
  createField(fieldTemplate, incomingField) {
    function createNestedFieldArray(
      fieldTemplateList: RepeaterFieldTemplate['fields'],
      incomingFieldList: RepeaterIncomingField['value']
    ): RepeaterField['value'] {
      console.log(
        'createNestedFieldArray',
        fieldTemplateList,
        incomingFieldList
      );
      const nestedFieldList: RepeaterField['value'] = [];

      for (let i = 0; i < incomingFieldList.length; i++) {
        const nestedIncomingFieldList = incomingFieldList[i];

        const nestedField: RepeaterField['value'][number] = {
          id: uuid(),
          value: [],
        };

        for (let j = 0; j < fieldTemplateList.length; j++) {
          const nestedFieldTemplate = fieldTemplateList[j];

          const foundNestedIncomingField = nestedIncomingFieldList.find(
            (field) => field.name === nestedFieldTemplate.name
          );

          console.log('nestedFieldTemplate', nestedFieldTemplate);
          console.log('nestedIncomingFieldList', nestedIncomingFieldList);
          console.log('foundNestedIncomingField', foundNestedIncomingField);

          // eslint-disable-next-line
          const foundFieldUtils = getFieldUtilsByType(nestedFieldTemplate.type);

          const field = foundFieldUtils.createField(
            /** @ts-ignore */
            nestedFieldTemplate,
            /** @ts-ignore */
            foundNestedIncomingField
          );

          nestedField.value.push(field as FieldUnion);
        }
      }

      return nestedFieldList;
    }

    console.log('incomingField', incomingField);
    return {
      id: uuid(),
      template: fieldTemplate,
      value: incomingField
        ? createNestedFieldArray(fieldTemplate.fields, incomingField.value)
        : this.getDefaultFieldValue(),
    };
  },
  getOutgoingField(field) {
    return {
      name: field.template.name,
      value: field.value.map((entity) =>
        entity.value.map((entityField) => {
          // eslint-disable-next-line
          const foundFieldUtils = getFieldUtilsByType(
            entityField.template.type
          );

          /** @ts-ignore */
          return foundFieldUtils.getOutgoingField(entityField);
        })
      ),
    };
  },
};

type DefaultFieldUtilsType = FieldUtils<
  'DEFAULT',
  DefaultIncomingField,
  DefaultFieldTemplate,
  DefaultField,
  DefaultOutgoingField
>;

const defaultFieldUtils: DefaultFieldUtilsType = {
  type: 'DEFAULT',
  getDefaultFieldValue() {
    return null;
  },
  createField(fieldTemplate) {
    return {
      id: uuid(),
      template: fieldTemplate,
      value: null,
    };
  },
  getOutgoingField(field) {
    return {
      name: field.template.name,
      value: null,
    };
  },
};

const FIELD_UTILS_LIST = [
  stringFieldUtils,
  textFieldUtils,
  htmlFieldUtils,
  imageFieldUtils,
  fileFieldUtils,
  galleryFieldUtils,
  dateFieldUtils,
  dateTimeFieldUtils,
  repeaterFieldUtils,
  defaultFieldUtils,
];

type FieldUtilsUnion = typeof FIELD_UTILS_LIST[number];

export function getFieldUtilsByType(type: string): FieldUtilsUnion {
  return (
    FIELD_UTILS_LIST.find((utils) => utils.type === type) ?? defaultFieldUtils
  );
}

export const uniformFieldUtils = {
  createField(
    fieldTemplate: FieldTemplateUnion,
    incomingField: Nullish<IncomingFieldUnion>
  ): FieldUnion {
    const foundFieldUtils = getFieldUtilsByType(fieldTemplate.type);
    /** @ts-ignore */
    return foundFieldUtils.createField(fieldTemplate, incomingField);
  },
  getOutgoingField(field: FieldUnion): OutgoingFieldUnion {
    const foundFieldUtils = getFieldUtilsByType(field.template.type);
    /** @ts-ignore */
    return foundFieldUtils.getOutgoingField(field);
  },
};