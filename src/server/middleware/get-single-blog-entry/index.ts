import { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { buildSingleBlogEntry } from '../../utils/runtime/blogs/build-single-blog-entry';
import logger from '../../utils/runtime/logger';
import { ContentMetadata } from '../../../shared/types/content-metadata';

const readFile = promisify(fs.readFile);

const getAlreadyBuiltBlog = async (contentId: string) => {
  const filePath = path.join(
    __dirname,
    `../../../../content/blogs/${contentId}/content.json`,
  );

  const contentFile = await readFile(filePath, 'utf-8');
  const contentItem = <ContentMetadata>JSON.parse(contentFile);
  return { ...contentItem, static: true };
};

export const getSingleBlogEntryContent: RequestHandler = async (
  req,
  res,
  next,
) => {
  const {
    params: { contentId },
  } = req;

  try {
    logger.info(`Getting single blog entry`, {
      env: process.env.NODE_ENV,
      contentId,
    });
    const content =
      process.env.NODE_ENV === 'production'
        ? await getAlreadyBuiltBlog(contentId)
        : await buildSingleBlogEntry(contentId);

    res.json(content);
  } catch (err) {
    logger.error('Error getting single blog entry', {
      contentId,
      error: err,
    });
    next();
  }
  return null;
};
