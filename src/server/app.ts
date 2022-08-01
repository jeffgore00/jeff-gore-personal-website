import path from 'path';

import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import apiRouter from './routers/api';
import logger from './utils/runtime/logger';
import { sendHtmlForEnabledRoutes } from './utils/runtime/send-html-for-enabled-routes';
import { sendResourceNotFound } from './middleware/send-resource-not-found';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': "'self'", // provided by default if `directives` are not supplied, but since I am supplying custom directives below, I have to add this as well
        'script-src': [
          "'self'",
          'https://unpkg.com',
          'https://ajax.googleapis.com',
        ], // for React and React DOM and HCJ JQuery
        'style-src': ["'self'", "'unsafe-inline'"], // for Styled Components
      },
    },
  }),
);

/* The default CORS rules prevent the app from applying different CORS standards to different
routes. Set the default to maximum permissiveness and then allow varying levels of control at the
route level via the custom CORS middleware. */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.set('Cache-Control', 'no-store');
  next();
});

/* Request/response logs. Do not use in `test` since API tests' console output
would be cluttered with logs. */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('short'));
}

// On a request for a .js file, modify the request to look for the gzipped version
app.get('*.js', (req, res, next) => {
  if (!req.url.includes('hcj/_scripts')) {
    req.url += '.gz';
    res.set('Content-Encoding', 'gzip');
    res.header('Content-Type', 'application/javascript');
    next();
  } else {
    res.header('Content-Type', 'application/javascript');
    next();
  }
});

/* When the server gets a request for a **file**, look in the /public directory.
The relative path in production is different because there are files in the
/server directory that import files from the root directory. Because of this
dependency this causes the TypeScript compiler to create /src **within** the /dist
directory, rather than /dist contents mapping to /src contents.

This is mildly inconvenient, but much better than the alternative of forbidding
new /server files from using anything outside of the /server directory. Enforcing
that would require a custom eslint rule and could limit future functionality. */
let publicRelativePath = '../../public';

if (process.env.NODE_ENV === 'production') {
  publicRelativePath = `../${publicRelativePath}`;
}

// This only works when the static files are requested from the root route (/).
app.use(express.static(path.join(__dirname, publicRelativePath)));

/* ...Therefore if we want to allow users to go directly to routes (e.g. /projects) without going
through the home page, we need to configure the app to send index.html for those routes as well. */
sendHtmlForEnabledRoutes(app, path.join(__dirname, publicRelativePath));

// If request is JSON, it will be available as `request.body`
app.use(express.json());

/* This needs to be defined with four arguments in order to satisfy Express's definition of
an error request hander, hence the unused `next` argument is necessary */
export const sendErrorResponse: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next,
) => {
  logger.error('SERVER 500 ERROR', { error: err });
  res.sendStatus(500);
};

/* APPLY CUSTOM MIDDLEWARE */
app.use('/api', apiRouter);
app.use(sendResourceNotFound(path.join(__dirname, publicRelativePath)));
app.use(sendErrorResponse);

export default app;
