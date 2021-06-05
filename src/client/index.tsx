import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PageWrapper } from './components/page-wrapper';
import { ErrorBoundary } from './components/error-boundary';
import { Homepage } from './components/homepage';
import { navMenuEnabledLinks, NavMenuLinkText } from '../shared/constants';
import { PlaceholderPage } from '../../test-utils/components/placeholder-page';
import { PageStylingContainer } from './styled-components';

const pageMap = new Map([
  [NavMenuLinkText.About, <PlaceholderPage pageName="About Me" />],
  [NavMenuLinkText.Blog, <PlaceholderPage pageName="Blog" />],
  [NavMenuLinkText.Projects, <PlaceholderPage pageName="Projects" />],
  [NavMenuLinkText.ThingsILike, <PlaceholderPage pageName="Things I Like" />],
  [NavMenuLinkText.Contact, <PlaceholderPage pageName="Contact Me" />],
]);

export const TopLevelUserInterface = (
  <Router>
    <PageStylingContainer>
      <ErrorBoundary boundaryLocation="top-level">
        <PageWrapper>
          <Route exact path="/">
            <Homepage />
          </Route>
          <>
            {Array.from(navMenuEnabledLinks).map(([pageName, route]) => (
              <Route exact path={route} key={pageName}>
                {pageMap.get(pageName)}
              </Route>
            ))}
          </>
        </PageWrapper>
      </ErrorBoundary>
    </PageStylingContainer>
  </Router>
);

ReactDOM.render(TopLevelUserInterface, document.getElementById('root'));
