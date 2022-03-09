// External dependencies
import { Request, Response, NextFunction } from 'express';

// The module being tested, plus its constants
import {
  getSingleBlogEntryContent,
  GETTING_SINGLE_BLOG_CONTENT_LOG,
  ERROR_GETTING_SINGLE_BLOG_CONTENT_LOG,
  getFilepathToSingleBlogContent,
} from '.';

// Types
import {
  ContentType,
  ContentSubtype,
} from '../../../shared/types/content-metadata';

// Internal dependencies to mock
import logger from '../../utils/runtime/logger';
import * as buildSingleBlogEntryModule from '../../utils/runtime/blogs/build-single-blog-entry';
import * as nodeWrappersModule from '../../utils/runtime/node-wrappers';

const CONTENT_ID = '20500101-DUMMY-happy-half-millenium';
const sampleContentFromProd = {
  title: "Holy God, I'm 64 Years Old",
  subtitle: 'A reflection on decades of making fart noises and bird calls.',
  publishDate: '2050-01-01T00:00:00.000Z',
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Commentary,
  dummy: true,
  draft: false,
  htmlContent:
    "\n  <h2>Holy God, I'm 64 Years Old</h2>\n  <h3>A reflection on decades of making fart noises and bird calls.</h3>\n  <p><i>January 1, 2050</i></p>\n  <p>This dude (me) is OLD!</p>",
  static: true,
};

const sampleContentFromDev = {
  title: 'Testing Open Source Holographs',
  subtitle: "Yes, it's possible. Here's how to plork this daunting task.",
  publishDate: new Date('2050-01-02'),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
  dummy: true,
  draft: false,
  htmlContent:
    "\n  <h2>Testing Open Source Holographs</h2>\n  <h3>Yes, it's possible. Here's how to plork this daunting task.</h3>\n  <p><i>January 2, 2050</i></p>\n  <p>This dude (me) is OLD!</p>",
};

const request: Partial<Request> = {
  params: {
    contentId: '20500101-DUMMY-happy-half-millenium',
  },
};
const response = {
  json: jest.fn(),
} as Partial<Response>;
const next: NextFunction = jest.fn();

describe('getSingleBlogEntryContent middleware', () => {
  let infoLoggerSpy: jest.SpyInstance;
  let errorLoggerSpy: jest.SpyInstance;
  let buildSingleBlogEntrySpy: jest.SpyInstance;
  let readFileSpy: jest.SpyInstance;

  beforeAll(() => {
    infoLoggerSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());
    errorLoggerSpy = jest.spyOn(logger, 'error').mockImplementation(jest.fn());
    buildSingleBlogEntrySpy = jest
      .spyOn(buildSingleBlogEntryModule, 'buildSingleBlogEntry')
      .mockImplementation(() => Promise.resolve(sampleContentFromDev));
    readFileSpy = jest
      .spyOn(nodeWrappersModule, 'readFile')
      .mockImplementation(() =>
        Promise.resolve(JSON.stringify(sampleContentFromProd)),
      );
  });

  it('issues the expected INFO log with additional data when called', async () => {
    await getSingleBlogEntryContent(
      request as Request,
      response as Response,
      null,
    );
    expect(infoLoggerSpy).toHaveBeenCalledWith(
      GETTING_SINGLE_BLOG_CONTENT_LOG,
      {
        contentId: CONTENT_ID,
      },
    );
  });

  describe('When the .json file read (prod) or object creation (dev) is successful', () => {
    // In production, access the previews JSON file that's already been built as part of the deployment process
    describe('When `process.env.NODE_ENV` is "production"', () => {
      beforeAll(async () => {
        jest.clearAllMocks();
        process.env.NODE_ENV = 'production';
        await getSingleBlogEntryContent(
          request as Request,
          response as Response,
          next,
        );
      });
      it('calls `readFile` with the correct args', () => {
        expect(readFileSpy).toHaveBeenCalledWith(
          getFilepathToSingleBlogContent(CONTENT_ID),
          'utf-8',
        );
      });
      it('responds with the previews returned by `readFile` PLUS static: true', () => {
        expect(response.json).toHaveBeenCalledWith(sampleContentFromProd);
      });
      it('does not call `next`', () => {
        expect(next).not.toHaveBeenCalled();
      });
    });

    // Not production, then build the previews on the fly rather than expecting a pre-built file.
    describe('When `process.env.NODE_ENV` is not "production"', () => {
      beforeAll(async () => {
        jest.clearAllMocks();
        process.env.NODE_ENV = 'development';
        await getSingleBlogEntryContent(
          request as Request,
          response as Response,
          next,
        );
      });
      it('calls `buildSingleBlogEntry` with the correct args', () => {
        expect(buildSingleBlogEntrySpy).toHaveBeenCalledWith(CONTENT_ID);
        expect(readFileSpy).not.toHaveBeenCalled();
      });
      it('responds with the previews returned from `buildSingleBlogEntry`', () => {
        expect(response.json).toHaveBeenCalledWith(sampleContentFromDev);
      });
      it('does not call `next`', () => {
        expect(next).not.toHaveBeenCalled();
      });
    });
  });

  describe('When theres an error getting the previews.json file (prod) or building the previews object (dev)', () => {
    const sampleError = new Error();

    beforeAll(async () => {
      jest.clearAllMocks();
      process.env.NODE_ENV = 'development';
      buildSingleBlogEntrySpy.mockImplementation(() =>
        Promise.reject(sampleError),
      );
      await getSingleBlogEntryContent(
        request as Request,
        response as Response,
        next,
      );
    });

    it('logs the occurrence', () => {
      expect(errorLoggerSpy).toHaveBeenCalledWith(
        ERROR_GETTING_SINGLE_BLOG_CONTENT_LOG,
        {
          contentId: CONTENT_ID,
          error: sampleError,
        },
      );
    });
    it('calls `next` with no error (to allow it to go to 404 middleware)', () => {
      expect(next).toHaveBeenCalledWith();
    });
  });
});
