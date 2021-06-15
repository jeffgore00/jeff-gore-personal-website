import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import logger from '../../utils/logger';
import { getConfig } from '../../../shared/config';
import { Previews } from '../../../shared/types/content-metadata';

export const HOMEPAGE_RENDERED_LOG = 'Homepage Rendered';
export const HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG =
  'Homepage: Got content previews';

function buildBlogPreviewsMarkup(content: Previews, contentSubtype: string) {
  return (
    <>
      {Object.entries(content)
        .filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([contentId, contentItem]) =>
            contentItem.contentSubtype === contentSubtype,
        )
        .sort(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([contentId1, contentItem1], [contentId2, contentItem2]) =>
            new Date(contentItem2.publishDate).valueOf() -
            new Date(contentItem1.publishDate).valueOf(),
        )
        .map(([contentId, contentItem]) => {
          const parsedContentPublishDate = new Date(contentItem.publishDate);
          const formattedContentPublishDate = parsedContentPublishDate.toLocaleDateString(
            'en-US',
            {
              timeZone: 'UTC',
            },
          );

          return (
            <div key={contentId}>
              <strong>{`${contentItem.title} (${formattedContentPublishDate})`}</strong>
              <br />
              {contentItem.subtitle}
              <br />
              <br />
            </div>
          );
        })}
    </>
  );
}

const loadingContentLinesMarkup = (
  <>
    {new Array(20).fill(null).map((_, index) => (
      <Skeleton key={String.fromCharCode(index)} animation="wave" />
    ))}
  </>
);

export function Homepage(): React.ReactElement {
  const techMarkup = useRef<JSX.Element>(null);
  const nonTechMarkup = useRef<JSX.Element>(null);
  const [contentLoaded, setContentLoaded] = useState(false);

  const previewsUrl = `${
    getConfig(appEnvironment).backendUrl
  }/api/content/blogs/previews`;

  useEffect(() => {
    void logger.info(HOMEPAGE_RENDERED_LOG);
    void axios.get(previewsUrl).then((response: AxiosResponse<Previews>) => {
      void logger.info(HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG);

      const techPreviewsMarkup = (
        <>
          <p>- - - - - - - - - - - - - - - - - - - -</p>
          <h3>Latest From the Tech Blog</h3>
          {buildBlogPreviewsMarkup(response.data, 'TECH')}
        </>
      );

      const nonTechPreviewsMarkup = (
        <>
          <p>- - - - - - - - - - - - - - - - - - - -</p>
          <h3>Latest From the Commentary Blog</h3>
          {buildBlogPreviewsMarkup(response.data, 'COMMENTARY')}
        </>
      );

      techMarkup.current = techPreviewsMarkup;
      nonTechMarkup.current = nonTechPreviewsMarkup;
      setContentLoaded(true);
    });
  }, [previewsUrl]);

  return (
    <>
      <h2>
        <i>
          Welcome to my site! I work full time as a web developer. I used to
          work as a journalist. Peruse the blog!
        </i>
      </h2>
      {!contentLoaded ? (
        loadingContentLinesMarkup
      ) : (
        <>
          {techMarkup.current}
          {nonTechMarkup.current}
        </>
      )}
    </>
  );
}
