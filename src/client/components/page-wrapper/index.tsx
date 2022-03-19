import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

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

  const PageWrapperStyled = styled.div.attrs({
    id: 'page-wrapper',
    'data-testid': 'page-wrapper',
  })`
    min-height: 93vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
  `;

  return (
    <PageWrapperStyled>
      <header>
        <Navigator />
      </header>
      <ErrorBoundary boundaryLocation="within-header-and-footer">
        <main>{children}</main>
      </ErrorBoundary>
      <Footer />
    </PageWrapperStyled>
  );
}
