import { RequestHandler } from 'express';
import path from 'path';

import { readFile } from '../../utils/runtime/node-wrappers';
import { buildSingleBlogEntry } from '../../utils/runtime/blogs/build-single-blog-entry';
import logger from '../../utils/runtime/logger';
import { ContentMetadata } from '../../../shared/types/content-metadata';

export const GETTING_SINGLE_BLOG_CONTENT_LOG = 'Getting single blog content';
export const ERROR_GETTING_SINGLE_BLOG_CONTENT_LOG =
  'Error getting single blog content';

export const getFilepathToSingleBlogContent = (contentId: string): string =>
  path.join(__dirname, `../../../../content/blogs/${contentId}/content.json`);

const getAlreadyBuiltBlog = async (contentId: string) => {
  const filePath = getFilepathToSingleBlogContent(contentId);
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
    logger.info(GETTING_SINGLE_BLOG_CONTENT_LOG, {
      contentId,
    });
    const content =
      process.env.NODE_ENV === 'production'
        ? await getAlreadyBuiltBlog(contentId)
        : await buildSingleBlogEntry(contentId);

    res.json(content);
  } catch (err) {
    logger.error(ERROR_GETTING_SINGLE_BLOG_CONTENT_LOG, {
      contentId,
      error: err,
    });
    next();
  }
  return null;
};
