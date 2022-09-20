// External dependencies
import React from 'react';
import styled from 'styled-components';

// Internal dependencies
import { buildBlogPreviewsMarkup } from '../../utils/build-blog-previews-markup';
import { useAdditionalParamsString } from '../../hooks/use-additional-params-string';
import { AboutMeHeader } from './styled-components';

// Types and constants
import { SerializedPreviews } from '../../../shared/types/content-metadata';
import { apiUrl } from '../../constants';
import { DataDependentPageWrapper } from '../../components/data-dependent-page-wrapper';
import logger from '../../utils/logger';

export const NUMBER_OF_LOADING_LINES = 20;
export const HOMEPAGE_RENDERED_LOG =
  'Homepage rendered. Fetching blog previews...';
export const HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG = 'Homepage: Got blog previews';

export const StyledHeader = styled.h3`
  font-family: JetBrainsMono, monospace;
`;

export function Homepage(): React.ReactElement {
  const additionalParamsString = useAdditionalParamsString();
  const previewsUrl = `${apiUrl}/content/blogs/previews?page=home${additionalParamsString}`;

  void logger.info(HOMEPAGE_RENDERED_LOG);

  return (
    <DataDependentPageWrapper contentUrl={previewsUrl}>
      {(data: SerializedPreviews) => {
        void logger.info(HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG);

        const techPreviewsMarkup = (
          <section data-testid="homepage-tech-blog-previews">
            <div>- - - - - - - - - - - - - - - - - - - -</div>
            <StyledHeader data-testid="homepage-tech-blog-previews-heading">
              Latest From the Tech Blog
            </StyledHeader>
            {buildBlogPreviewsMarkup({
              previews: data,
              blogType: 'TECH',
              includeDate: false,
            })}
          </section>
        );

        const nonTechPreviewsMarkup = (
          <section data-testid="homepage-commentary-blog-previews">
            <div>- - - - - - - - - - - - - - - - - - - -</div>
            <StyledHeader data-testid="homepage-commentary-blog-previews-heading">
              Latest From the Commentary Blog
            </StyledHeader>
            {buildBlogPreviewsMarkup({
              previews: data,
              blogType: 'COMMENTARY',
              includeDate: false,
            })}
          </section>
        );
        return (
          <>
            <AboutMeHeader>
              Welcome to my site! I work full time as a web developer. I used to
              work as a journalist. Peruse the <a href="/blog">blog</a>!
            </AboutMeHeader>
            {techPreviewsMarkup}
            {nonTechPreviewsMarkup}
          </>
        );
      }}
    </DataDependentPageWrapper>
  );
}
