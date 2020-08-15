import { FileType, Nullable } from '@tager/admin-services';
import { OptionType } from '@tager/admin-ui';
import { v4 as uuid } from 'uuid';

import {
  PageFull,
  RepeatedField,
  RepeatedFieldFromRequest,
  TemplateFieldDefinitionType,
  TemplateFieldFromRequest,
  TemplateFieldToSave,
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
    // templateFields: pageData.templateValues,
  };
}

function getDefaultFieldValueByType(
  fieldType: TemplateFieldType['type']
): TemplateFieldType['value'] {
  switch (fieldType) {
    case 'STRING':
    case 'TEXT':
    case 'HTML':
      return '';

    case 'DATE':
    case 'IMAGE':
    case 'FILE':
      return null;

    case 'GALLERY':
    case 'REPEATER':
      return [];

    default:
      return null;
  }
}

function convertFieldToPayload(field: TemplateFieldType): TemplateFieldToSave {
  switch (field.type) {
    case 'HTML':
    case 'TEXT':
    case 'STRING':
      return { name: field.name, value: field.value };

    case 'IMAGE':
    case 'FILE':
      return { name: field.name, value: field.value?.id ?? null };

    case 'GALLERY':
      return { name: field.name, value: field.value.map((file) => file.id) };

    case 'REPEATER':
      return {
        name: field.name,
        value: field.value.map((nestedValue) =>
          nestedValue.value.map(convertFieldToPayload)
        ),
      };

    default:
      /** TODO FIXME */
      return {
        name: field.name,
        value: field.value,
      } as TemplateFieldToSave;
  }
}

export function convertPageFormValuesToCreationPayload(
  values: FormValues,
  templateValues: Array<TemplateFieldType>
): PageCreatePayload {
  return {
    ...values,
    parent: values.parent?.value ?? null,
    image: values.image?.id ?? null,
    openGraphImage: values.openGraphImage?.id ?? null,
    template: values.template?.value ?? null,
    templateFields: templateValues.map(convertFieldToPayload),
  };
}

export function convertPageFormValuesToUpdatePayload(
  values: FormValues,
  templateValues: Array<TemplateFieldType>
): PageUpdatePayload {
  return {
    ...convertPageFormValuesToCreationPayload(values, templateValues),
    path: values.path,
  };
}

function merge(
  definitions: Array<TemplateFieldDefinitionType>,
  shortFields: Array<TemplateFieldFromRequest>
): Array<TemplateFieldType> {
  const fields: Array<TemplateFieldType> = [];

  for (let i = 0; i < definitions.length; i++) {
    const definition = definitions[i];
    const foundShortField = shortFields.find(
      (field) => field.name === definition.name
    );

    let valueToMerge: TemplateFieldType['value'] = null;

    if (definition.type === 'REPEATER') {
      const repeatedFieldValue = (foundShortField
        ? foundShortField.value
        : getDefaultFieldValueByType(
            definition.type
          )) as RepeatedFieldFromRequest['value'];

      const repeatedFieldNestedValue = repeatedFieldValue.map(
        (nestedFieldValues) => ({
          id: uuid(),
          value: merge(definition.fields, nestedFieldValues),
        })
      );

      valueToMerge = repeatedFieldNestedValue as RepeatedField['value'];
    } else {
      type NotRepeatedTemplateFieldValue = Exclude<
        TemplateFieldType,
        RepeatedField
      >['value'];

      valueToMerge = (foundShortField?.value ??
        getDefaultFieldValueByType(
          definition.type
        )) as NotRepeatedTemplateFieldValue;
    }

    const mergedDefinition = {
      ...definition,
      value: valueToMerge,
      id: uuid(),
    } as TemplateFieldType;

    fields.push(mergedDefinition);
  }

  return fields;
}

export function mergeValuesIntoDefinitions(
  definitions: Array<TemplateFieldDefinitionType>,
  shortFields: Array<TemplateFieldFromRequest>
): Array<TemplateFieldType> {
  return merge(definitions, shortFields);
}
