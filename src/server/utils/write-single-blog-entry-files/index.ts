import fs from 'fs';
import path from 'path';

import { buildSingleBlogEntry } from '../build-single-blog-entry';

// Only intended to be run from /src directory in build process.
async function writeSingleBlogEntryFiles() {
  const relativePathToContent = path.join(__dirname, '../../../../content');
  const pathToDistContentFromSrc = path.join(
    __dirname,
    '../../../../dist/content',
  );

  const contentTypeDirs = fs.readdirSync(relativePathToContent);
  // eslint-disable-next-line no-restricted-syntax
  for (const contentTypeDir of contentTypeDirs) {
    const contentEntries = fs.readdirSync(
      path.join(relativePathToContent, contentTypeDir),
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const contentEntry of contentEntries) {
      // eslint-disable-next-line no-await-in-loop
      const entry = await buildSingleBlogEntry(contentTypeDir, contentEntry);
      const directory = path.join(
        pathToDistContentFromSrc,
        contentTypeDir,
        contentEntry,
      );

      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(
        path.join(directory, 'content.json'),
        JSON.stringify(entry, null, 2),
      );
    }
  }
}

void writeSingleBlogEntryFiles().then(() => {
  // eslint-disable-next-line no-console
  console.log('Successfully wrote blog entry files to /dist/content/blogs.');
});