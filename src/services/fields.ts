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
  FieldTemplate,
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
  UrlField,
  UrlFieldTemplate,
  UrlIncomingField,
  UrlOutgoingField,
} from '../typings/model';
import { Nullish } from '@tager/admin-services';

interface FieldUtils<
  IF,
  Template extends FieldTemplate,
  F extends Field<Template>,
  OF
> {
  type: Template['type'];
  getDefaultFieldValue(): F['value'];
  createField(fieldTemplate: Template, incomingField: Nullish<IF>): F;
  getOutgoingField(field: F): OF;
}

type StringFieldUtilsType = FieldUtils<
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

type UrlFieldUtilsType = FieldUtils<
  UrlIncomingField,
  UrlFieldTemplate,
  UrlField,
  UrlOutgoingField
>;

const urlFieldUtils: UrlFieldUtilsType = {
  type: 'URL',
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

          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          const field = universalFieldUtils.createField(
            nestedFieldTemplate,
            foundNestedIncomingField
          );

          nestedField.value.push(field as FieldUnion);
        }

        nestedFieldList.push(nestedField);
      }

      return nestedFieldList;
    }

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
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return universalFieldUtils.getOutgoingField(entityField);
        })
      ),
    };
  },
};

type DefaultFieldUtilsType = FieldUtils<
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
  urlFieldUtils,
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

function getFieldUtilsByType(type: string): FieldUtilsUnion {
  return (
    FIELD_UTILS_LIST.find((utils) => utils.type === type) ?? defaultFieldUtils
  );
}

interface UniversalFieldUtils {
  createField(
    fieldTemplate: FieldTemplateUnion,
    incomingField: Nullish<IncomingFieldUnion>
  ): FieldUnion;
  getOutgoingField(field: FieldUnion): OutgoingFieldUnion;
}

export const universalFieldUtils: UniversalFieldUtils = {
  createField(
    fieldTemplate: FieldTemplateUnion,
    incomingField: Nullish<IncomingFieldUnion>
  ): FieldUnion {
    const foundFieldUtils = getFieldUtilsByType(fieldTemplate.type);

    return (foundFieldUtils.createField as UniversalFieldUtils['createField'])(
      fieldTemplate,
      incomingField
    );
  },
  getOutgoingField(field: FieldUnion): OutgoingFieldUnion {
    const foundFieldUtils = getFieldUtilsByType(field.template.type);
    return (foundFieldUtils.getOutgoingField as UniversalFieldUtils['getOutgoingField'])(
      field
    );
  },
};
