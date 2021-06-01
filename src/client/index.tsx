import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PageWrapper } from './components/page-wrapper';
import { ErrorBoundary } from './components/error-boundary';
import { Homepage } from './components/homepage';
import { navMenuEnabledLinks, NavMenuLinkText } from '../shared/constants';

const PageStylingContainer = styled.div.attrs({
  id: 'page-styling-container',
})`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 40px;
  font-family: Helvetica, sans serif;
`;

const pageMap = new Map([
  [NavMenuLinkText.About, <h2>About Me</h2>],
  [NavMenuLinkText.Blog, <h2>Blog</h2>],
  [NavMenuLinkText.Projects, <h2>Projects</h2>],
  [NavMenuLinkText.ThingsILike, <h2>Things I Like</h2>],
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
