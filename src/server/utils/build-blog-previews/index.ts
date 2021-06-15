/* eslint-disable no-await-in-loop, no-continue, no-restricted-syntax */
import fs from 'fs';
import path from 'path';

import { getMetadata } from '../build-single-blog-entry';
import {
  ContentSubtype,
  Previews,
} from '../../../shared/types/content-metadata';

export const pathToDistBlogsContentFromSrc = path.join(
  __dirname,
  '../../../../dist/content/blogs/previews',
);

export async function buildBlogPreviews({
  page,
  useDummyPreviews = false,
}: {
  page: string;
  useDummyPreviews?: boolean;
}): Promise<Previews> {
  const relativePathToBlogsContent = path.join(
    __dirname,
    '../../../../content/blogs',
  );

  const contentSubtypeOccurrences: Map<ContentSubtype, number> = new Map([
    [ContentSubtype.Commentary, 0],
    [ContentSubtype.Tech, 0],
  ]);

  const previews: Previews = {};
  const contentEntries = fs.readdirSync(path.join(relativePathToBlogsContent));

  // Sort descending, assuming the date is in the title, for the newest blogs.
  const sortedContentEntries = contentEntries.sort().reverse();

  for (const contentEntry of sortedContentEntries) {
    const metadata = await getMetadata('blogs', contentEntry);
    const occurrences = contentSubtypeOccurrences.get(metadata.contentSubtype);
    if (metadata.draft === true) {
      continue;
    } else if (page === 'home' && occurrences === 3) {
      continue;
    } else {
      contentSubtypeOccurrences.set(metadata.contentSubtype, occurrences + 1);
    }

    if (useDummyPreviews && metadata.dummy) {
      previews[contentEntry] = metadata;
    } else if (!useDummyPreviews && !metadata.dummy) {
      previews[contentEntry] = metadata;
    }
  }

  return previews;
}
