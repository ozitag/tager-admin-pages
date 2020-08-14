import { FileType, Nullable } from '@tager/admin-services';

export type FieldShortType<Value> = {
  name: string;
  value: Value;
};

/** Common */
interface CommonTemplateFieldDefinition {
  readonly name: string;
  readonly label: string;
  readonly type: string;
  readonly meta: Record<string, any>;
  readonly fields?: Array<CommonTemplateFieldDefinition>;
}

/**
 * Explanation:
 *
 * FieldDefinition - description of field from template
 *
 * interface StringFieldDefinition extends CommonTemplateFieldDefinition {
 *   type: 'STRING';
 * }
 *
 * Field - field definition with value, that is used in form state
 *
 * interface StringField extends StringFieldDefinition {
 *   value: string;
 * }
 *
 * FieldFromRequest - field description (name, value), which is coming from PageFull request
 *
 * type StringFieldFromRequest = FieldShortType<string>;
 *
 * FieldToSave - field description (name, value), which is sent to backend when we update template values
 *
 * type StringFieldToSave = FieldShortType<string>;
 */

/** STRING */

interface StringFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'STRING';
}

interface StringField extends StringFieldDefinition {
  value: string;
}

type StringFieldFromRequest = FieldShortType<string>;
type StringFieldToSave = FieldShortType<string>;

/** DATE */

interface DateFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'DATE';
}

interface DateField extends DateFieldDefinition {
  value: string;
}

type DateFieldFromRequest = FieldShortType<string>;
type DateFieldToSave = FieldShortType<string>;

/** DATETIME */

interface DateTimeFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'DATETIME';
}

interface DateTimeField extends DateFieldDefinition {
  value: string;
}

type DateTimeFieldFromRequest = FieldShortType<string>;
type DateTimeFieldToSave = FieldShortType<string>;

/** TEXT */

interface TextFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'TEXT';
}

interface TextField extends TextFieldDefinition {
  value: string;
}

type TextFieldFromRequest = FieldShortType<string>;
type TextFieldToSave = FieldShortType<string>;

/** HTML */

interface HtmlFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'HTML';
}

interface HtmlField extends HtmlFieldDefinition {
  value: string;
}

type HtmlFieldFromRequest = FieldShortType<string>;
type HtmlFieldToSave = FieldShortType<string>;

/** IMAGE */

interface ImageFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'IMAGE';
}

interface ImageField extends ImageFieldDefinition {
  value: Nullable<FileType>;
}

type ImageFieldFromRequest = FieldShortType<Nullable<FileType>>;
type ImageFieldToSave = FieldShortType<Nullable<number>>;

/** GALLERY */

interface GalleryFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'GALLERY';
}

interface GalleryField extends GalleryFieldDefinition {
  value: Array<FileType>;
}

type GalleryFieldFromRequest = FieldShortType<Array<FileType>>;
type GalleryFieldToSave = FieldShortType<Array<number>>;

/** FILE */

interface FileFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'FILE';
}

interface FileField extends FileFieldDefinition {
  value: Nullable<FileType>;
}

type FileFieldFromRequest = FieldShortType<Nullable<FileType>>;
type FileFieldToSave = FieldShortType<Nullable<number>>;

/** REPEATER */

interface RepeatedFieldDefinition extends CommonTemplateFieldDefinition {
  type: 'REPEATER';
  fields: Array<TemplateFieldDefinitionType>;
}

export interface RepeatedField extends RepeatedFieldDefinition {
  value: Array<Array<TemplateFieldType>>;
}

export type RepeatedFieldFromRequest = FieldShortType<
  Array<Array<TemplateFieldFromRequest>>
>;
type RepeatedFieldToSave = FieldShortType<Array<Array<TemplateFieldToSave>>>;

/** All */
export type TemplateFieldDefinitionType =
  | StringFieldDefinition
  | TextFieldDefinition
  | HtmlFieldDefinition
  | ImageFieldDefinition
  | GalleryFieldDefinition
  | FileFieldDefinition
  | DateFieldDefinition
  | RepeatedFieldDefinition;

export type TemplateFieldType =
  | StringField
  | TextField
  | HtmlField
  | ImageField
  | GalleryField
  | FileField
  | DateField
  | RepeatedField;

export type TemplateFieldToSave =
  | StringFieldToSave
  | TextFieldToSave
  | HtmlFieldToSave
  | ImageFieldToSave
  | GalleryFieldToSave
  | FileFieldToSave
  | DateFieldToSave
  | RepeatedFieldToSave;

export type TemplateFieldFromRequest =
  | StringFieldFromRequest
  | TextFieldFromRequest
  | HtmlFieldFromRequest
  | ImageFieldFromRequest
  | GalleryFieldFromRequest
  | FileFieldFromRequest
  | DateFieldFromRequest
  | RepeatedFieldFromRequest;

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
  templateValues: Array<TemplateFieldFromRequest>;
};
