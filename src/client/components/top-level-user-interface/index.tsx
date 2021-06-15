import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PageWrapper } from '../page-wrapper';
import { ErrorBoundary } from '../error-boundary';
import { Homepage } from '../../pages/home';
import { Blog } from '../../pages/blog';
import { PlaceholderPage } from '../../../../test-utils/components/placeholder-page';
import { PageStylingContainer } from './styled-components';
import {
  navMenuEnabledLinks,
  NavMenuLinkText,
} from '../../../shared/constants';

const pageMap = new Map([
  [NavMenuLinkText.About, <PlaceholderPage pageName="About Me" />],
  [NavMenuLinkText.Projects, <PlaceholderPage pageName="Projects" />],
  [NavMenuLinkText.ThingsILike, <PlaceholderPage pageName="Things I Like" />],
  [NavMenuLinkText.Contact, <PlaceholderPage pageName="Contact Me" />],
]);

export const TopLevelUserInterface = (): JSX.Element => (
  <ErrorBoundary boundaryLocation="top-level">
    <Router>
      <PageStylingContainer>
        <PageWrapper>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/blog">
            <Blog />
          </Route>
          <>
            {Array.from(navMenuEnabledLinks).map(([pageName, route]) => (
              <Route exact path={route} key={pageName}>
                {pageMap.get(pageName)}
              </Route>
            ))}
          </>
        </PageWrapper>
      </PageStylingContainer>
    </Router>
  </ErrorBoundary>
);
