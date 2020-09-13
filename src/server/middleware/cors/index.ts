import cors, { CorsOptionsDelegate } from 'cors';
import { RequestHandler, Response, Request } from 'express';
import logger from '../../utils/logger';
import { getConfig } from '../../../shared/config';

const { corsWhitelist } = getConfig();

const buildCorsHandler = (req: Request, res: Response): CorsOptionsDelegate => (
  request,
  callback,
) => {
  const handleCorsError = (): void => {
    logger.warn(
      `Request "${req.method} ${req.originalUrl}" from origin ${req.headers.origin}, user agent ${req.headers['user-agent']} blocked by CORS policy`,
      { requestBody: JSON.stringify(req.body) },
    );
    res.sendStatus(403);
  };

  if (
    !corsWhitelist.includes('*') &&
    !corsWhitelist.includes(req.headers.origin)
  ) {
    return handleCorsError();
  }

  /* Once the request has passed through the gauntlet above, trust it entirely. The below keys in
  the config are equivalent to "Access-Control-Allow-______" headers on the response. Perhaps in
  the future, this can be more nuanced so that each entry in the whitelist has its own allowed
  methods and headers. */
  const corsOptions = {
    origin: req.headers.origin,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: '*',
  };

  return callback(null, corsOptions);
};

/* The "same-origin policy" doesn't apply to requests from tools like Postman or the browser
console, in which the origin is undefined (i.e., not originating from another URL). This middleware
prevents access from requests with an undefined origin. (Though granted, you can just hardcode
the `Origin` header to one of the whitelist values if you know the whitelist. And it's easy to guess
that the same origin is part of the whitelist.) */
export const corsAllowWhitelistOnly: RequestHandler = (req, res, next) =>
  cors(buildCorsHandler(req, res))(req, res, next);
