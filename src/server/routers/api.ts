import { Router } from 'express';

import healthCheck from '../middleware/health-check';
import processLogFromClient from '../middleware/process-log-from-client';
import { corsAllowWhitelistOnly } from '../middleware/cors';
import { getBlogPreviews } from '../middleware/get-blog-previews';

const router = Router();

router.get('/health', healthCheck);
router.put('/logs', corsAllowWhitelistOnly, processLogFromClient);
router.get('/content/blogs/previews', getBlogPreviews);

export default router;
