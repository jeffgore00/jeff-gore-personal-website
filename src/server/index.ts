import http from 'http';
import { Application } from 'express';

import app from './app';
import logger from './utils/runtime/logger';

function createServer(expressApp: Application): http.Server {
  /* When Heroku was free and this app was deployed there, Heroku magically took care making this an 
  HTTPS server, but unsure if the same would be true for other platforms. */
  return http.createServer(expressApp);
}

const server = createServer(app);
const port = process.env.PORT || '1337';

server.listen(port, () => {
  logger.info(`HTTP server listening on port ${port}`);
});
