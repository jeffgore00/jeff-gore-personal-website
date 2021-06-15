import path from 'path';

import { readFile } from '../../node-wrappers';
import { Previews } from '../../../../../shared/types/content-metadata';

export const buildPathToPreviewsFile = (
  page: string,
  filename: string,
): string =>
  path.join(
    __dirname,
    `../../../../../../content/blogs/previews/${page}-page/${filename}`,
  );

export async function getBlogPreviewsFile({
  page,
  useDummyPreviews,
}: {
  page: string;
  useDummyPreviews?: boolean;
}): Promise<Previews> {
  const filename = useDummyPreviews ? 'dummy-previews.json' : 'previews.json';
  const filePath = buildPathToPreviewsFile(page, filename);
  const contentItem = await readFile(filePath, 'utf-8');
  return <Previews>JSON.parse(contentItem);
}
