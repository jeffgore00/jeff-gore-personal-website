// External dependencies
import { Request, Response, NextFunction } from 'express';

// The module being tested, plus its constants
import {
  getBlogPreviews,
  GETTING_BLOG_PREVIEWS_LOG,
  ERROR_GETTING_BLOG_PREVIEWS_LOG,
} from '.';

// Types
import {
  ContentType,
  ContentSubtype,
  Previews,
} from '../../../shared/types/content-metadata';

// Internal dependencies to mock
import logger from '../../utils/runtime/logger';
import * as buildBlogPreviewsModule from '../../utils/runtime/blogs/build-blog-previews';
import * as getBlogPreviewsFileModule from '../../utils/runtime/blogs/get-blog-previews-file';

const request: Partial<Request> = {
  query: {
    useDummyPreviews: 'true',
    page: 'blog',
  },
};
const response = {
  json: jest.fn(),
} as Partial<Response>;
const next: NextFunction = jest.fn();

const samplePreviewsFromFile: Previews = {
  '20500401-DUMMY-good-design-is-a-human-right': {
    title: 'Good Design Is A Human Right',
    subtitle:
      "We shouldn't have to look at ugly things. Inside, a proposal to codify that into international law.",
    publishDate: new Date('2050-04-01'),
    contentType: ContentType.Blog,
    contentSubtype: ContentSubtype.Commentary,
    dummy: true,
    draft: false,
  },
};
const samplePreviewsFromDev: Previews = {
  '20500402-DUMMY-the-algorithms-that-still-matter': {
    title: 'The Algorithms That Still Matter',
    subtitle: 'A cheat sheet to some fundamentals that are older than me.',
    publishDate: new Date('2050-04-02'),
    contentType: ContentType.Blog,
    contentSubtype: ContentSubtype.Tech,
    dummy: true,
    draft: false,
  },
};

describe('getBlogPreviews middleware', () => {
  let infoLoggerSpy: jest.SpyInstance;
  let errorLoggerSpy: jest.SpyInstance;
  let buildBlogPreviewsSpy: jest.SpyInstance;
  let getBlogPreviewsFileSpy: jest.SpyInstance;

  beforeAll(() => {
    infoLoggerSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());
    errorLoggerSpy = jest.spyOn(logger, 'error').mockImplementation(jest.fn());
    buildBlogPreviewsSpy = jest
      .spyOn(buildBlogPreviewsModule, 'buildBlogPreviews')
      .mockImplementation(() => Promise.resolve(samplePreviewsFromDev));
    getBlogPreviewsFileSpy = jest
      .spyOn(getBlogPreviewsFileModule, 'getBlogPreviewsFile')
      .mockImplementation(() => Promise.resolve(samplePreviewsFromFile));
  });

  it('issues the expected INFO log with additional data when called', () => {
    getBlogPreviews(request as Request, response as Response, null);
    expect(infoLoggerSpy).toHaveBeenCalledWith(GETTING_BLOG_PREVIEWS_LOG, {
      page: request.query.page,
      useDummyPreviews: request.query.useDummyPreviews === 'true',
    });
  });

  describe('When the previews.json file read (prod) or object creation (dev) is successful', () => {
    // In production, access the previews JSON file that's already been built as part of the deployment process
    describe('When `process.env.NODE_ENV` is "production"', () => {
      beforeAll(() => {
        jest.clearAllMocks();
        process.env.NODE_ENV = 'production';
        getBlogPreviews(request as Request, response as Response, next);
      });
      it('calls `getBlogPreviewsFile` with the correct args', () => {
        expect(getBlogPreviewsFileSpy).toHaveBeenCalledWith({
          page: request.query.page,
          useDummyPreviews: request.query.useDummyPreviews === 'true',
        });
        expect(buildBlogPreviewsSpy).not.toHaveBeenCalled();
      });
      it('responds with the previews returned by `getBlogPreviewsFile`', () => {
        expect(response.json).toHaveBeenCalledWith(samplePreviewsFromFile);
      });
      it('does not call `next`', () => {
        expect(next).not.toHaveBeenCalled();
      });
    });

    // Not production, then build the previews on the fly rather than expecting a pre-built file.
    describe('When `process.env.NODE_ENV` is not "production"', () => {
      beforeAll(() => {
        jest.clearAllMocks();
        process.env.NODE_ENV = 'development';
        getBlogPreviews(request as Request, response as Response, next);
      });
      it('calls `buildBlogPreviewsFile` with the correct args', () => {
        expect(buildBlogPreviewsSpy).toHaveBeenCalledWith({
          page: request.query.page,
          useDummyPreviews: request.query.useDummyPreviews === 'true',
        });
        expect(getBlogPreviewsFileSpy).not.toHaveBeenCalled();
      });
      it('responds with the previews returned from `buildBlogPreviewsFile`', () => {
        expect(response.json).toHaveBeenCalledWith(samplePreviewsFromDev);
      });
      it('does not call `next`', () => {
        expect(next).not.toHaveBeenCalled();
      });
    });
  });

  describe('When theres an error getting the previews.json file (prod) or building the previews object (dev)', () => {
    const sampleError = new Error();

    beforeAll(() => {
      jest.clearAllMocks();
      process.env.NODE_ENV = 'development';
      buildBlogPreviewsSpy.mockImplementation(() =>
        Promise.reject(sampleError),
      );
      getBlogPreviews(request as Request, response as Response, next);
    });

    it('logs the occurrence', () => {
      expect(errorLoggerSpy).toHaveBeenCalledWith(
        ERROR_GETTING_BLOG_PREVIEWS_LOG,
        {
          error: sampleError,
        },
      );
    });
    it('calls `next` with that error', () => {
      expect(next).toHaveBeenCalledWith(sampleError);
    });
  });
});
