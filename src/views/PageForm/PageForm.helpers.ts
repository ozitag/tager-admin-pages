import {TFunction} from 'i18next';

import {createId, Nullable} from '@tager/admin-services';
import {OptionType, SingleFileInputValueType} from '@tager/admin-ui';
import {FieldUnion, universalFieldUtils} from '@tager/admin-dynamic-field';

import {PageFull, PageStatus, TemplateShort} from '../../typings/model';
import {PageCreatePayload, PageUpdatePayload} from '../../services/requests';

export const getStatusOptions = (t: TFunction): OptionType[] => [
    {label: t('pages:statusPublished'), value: 'PUBLISHED'},
    {label: t('pages:statusDraft'), value: 'DRAFT'}
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

    template: Nullable<OptionType<TemplateShort['id']>>;
};

export function getPageFormValues(
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
                title: '',
                path: '',
                parent: null,
                image: null,
                excerpt: '',
                body: '',
                datetime: '',
                pageTitle: '',
                pageDescription: '',
                openGraphTitle: '',
                openGraphDescription: '',
                pageKeywords: '',
                openGraphImage: null,
                template: null,
                // templateFields: [],
            },
            parent: initialParentOption ?? null,
            status: statusOptions[0]
        };
    }

    const foundParentOption = parentPageOptions.find(
        (option) => option.value === page.parent?.id
    );

    const foundTemplate = templateList.find(
        (template) => template.id === page.template
    );

    const foundStatus =
        statusOptions.find(({value}) => value === page.status) ??
        statusOptions[0];

    return {
        status: foundStatus,
        title: page.title,
        path: page.path,
        parent: foundParentOption ?? null,
        image: page.image ? {id: createId(), file: page.image} : null,
        excerpt: page.excerpt ?? '',
        body: page.body ?? '',
        datetime: page.datetime ? page.datetime.substr(0, 10) : '',
        pageTitle: page.pageTitle ?? '',
        pageDescription: page.pageDescription ?? '',
        pageKeywords: page.pageKeywords ?? '',
        openGraphTitle: page.openGraphTitle ?? '',
        openGraphDescription: page.openGraphDescription ?? '',
        openGraphImage: page.openGraphImage
            ? {id: createId(), file: page.openGraphImage}
            : null,
        template: foundTemplate
            ? {value: foundTemplate.id, label: foundTemplate.label}
            : null,
    };
}

export function convertPageFormValuesToCreationPayload(
    values: FormValues,
    templateValues: Array<FieldUnion>
): PageCreatePayload {
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
