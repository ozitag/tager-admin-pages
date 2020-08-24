import { FileType, Nullable } from '@tager/admin-services';
import { OptionType } from '@tager/admin-ui';

import { FieldUnion, PageFull, TemplateShort } from '../../typings/model';
import { PageCreatePayload, PageUpdatePayload } from '../../services/requests';
import { universalFieldUtils } from '../../services/fields';

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
  parentPageOptions: Array<OptionType<number>>,
  initialParentId: Nullable<string>
): FormValues {
  if (!page) {
    const initialParentOption = parentPageOptions.find(
      (option) => String(option.value) === String(initialParentId)
    );

    return { ...INITIAL_VALUES, parent: initialParentOption ?? null };
  }

  const foundParentOption = parentPageOptions.find(
    (option) => option.value === page.parent?.id
  );

  const foundTemplate = templateList.find(
    (template) => template.id === page.template
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
  };
}

export function convertPageFormValuesToCreationPayload(
  values: FormValues,
  templateValues: Array<FieldUnion>
): PageCreatePayload {
  return {
    ...values,
    parent: values.parent?.value ?? null,
    image: values.image?.id ?? null,
    openGraphImage: values.openGraphImage?.id ?? null,
    template: values.template?.value ?? null,
    templateFields: templateValues.map((field) =>
      universalFieldUtils.getOutgoingField(field)
    ),
  };
}

export function convertPageFormValuesToUpdatePayload(
  values: FormValues,
  templateValues: Array<FieldUnion>
): PageUpdatePayload {
  return {
    ...convertPageFormValuesToCreationPayload(values, templateValues),
    path: values.path,
  };
}
