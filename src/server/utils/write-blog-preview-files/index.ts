import fs from 'fs';
import path from 'path';

import { Previews } from '../../../shared/types/content-metadata';
import {
  buildBlogPreviews,
  pathToDistBlogsContentFromSrc,
} from '../build-blog-previews';

const homePagePreviewsPath = path.join(
  pathToDistBlogsContentFromSrc,
  'home-page',
);
const blogPagePreviewsPath = path.join(
  pathToDistBlogsContentFromSrc,
  'blog-page',
);

fs.mkdirSync(homePagePreviewsPath, {
  recursive: true,
});

fs.mkdirSync(blogPagePreviewsPath, {
  recursive: true,
});

function writeSinglePreviewsFile({
  previews,
  filepath,
}: {
  previews: Previews;
  filepath: string;
}): void {
  fs.writeFileSync(path.join(filepath), JSON.stringify(previews, null, 2));
}

const previewsPaths: { [key: string]: string } = {
  home: homePagePreviewsPath,
  blog: blogPagePreviewsPath,
};

void Promise.all(
  [true, false].map((useDummyPreviews) =>
    ['home', 'blog'].map((page) =>
      buildBlogPreviews({ useDummyPreviews, page }).then((previews) => {
        const previewsPath = previewsPaths[page];
        const filename = useDummyPreviews
          ? 'dummy-previews.json'
          : 'previews.json';
        return writeSinglePreviewsFile({
          previews,
          filepath: path.join(previewsPath, filename),
        });
      }),
    ),
  ),
).then(() => {
  // eslint-disable-next-line no-console
  console.log(
    'Successfully wrote blog preview files to /dist/content/blogs/previews.',
  );
});
