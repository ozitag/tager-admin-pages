import {
  FileType,
  Nullable,
  request,
  ResponseBody,
} from '@tager/admin-services';

import {
  OutgoingFieldUnion,
  PageFull,
  PageShort,
  TemplateFull,
  TemplateShort,
} from '../typings/model';

export function getPageTemplateList(): Promise<
  ResponseBody<Array<TemplateShort>>
> {
  return request.get({ path: '/admin/pages/templates' });
}

export function getPageTemplateById(
  templateId: string
): Promise<ResponseBody<TemplateFull>> {
  return request.get({ path: `/admin/pages/templates/${templateId}` });
}

export function getPageList(): Promise<ResponseBody<Array<PageShort>>> {
  return request.get({ path: '/admin/pages' });
}

export function getPageCount(): Promise<ResponseBody<{ count: number }>> {
  return request.get({ path: '/admin/pages/count' });
}

export function getPageById(
  pageId: number | string
): Promise<ResponseBody<PageFull>> {
  return request.get({ path: `/admin/pages/${pageId}` });
}

export type PageCreatePayload = {
  title: string;
  parent: Nullable<PageShort['id']>;
  image: Nullable<FileType['id']>;
  excerpt: string;
  body: string;

  pageTitle: Nullable<string>;
  pageDescription: Nullable<string>;
  openGraphTitle: Nullable<string>;
  openGraphDescription: Nullable<string>;
  openGraphImage: Nullable<FileType['id']>;

  template: Nullable<TemplateShort['id']>;
  templateFields: Array<OutgoingFieldUnion>;
};

export function createPage(
  payload: PageCreatePayload
): Promise<ResponseBody<PageFull>> {
  return request.post({ path: '/admin/pages', body: payload });
}

export type PageUpdatePayload = PageCreatePayload & {
  path: string;
};

export function updatePage(
  pageId: number | string,
  payload: PageUpdatePayload
): Promise<ResponseBody<PageFull>> {
  return request.put({ path: `/admin/pages/${pageId}`, body: payload });
}

export function deletePage(
  pageId: number | string
): Promise<{ success: boolean }> {
  return request.delete({ path: `/admin/pages/${pageId}` });
}

export function movePage(
  pageId: number | string,
  direction: 'up' | 'down'
): Promise<{ success: boolean }> {
  return request.post({ path: `/admin/pages/${pageId}/move/${direction}` });
}
