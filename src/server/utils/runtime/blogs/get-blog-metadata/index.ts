import path from 'path';

import {
  ContentMetadata,
  ContentMetadataModule,
} from '../../../../../shared/types/content-metadata';

const getContentPath = (filename: string) =>
  path.join(__dirname, '../../../../../../content/blogs', filename);

export const getBlogMetadata = async (
  contentId: string,
): Promise<ContentMetadata> => {
  const metadataFile = <ContentMetadataModule>(
    await import(getContentPath(`${contentId}/metadata.ts`))
  );
  return metadataFile.default;
};
