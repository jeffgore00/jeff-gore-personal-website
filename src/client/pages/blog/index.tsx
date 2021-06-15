import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState, useRef } from 'react';

import logger from '../../utils/logger';
import { Previews } from '../../../shared/types/content-metadata';
import { buildBlogPreviewsMarkup } from '../../utils/build-blog-previews-markup';
import { ShimmeringLinesInPlaceOfContentNotYetReady } from '../../components/loading-content-lines';
import { useAdditionalParamsString } from '../../hooks/use-additional-params-string';
import { apiUrl } from '../../constants';

export const BLOG_RENDERED_LOG =
  'Blog Page rendered. Fetching content previews....';
export const BLOG_GOT_CONTENT_PREVIEWS_LOG = 'Blog: Got content previews';

export function Blog(): React.ReactElement {
  const previewsMarkup = useRef<JSX.Element>(null);
  const [contentReady, setContentReady] = useState(false);

  const additionalParamsString = useAdditionalParamsString();
  const previewsUrl = `${apiUrl}/content/blogs/previews?page=blog${additionalParamsString}`;

  useEffect(() => {
    void logger.info(BLOG_RENDERED_LOG);
    void axios.get(previewsUrl).then((response: AxiosResponse<Previews>) => {
      void logger.info(BLOG_GOT_CONTENT_PREVIEWS_LOG);

      const markup = (
        <section data-testid="blog-page-blog-previews">
          {buildBlogPreviewsMarkup({
            content: response.data,
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
        <ShimmeringLinesInPlaceOfContentNotYetReady numberOfLines={20} />
      ) : (
        previewsMarkup.current
      )}
    </>
  );
}
