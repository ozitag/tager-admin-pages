import { FileType, Nullable } from '@tager/admin-services';

export type TemplateShort = Readonly<{
  id: string;
  label: string;
}>;

interface CommonTemplateField {
  name: string;
  type: string;
  value: any;
}

interface StringField extends CommonTemplateField {
  type: 'STRING';
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

export type TemplateFieldType = Readonly<
  StringField | TextField | HtmlField | ImageField
>;

export type TemplateFull = Readonly<
  TemplateShort & {
    fields: Array<{
      name: TemplateFieldType['name'];
      type: TemplateFieldType['type'];
      label: string;
    }>;
  }
>;

export type PageShort = Readonly<{
  id: number;
  title: string;
  image: Nullable<FileType>;
  path: string;
}>;

export type PageFull = Readonly<
  PageShort & {
    parent: Nullable<PageShort['id']>;
    excerpt: Nullable<string>;
    body: Nullable<string>;

    /** SEO */
    pageTitle: Nullable<string>;
    pageDescription: Nullable<string>;
    openGraphTitle: Nullable<string>;
    openGraphDescription: Nullable<string>;
    openGraphImage: Nullable<FileType>;

    /** Template */
    template: TemplateShort['id'];
    templateValues: Array<TemplateFieldType>;
  }
>;
