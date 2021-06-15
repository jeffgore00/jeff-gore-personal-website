import { RequestHandler } from 'express';

import { buildBlogPreviews } from '../../utils/runtime/blogs/build-blog-previews';
import { getBlogPreviewsFile } from '../../utils/runtime/blogs/get-blog-previews-file';
import logger from '../../utils/runtime/logger';

export const GETTING_BLOG_PREVIEWS_LOG = 'Getting blog previews';
export const ERROR_GETTING_BLOG_PREVIEWS_LOG = 'Error getting blog previews';

export const getBlogPreviews: RequestHandler = async (req, res, next) => {
  const {
    query: { useDummyPreviews: useDummyPreviewsString, page },
  } = req;

  const useDummyPreviews = useDummyPreviewsString === 'true';

  try {
    logger.info(GETTING_BLOG_PREVIEWS_LOG, {
      page,
      useDummyPreviews,
    });
    const previews =
      process.env.NODE_ENV === 'production'
        ? await getBlogPreviewsFile({
            page: String(page),
            useDummyPreviews,
          })
        : await buildBlogPreviews({
            page: String(page),
            useDummyPreviews,
          });

    res.json(previews);
  } catch (err) {
    logger.error(ERROR_GETTING_BLOG_PREVIEWS_LOG, {
      error: err,
    });
    next(err);
  }
  return null;
};
