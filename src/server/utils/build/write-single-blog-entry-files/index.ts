import fs from 'fs';
import path from 'path';

import { buildSingleBlogEntry } from '../../runtime/blogs/build-single-blog-entry';

// Only intended to be run from /src directory in build process.
async function writeSingleBlogEntryFiles() {
  const relativePathToContent = path.join(
    __dirname,
    '../../../../../content/blogs',
  );
  const pathToDistContentFromSrc = path.join(
    __dirname,
    '../../../../../dist/content/blogs',
  );

  const contentEntries = fs.readdirSync(relativePathToContent);

  // eslint-disable-next-line no-restricted-syntax
  for (const contentEntry of contentEntries) {
    // eslint-disable-next-line no-await-in-loop
    const entry = await buildSingleBlogEntry(contentEntry);
    const directory = path.join(pathToDistContentFromSrc, contentEntry);

    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(
      path.join(directory, 'content.json'),
      JSON.stringify(entry, null, 2),
    );
  }
}

void writeSingleBlogEntryFiles().then(() => {
  // eslint-disable-next-line no-console
  console.log('Successfully wrote blog entry files to /dist/content/blogs.');
});
