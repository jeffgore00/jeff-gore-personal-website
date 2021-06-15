/* eslint-disable global-require, @typescript-eslint/no-unsafe-assignment */

// Types and constants
import { pathToDistBlogsContentFromSrc } from '../../runtime/blogs/build-blog-previews';
import {
  ContentSubtype,
  ContentType,
} from '../../../../shared/types/content-metadata';

const mockPreview = {
  title: 'hi',
  publishDate: new Date(),
  contentType: ContentType.Blog,
  contentSubtype: ContentSubtype.Tech,
  draft: false,
  dummy: true,
};

describe('Write Blog Preview Files', () => {
  let mkdirSyncSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;
  let buildBlogPreviewsSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let homePagePreviewsPath: string;
  let blogPagePreviewsPath: string;

  beforeAll(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const nodeWrappers = require('../../runtime/node-wrappers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const buildBlogPreviewsModule = require('../../runtime/blogs/build-blog-previews');

      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => null);
      mkdirSyncSpy = jest.spyOn(nodeWrappers, 'mkdirSync');
      writeFileSyncSpy = jest.spyOn(nodeWrappers, 'writeFileSync');
      buildBlogPreviewsSpy = jest
        .spyOn(buildBlogPreviewsModule, 'buildBlogPreviews')
        .mockImplementation(({ useDummyPreviews, page }) =>
          Promise.resolve({
            [`useDummyPreviews${useDummyPreviews}Page${page}`]: mockPreview,
          }),
        );

      ({ homePagePreviewsPath, blogPagePreviewsPath } = require('.'));
    });
  });

  it('Creates a `home-page`  directory', () => {
    expect(mkdirSyncSpy).toHaveBeenCalledWith(homePagePreviewsPath, {
      recursive: true,
    });
  });

  it('Creates a `blog-page`  directory', () => {
    expect(mkdirSyncSpy).toHaveBeenCalledWith(blogPagePreviewsPath, {
      recursive: true,
    });
  });

  it('Calls buildBlogPreviews four times with the combo of dummy/no-dummy, home/blog', () => {
    expect(buildBlogPreviewsSpy).toHaveBeenCalledTimes(4);
    expect(buildBlogPreviewsSpy).toHaveBeenCalledWith({
      useDummyPreviews: true,
      page: 'home',
    });
    expect(buildBlogPreviewsSpy).toHaveBeenCalledWith({
      useDummyPreviews: true,
      page: 'blog',
    });
    expect(buildBlogPreviewsSpy).toHaveBeenCalledWith({
      useDummyPreviews: false,
      page: 'home',
    });
    expect(buildBlogPreviewsSpy).toHaveBeenCalledWith({
      useDummyPreviews: false,
      page: 'blog',
    });
  });

  const stringify = (obj: unknown) => JSON.stringify(obj, null, 2);

  // Four files home-page/previews.json, home-page/dummy-previews.json, blog-page/dummy-previews.json, blog-page/dummy-previews.json
  it('Creates the four files', () => {
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(4);
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      `${homePagePreviewsPath}/dummy-previews.json`,
      stringify({
        useDummyPreviewstruePagehome: mockPreview,
      }),
    );

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      `${blogPagePreviewsPath}/dummy-previews.json`,
      stringify({
        useDummyPreviewstruePageblog: mockPreview,
      }),
    );

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      `${homePagePreviewsPath}/previews.json`,
      stringify({
        useDummyPreviewsfalsePagehome: mockPreview,
      }),
    );

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      `${blogPagePreviewsPath}/previews.json`,
      stringify({
        useDummyPreviewsfalsePageblog: mockPreview,
      }),
    );
  });

  it('Logs success when all files have been written', () => {
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Successfully wrote blog preview files to ${pathToDistBlogsContentFromSrc}.`,
    );
  });
});
