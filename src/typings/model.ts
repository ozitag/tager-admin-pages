import { FileType, Nullable } from '@tager/admin-services';

/** Template fields */

/** Common */
interface CommonTemplateFieldDefinition {
  name: string;
  label: string;
  type: string;
  meta: Record<string, any>;
  fields?: Array<CommonTemplateFieldDefinition>;
}

interface CommonTemplateFieldDefinition2 {
  name: string;
  type: string;
  value: any;
}

type CommonTemplateFieldPayload<Value> = {
  name: string;
  value: Value;
};

/** STRING */

interface StringFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'STRING';
}

interface StringField extends StringFieldDefinition {
  value: string;
}

type StringFieldPayload = CommonTemplateFieldPayload<string>;

/** DATE */

interface DateFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'DATE';
}

interface DateField extends DateFieldDefinition {
  value: string;
}

type DateFieldPayload = CommonTemplateFieldPayload<string>;

/** DATETIME */

interface DateTimeFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'DATETIME';
}

interface DateTimeField extends DateFieldDefinition {
  value: string;
}

type DateTimeFieldPayload = CommonTemplateFieldPayload<string>;

/** TEXT */

interface TextFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'TEXT';
}

interface TextField extends TextFieldDefinition {
  value: string;
}

type TextFieldPayload = CommonTemplateFieldPayload<string>;

/** HTML */

interface HtmlFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'HTML';
}

interface HtmlField extends HtmlFieldDefinition {
  value: string;
}

type HtmlFieldPayload = CommonTemplateFieldPayload<string>;

/** IMAGE */

interface ImageFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'IMAGE';
}

interface ImageField extends ImageFieldDefinition {
  value: Nullable<FileType>;
}

type ImageFieldPayload = CommonTemplateFieldPayload<Nullable<number>>;

/** FILE */

interface FileFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'FILE';
}

interface FileField extends FileFieldDefinition {
  value: Nullable<FileType>;
}

type FileFieldPayload = CommonTemplateFieldPayload<Nullable<number>>;

/** REPEATER */

interface RepeatedFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'REPEATER';
  fields: Array<TemplateFieldDefinitionType>;
}

export interface RepeatedField extends RepeatedFieldDefinition {
  value: Array<Array<TemplateFieldType>>;
}

type RepeatedFieldPayload = CommonTemplateFieldPayload<
  Array<Array<TemplateFieldPayloadType>>
>;

/** All */
export type TemplateFieldDefinitionType =
  | StringFieldDefinition
  | TextFieldDefinition
  | HtmlFieldDefinition
  | ImageFieldDefinition
  | FileFieldDefinition
  | DateFieldDefinition
  | RepeatedFieldDefinition;

export type TemplateFieldType = Readonly<
  | StringField
  | TextField
  | HtmlField
  | ImageField
  | FileField
  | DateField
  | RepeatedField
>;

export type TemplateFieldPayloadType =
  | StringFieldPayload
  | TextFieldPayload
  | HtmlFieldPayload
  | ImageFieldPayload
  | FileFieldPayload
  | DateFieldPayload
  | RepeatedFieldPayload;

/** Template */

export type TemplateShort = Readonly<{
  id: string;
  label: string;
}>;

export type TemplateFull = Readonly<
  TemplateShort & {
    fields: Array<TemplateFieldDefinitionType>;
  }
>;

export type PageTemplateValueType<
  T extends TemplateFieldType
> = T extends TemplateFieldType ? Pick<T, 'name' | 'value'> : never;

export type PageShort = {
  readonly id: number;
  readonly title: string;
  readonly image: Nullable<FileType>;
  readonly path: string;
  readonly parent: Nullable<Pick<PageShort, 'id' | 'title'>>;
  readonly depth: number;
};

export type PageFull = {
  readonly id: number;
  readonly title: string;
  readonly image: Nullable<FileType>;
  readonly path: string;
  readonly parent: Nullable<Pick<PageShort, 'id' | 'title'>>;

  readonly excerpt: Nullable<string>;
  readonly body: Nullable<string>;

  /** SEO */
  readonly pageTitle: Nullable<string>;
  readonly pageDescription: Nullable<string>;
  readonly openGraphTitle: Nullable<string>;
  readonly openGraphDescription: Nullable<string>;
  readonly openGraphImage: Nullable<FileType>;

  /** Template */
  template: TemplateShort['id'];
  templateValues: Array<PageTemplateValueType<TemplateFieldType>>;
};
