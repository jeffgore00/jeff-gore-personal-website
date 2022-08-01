// External dependencies
import React from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

// Types and constants
import { apiUrl } from '../../constants';
import { SerializedContentAndMetadata } from '../../../shared/types/content-metadata';
import { DataDependentPageWrapper } from '../../components/data-dependent-page-wrapper';
import logger from '../../utils/logger';

export const BLOG_FETCHING_CONTENT_LOG = 'Fetching individual blog content....';
export const BLOG_GOT_CONTENT_LOG = 'Blog: Got individual blog content';

export function IndividualBlog(): React.ReactElement {
  const { contentId } = useParams();
  const blogContentUrl = `${apiUrl}/content/blogs/${contentId}`;

  void logger.info(BLOG_FETCHING_CONTENT_LOG);

  return (
    <DataDependentPageWrapper
      contentUrl={blogContentUrl}
      setPageTitleTo={(data: SerializedContentAndMetadata) => data.title}
    >
      {(data: SerializedContentAndMetadata) => {
        void logger.info(BLOG_GOT_CONTENT_LOG, { contentId });
        return <article>{parse(data.htmlContent)}</article>;
      }}
    </DataDependentPageWrapper>
  );
}
