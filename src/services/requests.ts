import {
    FileType,
    Nullable,
    request,
    ResponseBody,
} from '@tager/admin-services';
import {OutgoingValueUnion, FieldShortType} from '@tager/admin-dynamic-field';

import {
    InfoModel,
    PageFull,
    PageShort,
    TemplateFull,
    TemplateShort,
} from '../typings/model';

export function getPageTemplateList(): Promise<ResponseBody<Array<TemplateShort>>> {
    return request.get({path: '/admin/pages/templates'});
}

export function getPageTemplateById(
    templateId: string
): Promise<ResponseBody<TemplateFull>> {
    return request.get({path: `/admin/pages/templates/${templateId}`});
}

export function getPageList(params?: {
    query?: string;
    pageNumber?: number;
    pageSize?: number;
}): Promise<ResponseBody<Array<PageShort>>> {
    return request.get({path: '/admin/pages', params});
}

export function getPageListAll(): Promise<ResponseBody<Array<PageShort>>> {
    return request.get({
        path: '/admin/pages', params: {
            pageSize: 10000,
            pageNumber: 1
        }
    });
}

export function getPageListWithChildren(): Promise<ResponseBody<Array<PageShort>>> {
    return request.get({path: '/admin/pages?filter[with-children]=1'});
}

export function getPageCount(params?: { template: string }): Promise<ResponseBody<{ count: number }>> {
    return request.get({path: '/admin/pages/count', params});
}

export function getPageById(
    pageId: number | string
): Promise<ResponseBody<PageFull>> {
    return request.get({path: `/admin/pages/${pageId}`});
}

export function getPageInfo(): Promise<ResponseBody<InfoModel>> {
    return request.get({path: '/admin/pages/info'});
}

export interface PageCreatePayload {
    title: string;
    status: string;
    parent: Nullable<PageShort['id']>;
    image: Nullable<FileType['id']>;
    excerpt: string;
    body: string;
    path: string;

    pageTitle: Nullable<string>;
    pageDescription: Nullable<string>;
    pageKeywords: Nullable<string>;
    openGraphTitle: Nullable<string>;
    openGraphDescription: Nullable<string>;
    openGraphImage: Nullable<FileType['id']>;

    template: Nullable<TemplateShort['id']>;
    templateFields: Array<FieldShortType<OutgoingValueUnion>>;
}

export function createPage(
    payload: PageCreatePayload
): Promise<ResponseBody<PageFull>> {
    return request.post({path: '/admin/pages', body: payload});
}

export interface PageUpdatePayload extends PageCreatePayload {
    path: string;
}

export function updatePage(
    pageId: number | string,
    payload: PageUpdatePayload
): Promise<ResponseBody<PageFull>> {
    return request.put({path: `/admin/pages/${pageId}`, body: payload});
}

export function deletePage(
    pageId: number | string
): Promise<{ success: boolean }> {
    return request.delete({path: `/admin/pages/${pageId}`});
}

export function movePage(
    pageId: number | string,
    direction: 'up' | 'down'
): Promise<{ success: boolean }> {
    return request.post({path: `/admin/pages/${pageId}/move/${direction}`});
}

export function clonePage(
    pageId: number | string,
): Promise<ResponseBody<PageFull>> {
    return request.post({path: `/admin/pages/${pageId}/clone`});
}
