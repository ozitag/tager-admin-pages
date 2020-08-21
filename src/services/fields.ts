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
  IncomingField,
  IncomingFieldUnion,
  OutgoingField,
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

interface IStringFieldUtils
  extends FieldUtils<
    'STRING',
    StringIncomingField,
    StringFieldTemplate,
    StringField,
    StringOutgoingField
  > {}

const StringFieldUtils: IStringFieldUtils = {
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

interface IDateFieldUtils
  extends FieldUtils<
    'DATE',
    DateIncomingField,
    DateFieldTemplate,
    DateField,
    DateOutgoingField
  > {}

const DateFieldUtils: IDateFieldUtils = {
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

interface IDateTimeFieldUtils
  extends FieldUtils<
    'DATETIME',
    DateTimeIncomingField,
    DateTimeFieldTemplate,
    DateTimeField,
    DateTimeOutgoingField
  > {}

const DateTimeFieldUtils: IDateTimeFieldUtils = {
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

interface ITextFieldUtils
  extends FieldUtils<
    'TEXT',
    TextIncomingField,
    TextFieldTemplate,
    TextField,
    TextOutgoingField
  > {}

const TextFieldUtils: ITextFieldUtils = {
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

interface IHtmlFieldUtils
  extends FieldUtils<
    'HTML',
    HtmlIncomingField,
    HtmlFieldTemplate,
    HtmlField,
    HtmlOutgoingField
  > {}

const HtmlFieldUtils: IHtmlFieldUtils = {
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

interface IImageFieldUtils
  extends FieldUtils<
    'IMAGE',
    ImageIncomingField,
    ImageFieldTemplate,
    ImageField,
    ImageOutgoingField
  > {}

const ImageFieldUtils: IImageFieldUtils = {
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

interface IFileFieldUtils
  extends FieldUtils<
    'FILE',
    FileIncomingField,
    FileFieldTemplate,
    FileField,
    FileOutgoingField
  > {}

const FileFieldUtils: IFileFieldUtils = {
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

interface IGalleryFieldUtils
  extends FieldUtils<
    'GALLERY',
    GalleryIncomingField,
    GalleryFieldTemplate,
    GalleryField,
    GalleryOutgoingField
  > {}

const GalleryFieldUtils: IGalleryFieldUtils = {
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

interface IRepeaterFieldUtils
  extends FieldUtils<
    'REPEATER',
    RepeaterIncomingField,
    RepeaterFieldTemplate,
    RepeaterField,
    RepeaterOutgoingField
  > {}

const RepeaterFieldUtils: IRepeaterFieldUtils = {
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

        for (let j = 0; j < fieldTemplateList.length; j++) {
          const nestedFieldTemplate = fieldTemplateList[j];

          const foundNestedIncomingField = nestedIncomingFieldList.find(
            (field) => field.name === nestedFieldTemplate.name
          );

          const foundFieldUtils = FIELD_UTILS_LIST.find(
            (utils) => utils.type === nestedFieldTemplate.type
          );

          /** @ts-ignore */
          const field = foundFieldUtils.createField(
            nestedFieldTemplate as any,
            foundNestedIncomingField as any
          );

          nestedFieldList.push(field);
        }
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
      value: field.value.map((image) => image.id),
    };
  },
};

interface IDefaultFieldUtils
  extends FieldUtils<
    'DEFAULT',
    DefaultIncomingField,
    DefaultFieldTemplate,
    DefaultField,
    DefaultOutgoingField
  > {}

const DefaultFieldUtils: IDefaultFieldUtils = {
  type: 'DEFAULT',
  getDefaultFieldValue() {
    return null;
  },
  createField(fieldTemplate, incomingField) {
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
  StringFieldUtils,
  TextFieldUtils,
  HtmlFieldUtils,
  ImageFieldUtils,
  FileFieldUtils,
  GalleryFieldUtils,
  DateFieldUtils,
  DateTimeFieldUtils,
  RepeaterFieldUtils,
];
