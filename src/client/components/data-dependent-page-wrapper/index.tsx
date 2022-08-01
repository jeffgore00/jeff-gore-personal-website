// External dependencies
import React, { useEffect, useState, useRef } from 'react';

// Internal dependencies
import logger from '../../utils/logger';
import { PageNotFound } from '../../pages/page-not-found';

// Types and constants
import { ShimmeringLinesInPlaceOfContentNotYetReady } from '../loading-content-lines';
import { useSetPageTitle } from '../../hooks/use-set-page-title';

export const NUMBER_OF_LOADING_LINES = 20;

export function DataDependentPageWrapper({
  children,
  contentUrl,
  setPageTitleTo,
}: {
  children: React.FunctionComponent;
  contentUrl: string;
  setPageTitleTo?: (data: unknown) => string;
}): React.ReactElement {
  const [notFoundResponse, setNotFoundResponse] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const data = useRef<unknown>();

  useSetPageTitle(data.current && setPageTitleTo(data.current));

  useEffect(() => {
    fetch(contentUrl)
      .then((response) => {
        if (response.status === 404) {
          setNotFoundResponse(true);
          return Promise.resolve();
        }
        if (!response.ok) {
          return Promise.reject();
        }
        return response.json();
      })
      .then((responseBody: unknown) => {
        data.current = responseBody;
        setFetchSuccess(true);
      })
      .catch((error?: Error) => {
        void logger.error('ERROR FETCHING CONTENT', error && { error });
        setRequestFailed(true);
      });
  }, [contentUrl]);

  if (notFoundResponse) {
    return <PageNotFound />;
  }
  if (requestFailed) {
    return <div data-testid="system-down">System Down</div>;
  }
  if (!fetchSuccess) {
    return (
      <ShimmeringLinesInPlaceOfContentNotYetReady
        numberOfLines={NUMBER_OF_LOADING_LINES}
      />
    );
  }
  // TODO: figure out this types issue
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return children(data.current);
}

DataDependentPageWrapper.defaultProps = {
  setPageTitleTo: function setPageTitleTo() {},
};
