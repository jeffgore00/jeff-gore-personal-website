/* eslint-disable global-require, @typescript-eslint/no-unsafe-assignment */

const contentKeys = [
  '20500402-THIS-IS-A-FAKE-BLOG',
  '20500402-THIS-IS-ANOTHER-FAKE-BLOG',
  '20500402-THIS-IS-YET-ANOTHER-FAKE-BLOG',
];

const stringify = (obj: unknown) => JSON.stringify(obj, null, 2);

describe('writeSingleBlogEntryFiles', () => {
  let writeFileSyncSpy: jest.SpyInstance;
  let pathToDistContentFromSrc: string;

  beforeAll(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const nodeWrappers = require('../../runtime/node-wrappers');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
      const buildSingleBlogEntryModule = require('../../runtime/blogs/build-single-blog-entry');

      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(nodeWrappers, 'mkdirSync');

      writeFileSyncSpy = jest.spyOn(nodeWrappers, 'writeFileSync');
      jest
        .spyOn(nodeWrappers, 'readdirSync')
        .mockImplementation(() => contentKeys);

      jest
        .spyOn(buildSingleBlogEntryModule, 'buildSingleBlogEntry')
        .mockImplementation((contentId) => ({
          htmlContent: `<div>${contentId}</div>`,
        }));

      ({ pathToDistContentFromSrc } = require('.'));
    });
  });

  it('writes a content.json for every entry', () => {
    expect(writeFileSyncSpy.mock.calls).toEqual(
      contentKeys.map((contentKey) => [
        // Argument 1, the filepath of the soon-to-be-built content
        `${pathToDistContentFromSrc}/${contentKey}/content.json`,
        // Argument 2, the content itself, a JSON object.
        stringify({
          htmlContent: `<div>${contentKey}</div>`,
        }),
      ]),
    );
  });
});
