/**
 * @jest-environment jsdom
 */

// External dependencies
import React from 'react';
import { render, act, RenderResult, cleanup } from '@testing-library/react';

// The module being tested, plus its constants
import { Homepage } from '.';

// Test utils
import { generateSpiedReactComponent } from '../../../../test-utils/generate-spied-react-component';

// Internal dependencies to mock
import * as buildBlogPreviewsMarkupModule from '../../utils/build-blog-previews-markup';
// import * as LoadingLinesModule from '../../components/loading-content-lines';
import * as useAdditionalParamsStringModule from '../../hooks/use-additional-params-string';
import * as DataDependentPageWrapperModule from '../../components/data-dependent-page-wrapper';
import { AboutMeHeader } from './styled-components';

describe('Homepage', () => {
  let previewsMarkupSpy: jest.SpyInstance;
  let component: RenderResult;

  beforeAll(async () => {
    generateSpiedReactComponent({
      object: DataDependentPageWrapperModule,
      method: 'DataDependentPageWrapper',
      implementation: ({ children }: { children: React.FunctionComponent }) =>
        children({ sampleDataKey2: 'sampleDataValue2' }),
    });

    generateSpiedReactComponent({
      object: AboutMeHeader,
      method: 'render',
      implementation: () => <div data-testid="homepage-about-me-blurb" />,
    });

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

  it('renders the About Me header', () => {
    expect(component.queryByTestId('homepage-about-me-blurb')).toBeTruthy();
  });

  describe('When the blog previews have loaded', () => {
    beforeAll(async () => {
      jest.clearAllMocks();
      // Remove DOM rendered content from parent `describe`
      cleanup();

      await act(async () => {
        component = render(<Homepage />);
        return Promise.resolve();
      });
    });

    it('calls buildBlogPreviewsMarkup with correct arguments, including data from server', () => {
      expect(previewsMarkupSpy).toHaveBeenCalledWith({
        blogType: 'TECH',
        previews: { sampleDataKey2: 'sampleDataValue2' },
        includeDate: false,
      });

      expect(previewsMarkupSpy).toHaveBeenCalledWith({
        blogType: 'COMMENTARY',
        previews: { sampleDataKey2: 'sampleDataValue2' },
        includeDate: false,
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
  });
});
