import { getBlogPreviewsFile, buildPathToPreviewsFile } from '.';
import * as nodeWrappersModule from '../../node-wrappers';

jest
  .spyOn(nodeWrappersModule, 'readFile')
  .mockImplementation((filePath) =>
    Promise.resolve(`{"filePath":"${filePath}"}`),
  );

describe('getBlogPreviewsFile', () => {
  const PAGE = 'home';

  describe('When useDummyPreviews is truthy', () => {
    it('returns the parsed JSON on the dummy-previews.json file for the specified page', async () => {
      const result = await getBlogPreviewsFile({
        page: PAGE,
        useDummyPreviews: true,
      });
      expect(result).toEqual({
        filePath: buildPathToPreviewsFile(PAGE, 'dummy-previews.json'),
      });
    });
  });

  describe('When useDummyPreviews is falsy', () => {
    it('returns the parsed JSON on the previews.json file for the specified page', async () => {
      const result = await getBlogPreviewsFile({
        page: PAGE,
        useDummyPreviews: false,
      });
      expect(result).toEqual({
        filePath: buildPathToPreviewsFile(PAGE, 'previews.json'),
      });
    });
  });
});
