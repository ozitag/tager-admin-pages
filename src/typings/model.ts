import { FileType, Nullable } from '@tager/admin-services';
import {
  FieldConfigUnion,
  FieldShortType,
  IncomingValueUnion,
} from '@tager/admin-dynamic-field';

/** Template */

export type TemplateShort = Readonly<{
  id: string;
  label: string;
}>;

export type TemplateFull = Readonly<
  TemplateShort & {
    fields: Array<FieldConfigUnion>;
  }
>;

export type PageShort = {
  readonly id: number;
  readonly title: string;
  readonly path: string;
  readonly templateName: string;
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
  readonly templateValues: Array<FieldShortType<IncomingValueUnion>>;
};
