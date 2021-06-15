import path from 'path';
import { renderToStaticMarkup } from 'react-dom/server';

import { getBlogMetadata } from '../get-blog-metadata';
import { ContentWithMetadata } from '../../../../../shared/types/content-metadata';

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
): Promise<ContentWithMetadata> => {
  const metadataAndContent = await Promise.all([
    getBlogMetadata(contentId),
    getBlogContent(contentId),
  ]);

  const [metadata, content] = metadataAndContent;

  const serializedContent = renderToStaticMarkup(content);

  const htmlContent = `<h2 id="blog-title">${
    metadata.title
  }</h2><h3 id="blog-subtitle">${
    metadata.subtitle
  }</h3><span id="blog-publish-date">${metadata.publishDate.toLocaleDateString(
    'en-US',
    {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )}</span><div id="blog-content">${serializedContent}</div>`;

  /* 
  Sample output:
  
  <h2>The Algorithms That Still Matter</h2>
  <h3>A cheat sheet to some fundamentals that are older than me.</h3>

  <span>April 2, 2050</span>

  <div id="blog-content">
    <p>Here are some algos that will blow you away.</p>
  </div>
  */

  return {
    ...metadata,
    htmlContent,
  };
};
