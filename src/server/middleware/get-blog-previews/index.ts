import { RequestHandler } from 'express';

import { buildBlogPreviews } from '../../utils/build-blog-previews';
import { getBlogPreviewsFile } from '../../utils/get-blog-previews-file';
import logger from '../../utils/logger';

export const getBlogPreviews: RequestHandler = async (req, res, next) => {
  const {
    query: { useDummyPreviews, page },
  } = req;

  try {
    logger.info(`Getting blog previews`, {
      page,
      useDummyPreviews: !!useDummyPreviews,
    });
    const previews =
      process.env.NODE_ENV === 'production'
        ? await getBlogPreviewsFile({
            page: String(page),
            useDummyPreviews: useDummyPreviews === 'true',
          })
        : await buildBlogPreviews({
            page: String(page),
            useDummyPreviews: useDummyPreviews === 'true',
          });

    res.json(previews);
  } catch (err) {
    logger.error('Error getting blog previews', {
      error: err,
    });
    next(err);
  }
  return null;
};
