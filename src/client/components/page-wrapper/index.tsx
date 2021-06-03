import React from 'react';
import { useLocation } from 'react-router-dom';

import { ErrorBoundary } from '../error-boundary';
import { Navigator } from '../navigator';
import { Footer } from '../footer';
import { useSetPageTitle } from '../../hooks/use-set-page-title';
import {
  navMenuAllLinksByPathname,
  NavMenuLinkRoute,
} from '../../../shared/constants';

export function PageWrapper({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}): React.ReactElement {
  const location = useLocation();
  const pathnameEnum = location.pathname as NavMenuLinkRoute;

  useSetPageTitle(navMenuAllLinksByPathname.get(pathnameEnum));

  return (
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
}
