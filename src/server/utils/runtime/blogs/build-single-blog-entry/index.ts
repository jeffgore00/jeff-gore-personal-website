import path from 'path';
import { renderToStaticMarkup } from 'react-dom/server';

import { getBlogMetadata } from '../get-blog-metadata';
import { ContentMetadata } from '../../../../../shared/types/content-metadata';

const getContentPath = (filename: string) =>
  path.join(__dirname, '../../../../../../content/blogs', filename);

const getBlogContent = async (contentId: string): Promise<JSX.Element> => {
  type ContentModule = { content: JSX.Element };

  const contentFile = <ContentModule>(
    await import(getContentPath(`${contentId}/content.tsx`))
  );
  return contentFile.content;
};

export const buildSingleBlogEntry = async (
  contentId: string,
): Promise<ContentMetadata> => {
  const metadataAndContent = await Promise.all([
    getBlogMetadata(contentId),
    getBlogContent(contentId),
  ]);

  const [metadata, content] = metadataAndContent;

  const serializedContent = renderToStaticMarkup(content);

  const htmlContent = `
  <h2>${metadata.title}</h2>
  <h3>${metadata.subtitle}</h3>
  <p><i>${metadata.publishDate.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</i></p>
  ${serializedContent}`;

  return {
    ...metadata,
    htmlContent,
  };
};
