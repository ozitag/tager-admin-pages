import {
  createId,
  type I18nContext,
  type Nullable,
} from "@tager/admin-services";
import type { OptionType, SingleFileInputValueType } from "@tager/admin-ui";
import {
  type FieldUnion,
  universalFieldUtils,
} from "@tager/admin-dynamic-field";

import type { PageFull, TemplateShort } from "../../typings/model";
import type {
  PageCreatePayload,
  PageUpdatePayload,
} from "../../services/requests";

export const getStatusOptions = (i18n: I18nContext): OptionType[] => [
  { label: i18n.t("pages:statusPublished"), value: "PUBLISHED" },
  { label: i18n.t("pages:statusDraft"), value: "DRAFT" },
];

export const getSitemapPriorityOptions = (
  i18n: I18nContext
): Array<OptionType<number | null>> => [
  { label: i18n.t("pages:notSetValue"), value: null },
  { label: "1.0", value: 1.0 },
  { label: "0.9", value: 0.9 },
  { label: "0.8", value: 0.8 },
  { label: "0.7", value: 0.7 },
  { label: "0.6", value: 0.6 },
  { label: "0.5", value: 0.5 },
  { label: "0.4", value: 0.4 },
  { label: "0.3", value: 0.3 },
  { label: "0.2", value: 0.2 },
  { label: "0.1", value: 0.1 },
  { label: "0.0", value: 0.0 },
];

export const getSitemapFrequencyOptions = (
  i18n: I18nContext
): Array<OptionType<string | null>> => [
  { label: i18n.t("pages:notSetValue"), value: null },
  { label: "Always", value: "always" },
  { label: "Hourly", value: "hourly" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Never", value: "never" },
];

export type FormValues = {
  title: string;
  status: OptionType;
  path: string;
  parent: Nullable<OptionType<Nullable<number>>>;
  image: Nullable<SingleFileInputValueType>;
  excerpt: string;
  body: string;
  datetime: string;

  pageTitle: Nullable<string>;
  pageDescription: Nullable<string>;
  pageKeywords: Nullable<string>;
  openGraphTitle: Nullable<string>;
  openGraphDescription: Nullable<string>;
  openGraphImage: Nullable<SingleFileInputValueType>;

  sitemapFrequency: Nullable<OptionType<string | null>>;
  sitemapPriority: Nullable<OptionType<number | null>>;
  hiddenFromSeoIndexation: boolean;

  template: Nullable<OptionType<TemplateShort["id"]>>;
};

export function getPageFormValues(
  i18n: I18nContext,
  page: Nullable<PageFull>,
  templateList: Array<TemplateShort>,
  parentPageOptions: Array<OptionType<Nullable<number>>>,
  initialParentId: Nullable<string>,
  statusOptions: OptionType[]
): FormValues {
  if (!page) {
    const initialParentOption = parentPageOptions.find(
      (option) => String(option.value) === String(initialParentId)
    );

    return {
      ...{
        title: "",
        path: "",
        parent: null,
        image: null,
        excerpt: "",
        body: "",
        datetime: "",
        pageTitle: "",
        pageDescription: "",
        openGraphTitle: "",
        openGraphDescription: "",
        pageKeywords: "",
        openGraphImage: null,
        template: null,
        hiddenFromSeoIndexation: false,
        sitemapFrequency: null,
        sitemapPriority: null,
      },
      parent: initialParentOption ?? null,
      status: statusOptions[0],
    };
  }

  const foundParentOption = parentPageOptions.find(
    (option) => option.value === page.parent?.id
  );

  const foundTemplate = templateList.find(
    (template) => template.id === page.template
  );

  const foundStatus =
    statusOptions.find(({ value }) => value === page.status) ??
    statusOptions[0];

  return {
    status: foundStatus,
    title: page.title,
    path: page.path,
    parent: foundParentOption ?? null,
    image: page.image ? { id: createId(), file: page.image } : null,
    excerpt: page.excerpt ?? "",
    body: page.body ?? "",
    datetime: page.datetime ? page.datetime.substr(0, 10) : "",
    pageTitle: page.pageTitle ?? "",
    pageDescription: page.pageDescription ?? "",
    pageKeywords: page.pageKeywords ?? "",
    openGraphTitle: page.openGraphTitle ?? "",
    openGraphDescription: page.openGraphDescription ?? "",
    openGraphImage: page.openGraphImage
      ? { id: createId(), file: page.openGraphImage }
      : null,
    hiddenFromSeoIndexation: page.hiddenFromSeoIndexation,
    sitemapPriority:
      getSitemapPriorityOptions(i18n).find(
        (item) => item.value === page.sitemapPriority
      ) || null,
    sitemapFrequency:
      getSitemapFrequencyOptions(i18n).find(
        (item) => item.value === page.sitemapFrequency
      ) || null,
    template: foundTemplate
      ? { value: foundTemplate.id, label: foundTemplate.label }
      : null,
  };
}

export function convertPageFormValuesToCreationPayload(
  values: FormValues
): PageCreatePayload {
  return {
    status: values.status?.value ?? null,
    title: values.title ?? null,
    parent: values.parent?.value ?? null,
    path: values.path ?? null,
    template: values.template?.value ?? null,
  };
}

export function convertPageFormValuesToUpdatePayload(
  values: FormValues,
  templateValues: Array<FieldUnion>
): PageUpdatePayload {
  return {
    ...values,
    status: values.status?.value ?? null,
    parent: values.parent?.value ?? null,
    image: values.image?.file.id ?? null,
    openGraphImage: values.openGraphImage?.file.id ?? null,
    template: values.template?.value ?? null,
    templateFields: templateValues.map((field) => ({
      value: universalFieldUtils.getOutgoingValue(field),
      name: field.config.name,
    })),
    path: values.path,

    sitemapPriority: values.sitemapPriority?.value ?? null,
    sitemapFrequency: values.sitemapFrequency?.value ?? null,
  };
}
