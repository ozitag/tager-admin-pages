import type { FileType, Nullable } from "@tager/admin-services";
import type {
  FieldConfigUnion,
  FieldShortType,
  IncomingValueUnion,
} from "@tager/admin-dynamic-field";

export type PageStatus = "PUBLISHED" | "DRAFT";

/** Template */

export interface TemplateShort {
  readonly id: string;
  readonly label: string;
}

export interface TemplateFull extends TemplateShort {
  readonly fields: Array<FieldConfigUnion>;
}

export interface PageShort {
  readonly id: number;
  readonly status: string;
  readonly title: string;
  readonly path: string;
  readonly templateName: string;
  readonly parent: Nullable<Pick<PageShort, "id" | "title">>;
  readonly depth: number;
  readonly datetime: string;
  readonly sitemapPriority: number;
  readonly sitemapFrequency: string;
  readonly hiddenFromSeoIndexation: boolean;
}

export interface PageFull {
  readonly id: number;
  readonly status: string;
  readonly title: string;
  readonly image: Nullable<FileType>;
  readonly path: string;
  readonly parent: Nullable<Pick<PageShort, "id" | "title">>;

  readonly excerpt: Nullable<string>;
  readonly body: Nullable<string>;
  readonly datetime: Nullable<string>;

  /** SEO */
  readonly pageTitle: Nullable<string>;
  readonly pageDescription: Nullable<string>;
  readonly pageKeywords: Nullable<string>;
  readonly openGraphTitle: Nullable<string>;
  readonly openGraphDescription: Nullable<string>;
  readonly openGraphImage: Nullable<FileType>;
  readonly sitemapPriority: number;
  readonly sitemapFrequency: string;
  readonly hiddenFromSeoIndexation: boolean;

  /** Template */
  readonly template: TemplateShort["id"];
  readonly templateValues: Array<FieldShortType<IncomingValueUnion>>;
}

export interface InfoModel {
  readonly seoKeywordsEnabled: boolean;
  readonly fileScenarios: {
    readonly image: Nullable<FileType>;
    readonly content: Nullable<string>;
    readonly openGraph: Nullable<string>;
  };
}

export interface TagType {
  value: string;
  label: string;
  name: string;
  title: string;
}
