import React from 'react';
import { render } from '@testing-library/react';

import { TopLevelUserInterface } from '.';
import * as PageWrapperModule from '../page-wrapper';
import * as ErrorBoundaryModule from '../error-boundary';
import * as HomepageModule from '../../pages/home';
import * as BlogModule from '../../pages/blog';
import { generateSpiedReactComponent } from '../../../../test-utils/generate-spied-react-component';
import { navMenuEnabledLinks } from '../../../shared/constants';

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property"
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactChild }) => (
    <div id="router">{children}</div>
  ),
  Route: ({ path, children }: { path: string; children: React.ReactChild }) => (
    <div id={`route-to-${path}`}>{children}</div>
  ),
  Link: jest.fn(),
}));

generateSpiedReactComponent({
  object: PageWrapperModule,
  method: 'PageWrapper',
  implementation: ({ children }: { children: React.ReactChild }) => (
    <div id="page-wrapper">{children}</div>
  ),
});

generateSpiedReactComponent({
  object: ErrorBoundaryModule,
  method: 'ErrorBoundary',
  implementation: ({ children }: { children: React.ReactChild }) => (
    <div id="error-boundary">{children}</div>
  ),
});

generateSpiedReactComponent({
  object: HomepageModule,
  method: 'Homepage',
  implementation: () => <div id="homepage" />,
});

generateSpiedReactComponent({
  object: BlogModule,
  method: 'Blog',
  implementation: () => <div id="blog" />,
});

describe('The <TopLevelUserInterface> component', () => {
  beforeAll(() => {
    const topLevelDiv = document.createElement('div');
    topLevelDiv.setAttribute('id', 'testing-container');
    render(<TopLevelUserInterface />, {
      container: document.body.appendChild(topLevelDiv),
    });
  });

  it('renders an error boundary at the top level', () => {
    const testContainer = document.getElementById('testing-container');
    expect(testContainer.children[0].getAttribute('id')).toEqual(
      'error-boundary',
    );
  });

  it('renders the router within the error boundary', () => {
    const router = document.getElementById('router');
    expect(router.closest('#testing-container')).toBeTruthy();
  });

  it('renders the page styles within the router', () => {
    const pageStylingContainer = document.getElementById(
      'page-styling-container',
    );
    expect(pageStylingContainer.closest('#router')).toBeTruthy();
  });

  it('renders the page wrapper within the page styles', () => {
    const pageWrapper = document.getElementById('page-wrapper');
    expect(pageWrapper.closest('#page-styling-container')).toBeTruthy();
  });

  it('renders the homepage within the page wrapper', () => {
    const homepageWithRoute = document.getElementById('route-to-/');
    expect(homepageWithRoute.closest('#page-wrapper')).toBeTruthy();
    expect(homepageWithRoute.innerHTML).toEqual(`<div id="homepage"></div>`);
  });

  it('renders a route to an individual blog within the page wrapper', () => {
    const individualBlogRoute = document.getElementById(
      'route-to-/blog/:contentId',
    );
    expect(individualBlogRoute.closest('#page-wrapper')).toBeTruthy();
  });

  navMenuEnabledLinks.forEach((route, pageName) => {
    it(`renders the "${pageName}" page within the page wrapper`, () => {
      const pageWithRoute = document.getElementById(`route-to-${route}`);
      expect(pageWithRoute.closest('#page-wrapper')).toBeTruthy();
    });
  });
});
