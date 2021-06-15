import { Router } from 'express';

import healthCheck from '../middleware/health-check';
import processLogFromClient from '../middleware/process-log-from-client';
import { corsAllowWhitelistOnly } from '../middleware/cors';
import { getContentSingleItem } from '../middleware/get-content-single-item';
import { getContentPreviews } from '../middleware/get-content-previews';
import { sendResourceNotFound } from '../utils/send-resource-not-found';

const router = Router();

router.get('/health', healthCheck);
router.put('/logs', corsAllowWhitelistOnly, processLogFromClient);
router.get(
  '/content/:contentType/previews',
  getContentPreviews,
  sendResourceNotFound,
);
router.get(
  '/content/:contentType/:contentId',
  getContentSingleItem,
  sendResourceNotFound,
);

export default router;
