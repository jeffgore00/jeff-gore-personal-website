import { Router, RequestHandler } from 'express';

import healthCheck from '../middleware/health-check';
import processLogFromClient from '../middleware/process-log-from-client';
import { corsAllowWhitelistOnly } from '../middleware/cors';
import { getBlogPreviews } from '../middleware/get-blog-previews';
import { getSingleBlogEntryContent } from '../middleware/get-single-blog-entry';
import { sendResourceNotFound } from '../middleware/send-resource-not-found';

const router = Router();

router.get('/health', healthCheck);
router.put('/logs', corsAllowWhitelistOnly, processLogFromClient);
router.get('/content/blogs/previews', <RequestHandler>getBlogPreviews);
router.get(
  '/content/blogs/:contentId',
  <RequestHandler>getSingleBlogEntryContent,
  sendResourceNotFound,
);

export default router;
