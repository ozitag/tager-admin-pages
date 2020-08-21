import { FileType, Nullable } from '@tager/admin-services';

/** Common */
export interface FieldTemplate {
  readonly name: string;
  readonly label: string;
  readonly type: string;
  readonly meta: Record<string, any>;
  readonly fields?: Array<FieldTemplate>;
}

export interface Field<Template extends FieldTemplate, Value = any> {
  readonly id: string;
  readonly template: Template;
  value: Value;
}

export interface IncomingField<Value> {
  readonly name: string;
  readonly value: Value;
}

export interface OutgoingField<Value> {
  readonly name: string;
  readonly value: Value;
}

/** Default - we use it as fallback for unknown fields */

export interface DefaultFieldTemplate extends FieldTemplate {}

export interface DefaultField extends Field<DefaultFieldTemplate, null> {}
export interface DefaultIncomingField extends IncomingField<null> {}
export interface DefaultOutgoingField extends OutgoingField<null> {}

/** STRING */

export interface StringFieldTemplate extends FieldTemplate {
  type: 'STRING';
}
export interface StringField extends Field<StringFieldTemplate, string> {}
export interface StringIncomingField extends IncomingField<string> {}
export interface StringOutgoingField extends OutgoingField<string> {}

/** DATE */

export interface DateFieldTemplate extends FieldTemplate {
  type: 'DATE';
}
export interface DateField extends Field<DateFieldTemplate, string> {}
export interface DateIncomingField extends IncomingField<string> {}
export interface DateOutgoingField extends OutgoingField<string> {}

/** DATETIME */

export interface DateTimeFieldTemplate extends FieldTemplate {
  type: 'DATETIME';
}
export interface DateTimeField extends Field<DateTimeFieldTemplate, string> {}
export interface DateTimeIncomingField extends IncomingField<string> {}
export interface DateTimeOutgoingField extends OutgoingField<string> {}

/** TEXT */

export interface TextFieldTemplate extends FieldTemplate {
  type: 'TEXT';
}
export interface TextField extends Field<TextFieldTemplate, string> {}
export interface TextIncomingField extends IncomingField<string> {}
export interface TextOutgoingField extends OutgoingField<string> {}

/** HTML */

export interface HtmlFieldTemplate extends FieldTemplate {
  type: 'HTML';
}
export interface HtmlField extends Field<HtmlFieldTemplate, string> {}
export interface HtmlIncomingField extends IncomingField<string> {}
export interface HtmlOutgoingField extends OutgoingField<string> {}

/** IMAGE */

export interface ImageFieldTemplate extends FieldTemplate {
  type: 'IMAGE';
}
export interface ImageField
  extends Field<ImageFieldTemplate, Nullable<FileType>> {}
export interface ImageIncomingField extends IncomingField<Nullable<FileType>> {}
export interface ImageOutgoingField extends OutgoingField<Nullable<number>> {}

/** GALLERY */

export interface GalleryFieldTemplate extends FieldTemplate {
  type: 'GALLERY';
}
export interface GalleryField
  extends Field<GalleryFieldTemplate, Array<FileType>> {}
export interface GalleryIncomingField extends IncomingField<Array<FileType>> {}
export interface GalleryOutgoingField extends OutgoingField<Array<number>> {}

/** FILE */

export interface FileFieldTemplate extends FieldTemplate {
  type: 'FILE';
}
export interface FileField
  extends Field<FileFieldTemplate, Nullable<FileType>> {}
export interface FileIncomingField extends IncomingField<Nullable<FileType>> {}
export interface FileOutgoingField extends OutgoingField<Nullable<number>> {}

/** REPEATER */

export interface RepeaterFieldTemplate extends FieldTemplate {
  type: 'REPEATER';
  fields: Array<FieldTemplateUnion>;
}
export interface RepeaterField
  extends Field<
    RepeaterFieldTemplate,
    Array<{ id: string; value: Array<FieldUnion> }>
  > {}
export interface RepeaterIncomingField
  extends IncomingField<Array<Array<IncomingFieldUnion>>> {}
export interface RepeaterOutgoingField
  extends OutgoingField<Array<Array<OutgoingFieldUnion>>> {}

/** All */
export type FieldTemplateUnion =
  | StringFieldTemplate
  | TextFieldTemplate
  | HtmlFieldTemplate
  | ImageFieldTemplate
  | GalleryFieldTemplate
  | FileFieldTemplate
  | DateFieldTemplate
  | RepeaterFieldTemplate;

export type FieldUnion =
  | StringField
  | TextField
  | HtmlField
  | ImageField
  | GalleryField
  | FileField
  | DateField
  | RepeaterField
  | DefaultField;

export type IncomingFieldUnion =
  | StringIncomingField
  | TextIncomingField
  | HtmlIncomingField
  | ImageIncomingField
  | GalleryIncomingField
  | FileIncomingField
  | DateIncomingField
  | RepeaterIncomingField;

export type OutgoingFieldUnion =
  | StringOutgoingField
  | TextOutgoingField
  | HtmlOutgoingField
  | ImageOutgoingField
  | GalleryOutgoingField
  | FileOutgoingField
  | DateOutgoingField
  | RepeaterOutgoingField
  | DefaultOutgoingField;

/** Template */

export type TemplateShort = Readonly<{
  id: string;
  label: string;
}>;

export type TemplateFull = Readonly<
  TemplateShort & {
    fields: Array<FieldTemplateUnion>;
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
  readonly template: TemplateShort['id'];
  readonly templateValues: Array<IncomingFieldUnion>;
};
