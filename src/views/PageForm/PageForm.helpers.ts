import { FileType, Nullable } from '@tager/admin-services';
import { OptionType } from '@tager/admin-ui';

import {
  PageFull,
  TemplateFieldType,
  TemplateShort,
} from '../../typings/model';
import { PageCreatePayload, PageUpdatePayload } from '../../services/requests';

export type FormValues = {
  title: string;
  path: string;
  parent: Nullable<OptionType<number>>;
  image: Nullable<FileType>;
  excerpt: string;
  body: string;

  pageTitle: Nullable<string>;
  pageDescription: Nullable<string>;
  openGraphTitle: Nullable<string>;
  openGraphDescription: Nullable<string>;
  openGraphImage: Nullable<FileType>;

  template: Nullable<OptionType<TemplateShort['id']>>;
  // templateFields: Array<Pick<TemplateFieldType, 'name' | 'value'>>;
};

const INITIAL_VALUES: FormValues = {
  title: '',
  path: '',
  parent: null,
  image: null,
  excerpt: '',
  body: '',
  pageTitle: '',
  pageDescription: '',
  openGraphTitle: '',
  openGraphDescription: '',
  openGraphImage: null,
  template: null,
  // templateFields: [],
};

export function getPageFormValues(
  page: Nullable<PageFull>,
  templateList: Array<TemplateShort>,
  parentPageOptions: Array<OptionType<number>>
): FormValues {
  if (!page) {
    return { ...INITIAL_VALUES };
  }

  const foundTemplate = templateList.find(
    (template) => template.id === page.template
  );

  const foundParentOption = parentPageOptions.find(
    (option) => option.value === page.parent?.id
  );

  return {
    title: page.title,
    path: page.path,
    parent: foundParentOption ?? null,
    image: page.image,
    excerpt: page.excerpt ?? '',
    body: page.body ?? '',
    pageTitle: page.pageTitle,
    pageDescription: page.pageDescription,
    openGraphTitle: page.openGraphTitle,
    openGraphDescription: page.openGraphDescription,
    openGraphImage: page.openGraphImage,
    template: foundTemplate
      ? { value: foundTemplate.id, label: foundTemplate.label }
      : null,
    // templateFields: pageData.templateValues,
  };
}

function getTemplateFieldValue(field: TemplateFieldType) {
  switch (field.type) {
    case 'HTML':
    case 'TEXT':
    case 'STRING':
      return field.value;

    case 'IMAGE':
    case 'FILE':
      return field.value?.id ?? null;

    default:
      return field.value;
  }
}

export function convertPageFormValuesToCreationPayload(
  values: FormValues,
  templateValues: Record<string, TemplateFieldType>
): PageCreatePayload {
  return {
    ...values,
    parent: values.parent?.value ?? null,
    image: values.image?.id ?? null,
    openGraphImage: values.openGraphImage?.id ?? null,
    template: values.template?.value ?? null,
    templateFields: Object.values(templateValues).map((templateField) => ({
      name: templateField.name,
      value: getTemplateFieldValue(templateField),
    })),
  };
}

export function convertPageFormValuesToUpdatePayload(
  values: FormValues,
  templateValues: Record<string, TemplateFieldType>
): PageUpdatePayload {
  return {
    ...convertPageFormValuesToCreationPayload(values, templateValues),
    path: values.path,
  };
}
