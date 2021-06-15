// External dependencies

// The module being tested, plus its constants
import { buildBlogPreviews } from '.';
import { ContentMetadata } from '../../../../../shared/types/content-metadata';

// Types

// Internal dependencies to mock
import * as getBlogMetadataModule from '../get-blog-metadata';
import * as readdirSyncModule from '../../node-wrappers';

const mockBlogPreviews: {
  [key: string]: { contentSubtype: string; dummy?: boolean; draft?: boolean };
} = {
  '20500101-happy-half-millenium': {
    contentSubtype: 'COMMENTARY',
  },
  '20500201-my-trip-to-mars': {
    contentSubtype: 'COMMENTARY',
  },
  '20500301-remember-when-we-had-to-remember': {
    contentSubtype: 'COMMENTARY',
  },
  '20500315-good-design-is-a-human-right': {
    contentSubtype: 'COMMENTARY',
  },
  '20500102-testing-open-source-holographs': {
    contentSubtype: 'TECH',
  },
  '20500202-dna-script': {
    contentSubtype: 'TECH',
  },
  '20500401-webassembly-blast-from-the-past': {
    contentSubtype: 'TECH',
  },
  '20500402-the-algorithms-that-still-matter': {
    contentSubtype: 'TECH',
  },
  '20500501-DRAFT-commentary': {
    contentSubtype: 'COMMENTARY',
    draft: true,
  },
  '20500502-DRAFT-tech': {
    contentSubtype: 'TECH',
    draft: true,
  },
  '20500101-DUMMY-happy-half-millenium': {
    contentSubtype: 'COMMENTARY',
    dummy: true,
  },
  '20500201-DUMMY-my-trip-to-mars': {
    contentSubtype: 'COMMENTARY',
    dummy: true,
  },
  '20500301-DUMMY-remember-when-we-had-to-remember': {
    contentSubtype: 'COMMENTARY',
    dummy: true,
  },
  '20500315-DUMMY-good-design-is-a-human-right': {
    contentSubtype: 'COMMENTARY',
    dummy: true,
  },
  '20500102-DUMMY-testing-open-source-holographs': {
    contentSubtype: 'TECH',
    dummy: true,
  },
  '20500202-DUMMY-dna-script': {
    contentSubtype: 'TECH',
    dummy: true,
  },
  '20500401-DUMMY-webassembly-blast-from-the-past': {
    contentSubtype: 'TECH',
    dummy: true,
  },
  '20500402-DUMMY-the-algorithms-that-still-matter': {
    contentSubtype: 'TECH',
    dummy: true,
  },
  '20500501-DUMMY-DRAFT-commentary': {
    contentSubtype: 'COMMENTARY',
    dummy: true,
    draft: true,
  },
  '20500502-DUMMY-DRAFT-tech': {
    contentSubtype: 'TECH',
    dummy: true,
    draft: true,
  },
};

describe('buildBlogPreviews', () => {
  beforeAll(() => {
    jest
      .spyOn(readdirSyncModule, 'readdirSync')
      .mockImplementation(() => Object.keys(mockBlogPreviews));
    jest
      .spyOn(getBlogMetadataModule, 'getBlogMetadata')
      .mockImplementation((key) =>
        Promise.resolve(<ContentMetadata>mockBlogPreviews[key]),
      );
  });

  describe('When useDummyPreviews is `true`', () => {
    const mostRecentDummyNonDraftBlogs = [
      '20500402-DUMMY-the-algorithms-that-still-matter',
      '20500401-DUMMY-webassembly-blast-from-the-past',
      '20500315-DUMMY-good-design-is-a-human-right',
      '20500301-DUMMY-remember-when-we-had-to-remember',
      '20500202-DUMMY-dna-script',
      '20500201-DUMMY-my-trip-to-mars',
    ];

    describe('When the page is `home`', () => {
      it('returns the three most recent dummy non-draft blogs from each category', async () => {
        const blogPreviews = await buildBlogPreviews({
          page: 'home',
          useDummyPreviews: true,
        });
        expect(Object.keys(blogPreviews)).toEqual(mostRecentDummyNonDraftBlogs);
      });
    });

    describe('When the page is not `home`', () => {
      it('returns previews data for all of the dummy non-draft blogs', async () => {
        const blogPreviews = await buildBlogPreviews({
          page: 'blog',
          useDummyPreviews: true,
        });
        expect(Object.keys(blogPreviews)).toEqual([
          ...mostRecentDummyNonDraftBlogs,
          '20500102-DUMMY-testing-open-source-holographs',
          '20500101-DUMMY-happy-half-millenium',
        ]);
      });
    });
  });
  describe('When useDummyPreviews is `false` or undefined', () => {
    const mostRecentDummyNonDraftBlogs = [
      '20500402-the-algorithms-that-still-matter',
      '20500401-webassembly-blast-from-the-past',
      '20500315-good-design-is-a-human-right',
      '20500301-remember-when-we-had-to-remember',
      '20500202-dna-script',
      '20500201-my-trip-to-mars',
    ];

    describe('When the page is `home`', () => {
      it('returns the three most recent non-dummy, non-draft blogs from each category', async () => {
        const blogPreviews = await buildBlogPreviews({
          page: 'home',
        });
        expect(Object.keys(blogPreviews)).toEqual(mostRecentDummyNonDraftBlogs);
      });
    });

    describe('When the page is not `home`', () => {
      it('returns previews data for all of the non-dummy, non-draft blogs', async () => {
        const blogPreviews = await buildBlogPreviews({
          page: 'blog',
          useDummyPreviews: false,
        });
        expect(Object.keys(blogPreviews)).toEqual([
          ...mostRecentDummyNonDraftBlogs,
          '20500102-testing-open-source-holographs',
          '20500101-happy-half-millenium',
        ]);
      });
    });
  });
});
