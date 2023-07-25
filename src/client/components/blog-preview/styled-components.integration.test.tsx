/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';

import {
  BlogPreviewTitleHeading,
  BlogPreviewWrapper,
  BlogPreviewTypeHeading,
} from './styled-components';

describe('BlogPreviewTitleHeading presentational component', () => {
  it('renders the wrapped content with the expected CSS styles and HTML attributes', () => {
    const { container } = render(
      <BlogPreviewTitleHeading>
        The Algorithms That Still Matter
      </BlogPreviewTitleHeading>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('BlogPreviewWrapper presentational component', () => {
  it('renders the wrapped content with the expected CSS styles and HTML attributes', () => {
    const { container } = render(
      <BlogPreviewWrapper $contentId="20500402-DUMMY-the-algorithms-that-still-matter">
        <div className="blog-preview-title-heading">
          The Algorithms That Still Matter
        </div>
        <span className="blog-preview-subtitle">
          A cheat sheet to some fundamentals that are older than me.
        </span>
      </BlogPreviewWrapper>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('BlogPreviewTypeHeading presentational component', () => {
  describe('When the blog type is "TECH"', () => {
    it('renders the blogType with the expected CSS styles (incl. blue font) and HTML attributes', () => {
      const { container } = render(<BlogPreviewTypeHeading blogType="TECH" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('When the blog type is not "TECH"', () => {
    it('renders the blogType with the expected CSS styles (incl. purple font) and HTML attributes', () => {
      const { container } = render(
        <BlogPreviewTypeHeading blogType="COMMENTARY" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
