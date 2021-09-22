import React from 'react';
import { render, cleanup } from '@testing-library/react';

import * as BlogPreviewStyledComponents from '../../components/blog-preview/styled-components';
import { generateSpiedReactComponent } from '../../../../test-utils/generate-spied-react-component';
import { buildBlogPreviewsMarkup } from '.';
import {
  SerializedContentMetadata,
  SerializedPreviews,
} from '../../../shared/types/content-metadata';

const samplePreviews: SerializedPreviews = {
  '20500402-DUMMY-the-algorithms-that-still-matter': {
    title: 'The Algorithms That Still Matter',
    subtitle: 'A cheat sheet to some fundamentals that are older than me.',
    publishDate: '2050-04-02T00:00:00.000Z',
    contentType: 'BLOG',
    contentSubtype: 'TECH',
    dummy: true,
    draft: false,
  },
  '20500401-DUMMY-good-design-is-a-human-right': {
    title: 'Good Design Is A Human Right',
    subtitle:
      "We shouldn't have to look at ugly things. Inside, a proposal to codify that into international law.",
    publishDate: '2050-04-01T00:00:00.000Z',
    contentType: 'BLOG',
    contentSubtype: 'COMMENTARY',
    dummy: true,
    draft: false,
  },
  '20500302-DUMMY-webassembly-blast-from-the-past': {
    title: 'WebAssembly - A Blast From The Past',
    subtitle:
      'A look back at the language that was the hotness during the 2030s.',
    publishDate: '2050-03-02T00:00:00.000Z',
    contentType: 'BLOG',
    contentSubtype: 'TECH',
    dummy: true,
    draft: false,
  },
  '20500301-DUMMY-remember-when-we-had-to-remember': {
    title: 'Remember When We Had to Remember?',
    subtitle:
      'With the latest Neuralink, we welcome the end of human memory as we know it. Is that a good thing?',
    publishDate: '2050-03-01T00:00:00.000Z',
    contentType: 'BLOG',
    contentSubtype: 'COMMENTARY',
    dummy: true,
    draft: false,
  },
  '20500202-DUMMY-dna-script': {
    title: 'Coding Your Printed-Flesh Friends With DNAScript',
    subtitle:
      'Template-farmed humans are for casuals. As always, tinkering with the source yields the best results.',
    publishDate: '2050-02-02T00:00:00.000Z',
    contentType: 'BLOG',
    contentSubtype: 'TECH',
    dummy: true,
    draft: false,
  },
};

// MOCK CHILDREN COMPONENTS BlogPreviewWrapper, BlogPreviewTitleHeading, BlogPreviewTypeHeading:
generateSpiedReactComponent({
  object: BlogPreviewStyledComponents,
  method: 'BlogPreviewWrapper',
  spyOnRenderMethod: true,
  implementation: ({
    children,
    contentId,
  }: {
    children: React.ReactChild;
    contentId: string;
  }) => (
    <div id={`blog-preview-${contentId}`} className="single-blog-preview">
      {children}
    </div>
  ),
});

generateSpiedReactComponent({
  object: BlogPreviewStyledComponents,
  method: 'BlogPreviewTitleHeading',
  spyOnRenderMethod: true,
  implementation: ({ children }: { children: React.ReactChild }) => (
    <div className="blog-preview-title-heading">{children}</div>
  ),
});

generateSpiedReactComponent({
  object: BlogPreviewStyledComponents,
  method: 'BlogPreviewTypeHeading',
  implementation: ({ blogType }: { blogType: string }) => (
    <div className="blog-preview-type-heading" id={blogType} />
  ),
});

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property: useLocation"
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactChild }) => (
    <a href={to}>{children}</a>
  ),
}));

type PreviewTestEntry = {
  blogPreviewHTML: Element;
  blogPreviewId: string;
  expectedSourcePreview: SerializedContentMetadata;
  expectedDisplayedDate: string;
};

