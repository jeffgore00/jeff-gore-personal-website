/* eslint-disable no-await-in-loop, no-continue, no-restricted-syntax */
import path from 'path';

import { getBlogMetadata } from '../get-blog-metadata';
import {
  ContentSubtype,
  Previews,
} from '../../../../../shared/types/content-metadata';
import { readdirSync } from '../../node-wrappers';

export const pathToDistBlogsContentFromSrc = path.join(
  __dirname,
  '../../../../../../dist/content/blogs/previews',
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
    '../../../../../../content/blogs',
  );

  const occurrencesByBlogType: Map<ContentSubtype, number> = new Map([
    [ContentSubtype.Commentary, 0],
    [ContentSubtype.Tech, 0],
  ]);

  const getTotalOccurrences = () => {
    const values = occurrencesByBlogType.values();
    const commentaryOccurrences = <number>values.next().value;
    const techOccurrences = <number>values.next().value;

    return commentaryOccurrences + techOccurrences;
  };

  const previews: Previews = {};

  /* Accumulate all the blog directory names in an array. The dir name should
  look like DATE-TITLE e.g. "20500201-my-trip-to-mars" */
  const blogKeys = readdirSync(path.join(relativePathToBlogsContent));

  // Since the date is in the title, we can sort descending for the newest blogs.
  const blogKeysSortedByNewestFirst = blogKeys.sort().reverse();

  for (const blogKey of blogKeysSortedByNewestFirst) {
    /* For the homepage, we only want 3 previews per blog type ("Latest from the Blog").
    If there are 6 total that means both types are satisfied and we can end this loop. */
    if (page === 'home' && getTotalOccurrences() === 6) {
      break;
    }

    /* For any other filtering we're going to have to learn more about this blog entry from
    its structured metadata. For instance, whether this is a dummy or draft post, and what type of
    blog it is (Tech or Commentary). 
    
    (POSSIBLE REFACTOR: Just use the filename for dummy and draft info as well, so that you don't have to read the metadata.)   */
    const metadata = await getBlogMetadata(blogKey);

    const newerBlogsOfThisType = occurrencesByBlogType.get(
      metadata.contentSubtype,
    );

    if (page === 'home' && newerBlogsOfThisType === 3) {
      continue;
    }

    const shouldIgnoreThisPreviewDueToDummySetting =
      (useDummyPreviews && !metadata.dummy) ||
      (!useDummyPreviews && metadata.dummy);

    if (shouldIgnoreThisPreviewDueToDummySetting) {
      continue;
    }

    // Ignore draft blogs entirely, which can only be accessed through a direct URL.
    if (!metadata.draft) {
      occurrencesByBlogType.set(
        metadata.contentSubtype,
        newerBlogsOfThisType + 1,
      );

      previews[blogKey] = metadata;
    }
  }

  return previews;
}
