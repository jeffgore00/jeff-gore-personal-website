/* Initializes the mocked react-media wrapper with a default "mobile" width. 
Strangely, a standard `import` breaks the global `appEnvironment` var assign 
below. */
// eslint-disable-next-line
require('./react-media').setupReactMediaMock();

/* This is necessary for client-side code tests as this global env var is
injected via Webpack at build time. */
appEnvironment = 'development';

/* .setImmediate is used by Winston logging library, which is invoked in logging integration tests.
In this repo Jest uses a `JSDOM` global environment ('testEnvironment': 'jsdom'). In the browser, 
`setImmediate` is non-standard. These non-standard globals that are Node-specific were disabled in 
the JSDOM test environment in Jest 27. 

This seems to be the most faithful polyfill, but unfortunately results in failing tests:

   global.setImmediate = setTimeout(() => {}, 0);

Hence a plain noop function instead.
*/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.setImmediate = () => {};

const response: unknown = {
  status: 200,
  json: () => Promise.resolve({}),
};

global.fetch = () => Promise.resolve(response as Response);

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw err;
});
