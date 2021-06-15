import { RequestHandler } from 'express';
import path from 'path';

import { buildContentSingleItem } from '../../utils/build-content-single-item';
import logger from '../../utils/logger';
import { ContentMetadataModule } from '../../../shared/types/content-metadata';

const getAlreadyBuiltContentItem = async (
  contentType: string,
  contentId: string,
) => {
  const filePath = path.join(
    __dirname,
    `../../../../content/${contentType}/${contentId}/content.json`,
  );

  const contentItem = <ContentMetadataModule>await import(filePath);
  return { ...contentItem.default, static: true };
};

export const getContentSingleItem: RequestHandler = async (req, res, next) => {
  const {
    params: { contentType, contentId },
  } = req;

  try {
    logger.info(`Getting single content item`, {
      env: process.env.NODE_ENV,
      contentType,
      contentId,
    });
    const content =
      process.env.NODE_ENV === 'production'
        ? await getAlreadyBuiltContentItem(contentType, contentId)
        : await buildContentSingleItem(contentType, contentId);

    res.json(content);
  } catch (err) {
    logger.error('Error getting single content item', {
      contentType,
      contentId,
      error: err,
    });
    next();
  }
  return null;
};
