import { FileType, Nullable } from '@tager/admin-services';

export type TemplateShort = Readonly<{
  id: string;
  label: string;
}>;

interface CommonTemplateField {
  name: string;
  label: string;
  type: string;
  value: any;
  meta: Record<string, any>;
  fields?: Array<CommonTemplateField>;
}

interface StringField extends CommonTemplateField {
  type: 'STRING';
  value: string;
}

interface DateField extends CommonTemplateField {
  type: 'DATE';
  value: string;
}

interface DateTimeField extends CommonTemplateField {
  type: 'DATETIME';
  value: string;
}

interface TextField extends CommonTemplateField {
  type: 'TEXT';
  value: string;
}

interface HtmlField extends CommonTemplateField {
  type: 'HTML';
  value: string;
}

interface ImageField extends CommonTemplateField {
  type: 'IMAGE';
  value: Nullable<FileType>;
}

interface FileField extends CommonTemplateField {
  type: 'FILE';
  value: Nullable<FileType>;
}

interface RepeatedField extends CommonTemplateField {
  type: 'REPEATER';
  value: Nullable<FileType>;
  fields: Array<TemplateFieldType>;
}

export type TemplateFieldType = Readonly<
  | StringField
  | TextField
  | HtmlField
  | ImageField
  | FileField
  | DateField
  | RepeatedField
  // | FileField
  // | DateField
  // | DateTimeField
>;

export type TemplateFull = Readonly<
  TemplateShort & {
    fields: Array<Omit<TemplateFieldType, 'value'>>;
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
  readonly templateValues: Array<Omit<TemplateFieldType, 'label'>>;
};
