// External dependencies
import React, { useEffect, useState, useRef } from 'react';

// Internal dependencies
import logger from '../../utils/logger';
import { buildBlogPreviewsMarkup } from '../../utils/build-blog-previews-markup';
import { ShimmeringLinesInPlaceOfContentNotYetReady } from '../../components/loading-content-lines';
import { useAdditionalParamsString } from '../../hooks/use-additional-params-string';

// Types and constants
import { SerializedPreviews } from '../../../shared/types/content-metadata';
import { apiUrl } from '../../constants';

export const NUMBER_OF_LOADING_LINES = 20;
export const BLOG_RENDERED_LOG =
  'Blog Page rendered. Fetching blog previews....';
export const BLOG_GOT_CONTENT_PREVIEWS_LOG = 'Blog: Got blog previews';

export function Blog(): React.ReactElement {
  const previewsMarkup = useRef<JSX.Element>(null);
  const [contentReady, setContentReady] = useState(false);

  const additionalParamsString = useAdditionalParamsString();
  const previewsUrl = `${apiUrl}/content/blogs/previews?page=blog${additionalParamsString}`;

  useEffect(() => {
    void logger.info(BLOG_RENDERED_LOG);
    void fetch(previewsUrl)
      .then((response) => response.json())
      .then((responseBody: SerializedPreviews) => {
        void logger.info(BLOG_GOT_CONTENT_PREVIEWS_LOG);

        const markup = (
          <section data-testid="blog-page-blog-previews">
            {buildBlogPreviewsMarkup({
              previews: responseBody,
              includeTypeHeading: true,
            })}
          </section>
        );

        previewsMarkup.current = markup;
        setContentReady(true);
      });
  }, [previewsUrl]);

  return (
    <>
      <h2 data-testid="blog-page-heading">Blog</h2>
      <h3>Latest Posts</h3>
      {!contentReady ? (
        <ShimmeringLinesInPlaceOfContentNotYetReady
          numberOfLines={NUMBER_OF_LOADING_LINES}
        />
      ) : (
        previewsMarkup.current
      )}
    </>
  );
}
