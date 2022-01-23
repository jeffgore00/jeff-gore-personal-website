import React from 'react';

import {
  BlogPreviewWrapper,
  BlogPreviewTypeHeading,
  BlogPreviewTitleHeading,
  StyledLink,
} from '../../components/blog-preview/styled-components';
import { SerializedPreviews } from '../../../shared/types/content-metadata';

export function buildBlogPreviewsMarkup({
  previews,
  includeTypeHeading = false,
  blogType,
}: {
  previews: SerializedPreviews;
  includeTypeHeading?: boolean;
  blogType?: string;
}): JSX.Element {
  const filterForBlogType = blogType
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([contentId, contentItem]: [string, { contentSubtype: string }]) =>
        contentItem.contentSubtype === blogType
    : () => true;

  return (
    <>
      {Object.entries(previews)
        .filter(filterForBlogType)
        .sort(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([contentId1, contentItem1], [contentId2, contentItem2]) =>
            new Date(contentItem2.publishDate).valueOf() -
            new Date(contentItem1.publishDate).valueOf(),
        )
        .map(([contentId, contentItem]) => {
          const parsedBlogPublishDate = new Date(contentItem.publishDate);
          const formattedBlogPublishDate =
            parsedBlogPublishDate.toLocaleDateString('en-US', {
              timeZone: 'UTC',
            });

          return (
            <BlogPreviewWrapper contentId={contentId} key={contentId}>
              {includeTypeHeading && (
                <BlogPreviewTypeHeading blogType={contentItem.contentSubtype} />
              )}
              <BlogPreviewTitleHeading>
                <StyledLink to={`/blog/${contentId}`}>
                  {`${contentItem.title} (${formattedBlogPublishDate})`}
                </StyledLink>
              </BlogPreviewTitleHeading>

              <span className="blog-preview-subtitle">
                {contentItem.subtitle}
              </span>
            </BlogPreviewWrapper>
          );
        })}
    </>
  );
}
