import { RequestHandler } from 'express';
import path from 'path';

import { buildContentPreviews } from '../../utils/build-content-previews';
import logger from '../../utils/logger';
import { ContentMetadataModule } from '../../../shared/types/content-metadata';

const getAlreadyBuiltPreviews = async (contentType: string) => {
  const filePath = path.join(
    __dirname,
    `../../../../content/${contentType}/previews.json`,
  );

  const contentItem = <ContentMetadataModule>await import(filePath);
  return { ...contentItem.default };
};

export const getContentPreviews: RequestHandler = async (req, res, next) => {
  const {
    params: { contentType },
  } = req;

  try {
    logger.info(`Getting content previews`, {
      env: process.env.NODE_ENV,
      contentType,
    });
    const content =
      process.env.NODE_ENV === 'production'
        ? await getAlreadyBuiltPreviews(contentType)
        : await buildContentPreviews({ contentTypeDirs: [contentType] });

    res.json(content);
  } catch (err) {
    logger.error('Error getting content previews', {
      contentType,
      error: err,
    });
    next();
  }
  return null;
};
