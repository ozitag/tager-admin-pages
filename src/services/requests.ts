import {
  FileType,
  Nullable,
  request,
  ResponseBody,
} from '@tager/admin-services';

import {
  PageFull,
  PageShort,
  TemplateFieldType,
  TemplateFull,
  TemplateShort,
} from '../typings/model';

export function getTemplateList(): Promise<ResponseBody<Array<TemplateShort>>> {
  return request.get({ path: '/pages/templates' });
}

export function getTemplateById(
  templateId: string
): Promise<ResponseBody<TemplateFull>> {
  return request.get({ path: `/pages/templates/${templateId}` });
}

export function getPageList(): Promise<ResponseBody<Array<PageShort>>> {
  return request.get({ path: '/pages' });
}

export function getPageById(
  pageId: number | string
): Promise<ResponseBody<PageFull>> {
  return request.get({ path: `/pages/${pageId}` });
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
  templateFields: Array<Pick<TemplateFieldType, 'name' | 'value'>>;
};

export function createPage(
  payload: PageCreatePayload
): Promise<ResponseBody<PageFull>> {
  return request.post({ path: '/pages', body: payload });
}

export type PageUpdatePayload = PageCreatePayload & {
  path: string;
};

export function updatePage(
  pageId: number | string,
  payload: PageUpdatePayload
): Promise<ResponseBody<PageFull>> {
  return request.put({ path: `/pages/${pageId}`, body: payload });
}

export function deletePage(
  pageId: number | string
): Promise<{ success: boolean }> {
  return request.delete({ path: `/pages/${pageId}` });
}
