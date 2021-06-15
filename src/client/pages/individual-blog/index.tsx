// External dependencies
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

// Internal dependencies
import logger from '../../utils/logger';
import { ShimmeringLinesInPlaceOfContentNotYetReady } from '../../components/loading-content-lines';

// Types and constants
import { apiUrl } from '../../constants';
import { SerializedContentAndMetadata } from '../../../shared/types/content-metadata';
import { useSetPageTitle } from '../../hooks/use-set-page-title';

export const NUMBER_OF_LOADING_LINES = 20;
export const BLOG_FETCHING_CONTENT_LOG = 'Fetching individual blog content....';
export const BLOG_GOT_CONTENT_LOG = 'Blog: Got individual blog content';

export function IndividualBlog(): React.ReactElement {
  const content = useRef<SerializedContentAndMetadata>(null);
  const [contentReady, setContentReady] = useState(false);

  useSetPageTitle(content.current ? content.current.title : 'Loading...');

  const { contentId } = useParams();
  useEffect(() => {
    const blogContentUrl = `${apiUrl}/content/blogs/${contentId}`;

    void logger.info(BLOG_FETCHING_CONTENT_LOG);
    void axios
      .get(blogContentUrl)
      .then((response: AxiosResponse<SerializedContentAndMetadata>) => {
        void logger.info(BLOG_GOT_CONTENT_LOG, { contentId });

        content.current = response.data;
        setContentReady(true);
      });
  }, [contentId]);

  return !contentReady ? (
    <ShimmeringLinesInPlaceOfContentNotYetReady
      numberOfLines={NUMBER_OF_LOADING_LINES}
    />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: content.current.htmlContent }} />
  );
}
