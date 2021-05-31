import React from 'react';

import { ErrorBoundary } from '../error-boundary';
import { Navigator } from '../navigator';
import { Footer } from '../footer';

export const PageWrapper = ({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}): React.ReactElement => (
  <div id="page-wrapper" data-testid="page-wrapper">
    <header>
      <Navigator />
    </header>
    <ErrorBoundary boundaryLocation="within-header-and-footer">
      <main>{children}</main>
    </ErrorBoundary>
    <Footer />
  </div>
);
