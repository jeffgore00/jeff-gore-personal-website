import fs from 'fs';
import path from 'path';

import { getMetadata } from '../build-content-single-item';
import { Previews } from '../../../shared/types/content-metadata';

export async function buildContentPreviews({
  contentTypeDirs,
  writeFiles = false,
}: {
  contentTypeDirs?: string[];
  writeFiles?: boolean;
}): Promise<Previews> {
  const relativePathToContent = path.join(__dirname, '../../../../content');
  const pathToDistContentFromSrc = path.join(
    __dirname,
    '../../../../dist/content',
  );

  const previews: Previews = {};
  const contentTypeDirsToRead =
    contentTypeDirs || fs.readdirSync(relativePathToContent);

  // eslint-disable-next-line no-restricted-syntax
  for (const contentTypeDir of contentTypeDirsToRead) {
    const contentEntries = fs.readdirSync(
      path.join(relativePathToContent, contentTypeDir),
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const contentEntry of contentEntries) {
      // eslint-disable-next-line no-await-in-loop
      const metadata = await getMetadata(contentTypeDir, contentEntry);

      previews[contentEntry] = metadata;
    }

    // Only intended to be run from /src directory in build process.
    if (writeFiles) {
      fs.writeFileSync(
        path.join(pathToDistContentFromSrc, contentTypeDir, 'previews.json'),
        JSON.stringify(previews, null, 2),
      );
    }
  }
  return previews;
}
