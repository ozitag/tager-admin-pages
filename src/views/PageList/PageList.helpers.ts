import { ColumnDefinition, formatDate, OptionType } from "@tager/admin-ui";
import { PageShort } from "../../typings/model";
import { getPageFormUrl } from "../../utils/paths";
import { getNameWithDepth, isNotNullish } from "@tager/admin-services";
import { TFunction } from "i18next";

export function getColumnDefs(t: TFunction): Array<ColumnDefinition<PageShort>> {
  return [
    {
      id: 1,
      name: t("pages:title"),
      field: "name",
      type: "name",
      format: ({ row }) => ({
        adminLink: {
          url: getPageFormUrl({ pageId: row.id }),
          text: getNameWithDepth(row.title, row.depth)
        },
        paramList: [
          {
            name: t("pages:publishedDate"),
            value: formatDate(new Date(row.datetime))
          },
          row.sitemapPriority !== null ? {
            name: "sitemap.xml - Priority",
            value: String(row.sitemapPriority)
          } : null,

          row.sitemapFrequency !== null ? {
            name: "sitemap.xml - Frequency",
            value: String(row.sitemapFrequency)
          } : null
        ].filter(isNotNullish)
      })
    },
    {
      id: 2,
      name: t("pages:path"),
      field: "path",
      type: "link",
      format: ({ row }) => {
        return {
          url: origin + row.path,
          text: row.path
        };
      },
      options: {
        shouldOpenNewTab: true,
        shouldUseRouter: false
      }
    },
    {
      id: 3,
      name: t("pages:status"),
      field: "status",
      width: '190px'
    },
    {
      id: 4,
      name: t("pages:template"),
      field: "templateName"
    },
    {
      id: 5,
      name: t("pages:actions"),
      field: "actions",
      style: { width: "140px", textAlign: "center", whiteSpace: "nowrap" },
      headStyle: { width: "140px", textAlign: "center" }
    }
  ];
}

export const getSortOptions = (t: TFunction): Array<OptionType> => [
  {
    value: "default",
    label:  t('pages:sort:priority')
  },
  {
    value: "date_desc",
    label: t('pages:sort:published_date_desc'),
  },
  {
    value: "date_asc",
    label: t('pages:sort:published_date_asc'),
  }
];