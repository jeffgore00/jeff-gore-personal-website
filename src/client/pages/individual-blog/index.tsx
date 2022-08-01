// External dependencies
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

// Internal dependencies
import logger from '../../utils/logger';
import { ShimmeringLinesInPlaceOfContentNotYetReady } from '../../components/loading-content-lines';

// Types and constants
import { apiUrl } from '../../constants';
import { SerializedContentAndMetadata } from '../../../shared/types/content-metadata';
import { useSetPageTitle } from '../../hooks/use-set-page-title';
import { PageNotFound } from '../page-not-found';

export const NUMBER_OF_LOADING_LINES = 20;
export const BLOG_FETCHING_CONTENT_LOG = 'Fetching individual blog content....';
export const BLOG_GOT_CONTENT_LOG = 'Blog: Got individual blog content';

export function IndividualBlog(): React.ReactElement {
  const content = useRef<SerializedContentAndMetadata>(null);
  const [contentReady, setContentReady] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  // FIX THIS, SHOWS LOADING ON PAGE ERRORS
  useSetPageTitle(content.current ? content.current.title : 'Loading...');

  const { contentId } = useParams();
  useEffect(() => {
    const blogContentUrl = `${apiUrl}/content/blogs/${contentId}`;

    void logger.info(BLOG_FETCHING_CONTENT_LOG);
    void fetch(blogContentUrl)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response.status);
        }
        return response.json();
      })
      .then((responseBody: SerializedContentAndMetadata) => {
        void logger.info(BLOG_GOT_CONTENT_LOG, { contentId });

        content.current = responseBody;
        setContentReady(true);
      })
      .catch((error) => {
        // eslint-disable-next-line
        void logger.error('ERROR FETCHING CONTENT WIP', { error });
        setLoadingError(true);
      });
  }, [contentId]);

  if (loadingError) {
    return <PageNotFound />;
  }
  if (!contentReady) {
    return (
      <ShimmeringLinesInPlaceOfContentNotYetReady
        numberOfLines={NUMBER_OF_LOADING_LINES}
      />
    );
  }
  return <article>{parse(content.current.htmlContent)}</article>;
}
