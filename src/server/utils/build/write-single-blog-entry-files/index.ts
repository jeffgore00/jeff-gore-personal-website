/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from 'chalk';
import path from 'path';

import { buildSingleBlogEntry } from '../../runtime/blogs/build-single-blog-entry';
import {
  mkdirSync,
  writeFileSync,
  readdirSync,
} from '../../runtime/node-wrappers';

export const pathToDistContentFromSrc = path.join(
  __dirname,
  '../../../../../dist/content/blogs',
);

// Only intended to be run from /src directory in build process.
async function writeSingleBlogEntryFiles() {
  const relativePathToContent = path.join(
    __dirname,
    '../../../../../content/blogs',
  );

  const contentEntries = readdirSync(relativePathToContent);

  // eslint-disable-next-line no-restricted-syntax
  for (const contentEntry of contentEntries) {
    // eslint-disable-next-line no-await-in-loop
    const entry = await buildSingleBlogEntry(contentEntry);
    const directory = path.join(pathToDistContentFromSrc, contentEntry);

    mkdirSync(directory, { recursive: true });
    writeFileSync(
      path.join(directory, 'content.json'),
      JSON.stringify(entry, null, 2),
    );
  }
  return contentEntries;
}

void writeSingleBlogEntryFiles().then((contentEntries) => {
  console.log(
    chalk.green(
      `Successfully wrote blog entry files to ${pathToDistContentFromSrc}.`,
    ),
  );
  console.log(`ENTRIES:\n${contentEntries.join('\n')}`);
});
