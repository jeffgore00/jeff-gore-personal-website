// External dependencies
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState, useRef } from 'react';

// Internal dependencies
import logger from '../../utils/logger';
import { buildBlogPreviewsMarkup } from '../../utils/build-blog-previews-markup';
import { ShimmeringLinesInPlaceOfContentNotYetReady } from '../../components/loading-content-lines';
import { useAdditionalParamsString } from '../../hooks/use-additional-params-string';
import { AboutMeHeader } from './styled-components';

// Types and constants
import { SerializedPreviews } from '../../../shared/types/content-metadata';
import { apiUrl } from '../../constants';

export const NUMBER_OF_LOADING_LINES = 20;
export const HOMEPAGE_RENDERED_LOG =
  'Homepage rendered. Fetching blog previews...';
export const HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG = 'Homepage: Got blog previews';

export function Homepage(): React.ReactElement {
  const techMarkup = useRef<JSX.Element>(null);
  const nonTechMarkup = useRef<JSX.Element>(null);
  const [contentReady, setContentReady] = useState(false);

  const additionalParamsString = useAdditionalParamsString();
  const previewsUrl = `${apiUrl}/content/blogs/previews?page=home${additionalParamsString}`;

  useEffect(() => {
    void logger.info(HOMEPAGE_RENDERED_LOG);
    void axios
      .get(previewsUrl)
      .then((response: AxiosResponse<SerializedPreviews>) => {
        void logger.info(HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG);

        const techPreviewsMarkup = (
          <section data-testid="homepage-tech-blog-previews">
            <div>- - - - - - - - - - - - - - - - - - - -</div>
            <h3 data-testid="homepage-tech-blog-previews-heading">
              Latest From the Tech Blog
            </h3>
            {buildBlogPreviewsMarkup({
              previews: response.data,
              blogType: 'TECH',
            })}
          </section>
        );

        const nonTechPreviewsMarkup = (
          <section data-testid="homepage-commentary-blog-previews">
            <div>- - - - - - - - - - - - - - - - - - - -</div>
            <h3 data-testid="homepage-commentary-blog-previews-heading">
              Latest From the Commentary Blog
            </h3>
            {buildBlogPreviewsMarkup({
              previews: response.data,
              blogType: 'COMMENTARY',
            })}
          </section>
        );

        techMarkup.current = techPreviewsMarkup;
        nonTechMarkup.current = nonTechPreviewsMarkup;
        setContentReady(true);
      });
  }, [previewsUrl]);

  return (
    <>
      <AboutMeHeader>
        Welcome to my site! I work full time as a web developer. I used to work
        as a journalist. Peruse the <a href="/blog">blog</a>!
      </AboutMeHeader>
      {!contentReady ? (
        <ShimmeringLinesInPlaceOfContentNotYetReady
          numberOfLines={NUMBER_OF_LOADING_LINES}
        />
      ) : (
        <>
          {techMarkup.current}
          {nonTechMarkup.current}
        </>
      )}
    </>
  );
}
