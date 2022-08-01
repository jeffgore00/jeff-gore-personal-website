/**
 * @jest-environment jsdom
 */

// External dependencies
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';

// The module being tested, plus its constants
import {
  IndividualBlog,
  BLOG_FETCHING_CONTENT_LOG,
  BLOG_GOT_CONTENT_LOG,
} from '.';

// Test utils
import { generateSpiedReactComponent } from '../../../../test-utils/generate-spied-react-component';

// Internal dependencies to mock
import logger from '../../utils/logger';
import * as LoadingLinesModule from '../../components/loading-content-lines';
import * as PageNotFoundModule from '../page-not-found';
import * as DataDependentPageWrapperModule from '../../components/data-dependent-page-wrapper';

const contentId = '20500402-DUMMY-the-algorithms-that-still-matter';
const contentApiResponse = {
  title: 'The Algorithms That Still Matter',
  subtitle: 'A cheat sheet to some fundamentals that are older than me.',
  publishDate: '2050-04-02T00:00:00.000Z',
  contentType: 'BLOG',
  contentSubtype: 'TECH',
  dummy: true,
  draft: false,
  htmlContent:
    '<h2 id="blog-title">The Algorithms That Still Matter</h2><h3 id="blog-subtitle">A cheat sheet to some fundamentals that are older than me.</h3><span id="blog-publish-date">April 2, 2050</span><div id="blog-content"><p>Here are some algos that will blow you away.</p></div>',
};

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property: useLocation"
jest.mock('react-router-dom', () => ({
  useParams: () => ({
    contentId,
  }),
}));

generateSpiedReactComponent({
  object: PageNotFoundModule,
  method: 'PageNotFound',
  implementation: () => <div id="page-not-found" />,
});

describe('Individual Blog Page', () => {
  let infoLoggerSpy: jest.SpyInstance;

  beforeAll(async () => {
    const title = document.createElement('title');
    document.head.appendChild(title);

    generateSpiedReactComponent({
      object: DataDependentPageWrapperModule,
      method: 'DataDependentPageWrapper',
      implementation: ({
        children,
        setPageTitleTo,
      }: {
        children: React.FunctionComponent;
        setPageTitleTo: (data: unknown) => void;
      }) => {
        setPageTitleTo({ title: 'Sample Blog Title' });
        return children(contentApiResponse);
      },
    });

    generateSpiedReactComponent({
      object: LoadingLinesModule,
      method: 'ShimmeringLinesInPlaceOfContentNotYetReady',
      implementation: () => <div data-testid={`${20}-loading-lines`} />,
    });

    infoLoggerSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());

    await act(async () => {
      render(<IndividualBlog />);
      // component = render(<IndividualBlog />);
      return Promise.resolve();
    });
  });

  it('sends a log to the server that it is fetching content', () => {
    expect(infoLoggerSpy).toHaveBeenCalledWith(BLOG_FETCHING_CONTENT_LOG);
  });

  describe('When the blog content has loaded', () => {
    beforeAll(async () => {
      jest.clearAllMocks();
      // Remove DOM rendered content from parent `describe`
      cleanup();

      await act(async () => {
        render(<IndividualBlog />);
        return Promise.resolve();
      });
    });

    it('logs the that the blog content has been successfully loaded, with the content ID as metadata', () => {
      expect(infoLoggerSpy).toHaveBeenCalledWith(BLOG_GOT_CONTENT_LOG, {
        contentId,
      });
    });

    it('renders the HTML returned from the content API', () => {
      expect(document.querySelector('article').innerHTML).toEqual(
        contentApiResponse.htmlContent,
      );
    });
  });
});
