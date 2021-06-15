import React from 'react';

import {
  BlogPreviewWrapper,
  BlogPreviewTypeHeading,
  BlogPreviewTitleHeading,
} from '../../components/blog-preview/styled-components';
import { Previews } from '../../../shared/types/content-metadata';

export function buildBlogPreviewsMarkup({
  content,
  includeTypeHeading = false,
  contentSubtype,
}: {
  content: Previews;
  includeTypeHeading?: boolean;
  contentSubtype?: string;
}): JSX.Element {
  const filterForBlogType = contentSubtype
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([contentId, contentItem]: [string, { contentSubtype: string }]) =>
        contentItem.contentSubtype === contentSubtype
    : () => true;

  return (
    <>
      {Object.entries(content)
        .filter(filterForBlogType)
        .sort(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([contentId1, contentItem1], [contentId2, contentItem2]) =>
            new Date(contentItem2.publishDate).valueOf() -
            new Date(contentItem1.publishDate).valueOf(),
        )
        .map(([contentId, contentItem]) => {
          const parsedContentPublishDate = new Date(contentItem.publishDate);
          const formattedContentPublishDate =
            parsedContentPublishDate.toLocaleDateString('en-US', {
              timeZone: 'UTC',
            });

          return (
            <BlogPreviewWrapper contentId={contentId} key={contentId}>
              {includeTypeHeading && (
                <BlogPreviewTypeHeading blogType={contentItem.contentSubtype} />
              )}
              <BlogPreviewTitleHeading>{`${contentItem.title} (${formattedContentPublishDate})`}</BlogPreviewTitleHeading>
              <span className="blog-preview-subtitle">
                {contentItem.subtitle}
              </span>
            </BlogPreviewWrapper>
          );
        })}
    </>
  );
}
