import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { PageWrapper } from '../page-wrapper';
import { ErrorBoundary } from '../error-boundary';
import { Homepage } from '../../pages/home';
import { Blog } from '../../pages/blog';
import { PlaceholderPage } from '../../../../test-utils/components/placeholder-page';
import { PageStylingContainer } from './styled-components';
import {
  enabledRoutesByName,
  NavMenuLinkText,
} from '../../../shared/constants';
import { IndividualBlog } from '../../pages/individual-blog';
import { PageNotFound } from '../../pages/page-not-found';

const FontFamilies = createGlobalStyle`
  @font-face {
    font-family: JetBrainsMonoItalic;
    src: local('JetBrains Mono Italic'), url('JetBrainsMono-Italic.woff2');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: JetBrainsMono;
    src: local('JetBrains Mono Regular'), url('JetBrainsMono-Regular.woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

export function TopLevelUserInterface(): JSX.Element {
  const pageMap = new Map([
    [NavMenuLinkText.About, <PlaceholderPage pageName="About Me" />],
    [NavMenuLinkText.Projects, <PlaceholderPage pageName="Projects" />],
    [NavMenuLinkText.ThingsILike, <PlaceholderPage pageName="Things I Like" />],
    [NavMenuLinkText.Contact, <PlaceholderPage pageName="Contact Me" />],
    [NavMenuLinkText.Blog, <Blog />],
    ['Individual Blog', <IndividualBlog />],
  ]);

  return (
    <ErrorBoundary boundaryLocation="top-level">
      <FontFamilies />
      <Router>
        <PageStylingContainer>
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Homepage />} />
              {/* All routes other than the homepage can be toggled to disabled.
              Hence we set up only the enabled routes. */}
              {Array.from(enabledRoutesByName).map(([pageName, route]) => (
                <Route
                  path={route}
                  key={pageName}
                  element={pageMap.get(pageName)}
                />
              ))}
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </PageWrapper>
        </PageStylingContainer>
      </Router>
    </ErrorBoundary>
  );
}
