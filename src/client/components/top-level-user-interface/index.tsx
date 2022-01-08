import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

export function TopLevelUserInterface(): JSX.Element {
  const pageMap = new Map([
    [NavMenuLinkText.About, <PlaceholderPage pageName="About Me" />],
    [NavMenuLinkText.Blog, <Blog />],
    [NavMenuLinkText.Projects, <PlaceholderPage pageName="Projects" />],
    [NavMenuLinkText.ThingsILike, <PlaceholderPage pageName="Things I Like" />],
    [NavMenuLinkText.Contact, <PlaceholderPage pageName="Contact Me" />],
  ]);

  return (
    <ErrorBoundary boundaryLocation="top-level">
      <Router>
        <PageStylingContainer>
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Homepage />} />
              {Array.from(navMenuEnabledLinks).map(([pageName, route]) => (
                <Route
                  path={route}
                  key={pageName}
                  element={pageMap.get(pageName)}
                />
              ))}
            </Routes>
          </PageWrapper>
        </PageStylingContainer>
      </Router>
    </ErrorBoundary>
  );
}
