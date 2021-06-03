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

/* Possible refactor: use styled-components injectGlobal to make font-face 
available to all components.
https://stackoverflow.com/questions/42675725/isolated-styled-components-with-font-face */
const StyledPageHeader = styled.h2`
  font-family: JetBrainsMono, monospace;
  font-style: normal;
  font-size: 1.5em;
  @font-face {
    font-family: JetBrainsMono;
    src: local('JetBrains Mono Regular'), url('JetBrainsMono-Regular.woff2');
    font-weight: normal;
    font-style: normal;
  }
`;

function PlaceholderPage({ pageName }: { pageName: string }) {
  return <StyledPageHeader>{pageName}</StyledPageHeader>;
}

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