function createPreviewTestEntries(blogPreviewElements: NodeListOf<Element>) {
  const previewTestEntries: PreviewTestEntry[] = [];

  blogPreviewElements.forEach((blogPreviewHTML, index) => {
    const blogPreviewId = Object.keys(samplePreviews)[index];
    const expectedSourcePreview = samplePreviews[blogPreviewId];
    const parsedBlogPublishDate = new Date(expectedSourcePreview.publishDate);
    const expectedDisplayedDate = parsedBlogPublishDate.toLocaleDateString(
      'en-US',
      {
        timeZone: 'UTC',
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    previewTestEntries.push({
      blogPreviewHTML,
      blogPreviewId,
      expectedSourcePreview,
      expectedDisplayedDate,
    });
  });

  return previewTestEntries;
}

/* Transforms a Previews object into a collection of HTML elements containing 
the previews data, ordered by date descending. */
describe('buildBlogPreviewsMarkup', () => {
  let blogPreviewElements: NodeListOf<Element>;
  let previewTestEntries: PreviewTestEntry[] = [];

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    render(buildBlogPreviewsMarkup({ previews: samplePreviews }));
    blogPreviewElements = document.querySelectorAll('.single-blog-preview');
    previewTestEntries = createPreviewTestEntries(blogPreviewElements);
  });

  afterAll(cleanup);

  it('renders one <BlogPreviewWrapper> for each previews entry', () => {
    expect(previewTestEntries.length).toEqual(5);
  });

  it('passes the content id to the <BlogPreviewWrapper>', () => {
    previewTestEntries.forEach(({ blogPreviewHTML, blogPreviewId }) => {
      expect(blogPreviewHTML.id).toEqual(`blog-preview-${blogPreviewId}`);
    });
  });

  describe('Within the <BlogPreviewWrapper>', () => {
    it('renders the <BlogPreviewTitleHeading> with expected children, and wrapped in a link to the blog', () => {
      previewTestEntries.forEach(
        ({
          blogPreviewHTML,
          expectedSourcePreview,
          expectedDisplayedDate,
          blogPreviewId,
        }) => {
          expect(
            blogPreviewHTML.querySelector('.blog-preview-title-heading')
              .innerHTML,
          ).toEqual(
            `<a href="${`/blog/${blogPreviewId}`}">${
              expectedSourcePreview.title
            } (${expectedDisplayedDate})</a>`,
          );
        },
      );
    });

    it('renders the subtitle', () => {
      previewTestEntries.forEach(
        ({ blogPreviewHTML, expectedSourcePreview }) => {
          expect(
            blogPreviewHTML.querySelector('.blog-preview-subtitle').innerHTML,
          ).toEqual(expectedSourcePreview.subtitle);
        },
      );
    });

    describe('When `includeTypeHeading` is `true`', () => {
      beforeAll(() => {
        cleanup();
        render(
          buildBlogPreviewsMarkup({
            previews: samplePreviews,
            includeTypeHeading: true,
          }),
        );
        blogPreviewElements = document.querySelectorAll('.single-blog-preview');
        previewTestEntries = createPreviewTestEntries(blogPreviewElements);
      });

      it('includes the <BlogPreviewTypeHeading> element and passes it the preview type as props', () => {
        previewTestEntries.forEach(
          ({ blogPreviewHTML, expectedSourcePreview }) => {
            expect(
              blogPreviewHTML.querySelector('.blog-preview-type-heading').id,
            ).toEqual(expectedSourcePreview.contentSubtype);
          },
        );
      });
    });

    describe('When `blogType` is supplied', () => {
      beforeAll(() => {
        cleanup();
        render(
          buildBlogPreviewsMarkup({
            previews: samplePreviews,
            includeTypeHeading: true,
            blogType: 'TECH',
          }),
        );
        blogPreviewElements = document.querySelectorAll('.single-blog-preview');
        previewTestEntries = createPreviewTestEntries(blogPreviewElements);
      });

      it('renders a <BlogPreviewWrapper> only for blog previews matching the specified type', () => {
        // There are 5 total, 3 tech.
        expect(previewTestEntries.length).toEqual(3);

        previewTestEntries.forEach(({ blogPreviewHTML }) => {
          expect(
            blogPreviewHTML.querySelector('.blog-preview-type-heading').id,
          ).toEqual('TECH');
        });
      });
    });
  });
});
