// External dependencies
import React from 'react';
import axios from 'axios';
import { render, act, RenderResult, cleanup } from '@testing-library/react';

// The module being tested, plus its constants
import {
  Homepage,
  HOMEPAGE_RENDERED_LOG,
  HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG,
  NUMBER_OF_LOADING_LINES,
} from '.';

// Test utils
import { generateSpiedReactComponent } from '../../../../test-utils/generate-spied-react-component';

// Internal dependencies to mock
import logger from '../../utils/logger';
import * as buildBlogPreviewsMarkupModule from '../../utils/build-blog-previews-markup';
import * as LoadingLinesModule from '../../components/loading-content-lines';
import * as useAdditionalParamsStringModule from '../../hooks/use-additional-params-string';
import { AboutMeHeader } from './styled-components';

describe('Homepage', () => {
  let infoLoggerSpy: jest.SpyInstance;
  let axiosGetSpy: jest.SpyInstance;
  let previewsMarkupSpy: jest.SpyInstance;
  let component: RenderResult;

  const delayedContentApiResponse = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, data: { sampleDataKey: 'sampleDataValue' } });
    }, 1000);
  });

  beforeAll(async () => {
    generateSpiedReactComponent({
      object: AboutMeHeader,
      method: 'render',
      implementation: () => <div data-testid="homepage-about-me-blurb" />,
    });

    generateSpiedReactComponent({
      object: LoadingLinesModule,
      method: 'ShimmeringLinesInPlaceOfContentNotYetReady',
      implementation: () => (
        <div data-testid={`${NUMBER_OF_LOADING_LINES}-loading-lines`} />
      ),
    });

    infoLoggerSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());
    axiosGetSpy = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => delayedContentApiResponse);
    previewsMarkupSpy = jest
      .spyOn(buildBlogPreviewsMarkupModule, 'buildBlogPreviewsMarkup')
      .mockImplementation(({ blogType }) => (
        <div className={`mocked-previews-markup-${blogType}`} />
      ));

    jest
      .spyOn(useAdditionalParamsStringModule, 'useAdditionalParamsString')
      .mockImplementation(() => '');

    await act(async () => {
      component = render(<Homepage />);
      return Promise.resolve();
    });
  });

  it('sends a log to the server to signify successful render', () => {
    expect(infoLoggerSpy).toHaveBeenCalledWith(HOMEPAGE_RENDERED_LOG);
  });

  it('calls the blog previews API endpoint with `page=home`', () => {
    expect(axiosGetSpy).toHaveBeenCalledWith(
      'http://localhost:1337/api/content/blogs/previews?page=home',
    );
  });

  it('renders the About Me header', () => {
    expect(component.queryByTestId('homepage-about-me-blurb')).toBeTruthy();
  });

  describe('When the blog previews have not yet loaded', () => {
    /* Test setup is already done for this test by using a delayed API response. That means that at
    the time the component finishes rendering, the API has not yet returned the data. */
    it('displays content loading lines', () => {
      expect(
        component.queryByTestId(`${NUMBER_OF_LOADING_LINES}-loading-lines`),
      ).toBeTruthy();
    });
  });

  describe('When the blog previews have loaded', () => {
    const contentFromServer = { sampleDataKey2: 'sampleDataValue2' };

    beforeAll(async () => {
      jest.clearAllMocks();
      // Remove DOM rendered content from parent `describe`
      cleanup();

      /* This time, make the API respond with no latency whatsoever. That should translate to the 
      component rendering immediately with the content. */
      axiosGetSpy = jest
        .spyOn(axios, 'get')
        .mockImplementation(() =>
          Promise.resolve({ status: 200, data: contentFromServer }),
        );

      await act(async () => {
        component = render(<Homepage />);
        return Promise.resolve();
      });
    });

    it('logs the occurrence', () => {
      expect(infoLoggerSpy).toHaveBeenCalledWith(
        HOMEPAGE_GOT_CONTENT_PREVIEWS_LOG,
      );
    });

    it('calls buildBlogPreviewsMarkup with correct arguments, including data from server', () => {
      expect(previewsMarkupSpy).toHaveBeenCalledWith({
        blogType: 'TECH',
        previews: contentFromServer,
      });

      expect(previewsMarkupSpy).toHaveBeenCalledWith({
        blogType: 'COMMENTARY',
        previews: contentFromServer,
      });
    });

    it('displays the JSX returned from buildBlogPreviewsMarkup for both categories', () => {
      expect(
        document.querySelector('.mocked-previews-markup-TECH'),
      ).toBeTruthy();
      expect(
        document.querySelector('.mocked-previews-markup-COMMENTARY'),
      ).toBeTruthy();
    });

    it('does not display content loading lines', () => {
      expect(
        component.queryByTestId(`${NUMBER_OF_LOADING_LINES}-loading-lines`),
      ).not.toBeTruthy();
    });
  });
});
