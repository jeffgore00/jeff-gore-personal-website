import path from 'path';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  ContentMetadata,
  ContentMetadataModule,
} from '../../../shared/types/content-metadata';

const getContentPath = (contentType: string, filename: string) =>
  path.join(__dirname, '../../../../content', contentType, filename);

export const getMetadata = async (
  contentType: string,
  contentId: string,
): Promise<ContentMetadata> => {
  const metadataFile = <ContentMetadataModule>(
    await import(getContentPath(contentType, `${contentId}/metadata.ts`))
  );
  return metadataFile.default;
};

const getRawContent = async (
  contentType: string,
  contentId: string,
): Promise<JSX.Element> => {
  type ContentModule = { content: JSX.Element };

  const contentFile = <ContentModule>(
    await import(getContentPath(contentType, `${contentId}/content.tsx`))
  );
  return contentFile.content;
};

export const buildContentSingleItem = async (
  contentType: string,
  contentId: string,
): Promise<ContentMetadata> => {
  const metadataAndContent = await Promise.all([
    getMetadata(contentType, contentId),
    getRawContent(contentType, contentId),
  ]);

  const [metadata, content] = metadataAndContent;

  const serializedContent = renderToStaticMarkup(content);

  const htmlContent =
    metadata.contentType === 'BLOG'
      ? `
  <h2>${metadata.title}</h2>
  <h3>${metadata.subtitle}</h3>
  <p><i>${metadata.publishDate.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</i></p>
  ${serializedContent}`
      : serializedContent;

  return {
    ...metadata,
    htmlContent,
  };
};
