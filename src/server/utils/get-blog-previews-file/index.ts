import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { Previews } from '../../../shared/types/content-metadata';

const readFile = promisify(fs.readFile);

export async function getBlogPreviewsFile({
  page,
  useDummyPreviews,
}: {
  page: string;
  useDummyPreviews?: boolean;
}): Promise<Previews> {
  const filename = useDummyPreviews ? 'dummy-previews.json' : 'previews.json';
  const filePath = path.join(
    __dirname,
    `../../../../content/blogs/previews/${page}-page/${filename}`,
  );
  const contentItem = await readFile(filePath, 'utf-8');
  return <Previews>JSON.parse(contentItem);
}
