import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import logger from '../../utils/logger';
import { Previews } from '../../../shared/types/content-metadata';
import { buildBlogPreviewsMarkup } from '../../utils/build-blog-previews-markup';
import { ShimmeringLinesInPlaceOfContentNotYetReady } from '../../components/loading-content-lines';
import { useAdditionalParamsString } from '../../hooks/use-additional-params-string';
import { apiUrl } from '../../constants';

export const HOMEPAGE_RENDERED_LOG =
  'Homepage rendered. Fetching content previews...';
export const HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG =
  'Homepage: Got content previews';

const AboutMeHeader = styled.h2.attrs({
  'data-testid': 'homepage-about-me-blurb',
})`
  font-style: italic;
`;

export function Homepage(): React.ReactElement {
  const techMarkup = useRef<JSX.Element>(null);
  const nonTechMarkup = useRef<JSX.Element>(null);
  const [contentReady, setContentReady] = useState(false);

  const additionalParamsString = useAdditionalParamsString();
  const previewsUrl = `${apiUrl}/content/blogs/previews?page=home${additionalParamsString}`;

  useEffect(() => {
    void logger.info(HOMEPAGE_RENDERED_LOG);
    void axios.get(previewsUrl).then((response: AxiosResponse<Previews>) => {
      void logger.info(HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG);

      const techPreviewsMarkup = (
        <section data-testid="homepage-tech-blog-previews">
          <div>- - - - - - - - - - - - - - - - - - - -</div>
          <h3 data-testid="homepage-tech-blog-previews-heading">
            Latest From the Tech Blog
          </h3>
          {buildBlogPreviewsMarkup({
            content: response.data,
            contentSubtype: 'TECH',
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
            content: response.data,
            contentSubtype: 'COMMENTARY',
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
        as a journalist. Peruse the blog!
      </AboutMeHeader>
      {!contentReady ? (
        <ShimmeringLinesInPlaceOfContentNotYetReady numberOfLines={20} />
      ) : (
        <>
          {techMarkup.current}
          {nonTechMarkup.current}
        </>
      )}
    </>
  );
}
