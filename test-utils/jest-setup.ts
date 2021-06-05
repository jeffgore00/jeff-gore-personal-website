/* Initializes the mocked react-media wrapper with a default "mobile" width. 
Strangely, a standard `import` breaks the global `appEnvironment` var assign 
below. */
// eslint-disable-next-line
require('./react-media').setupReactMediaMock();

/* This is necessary for client-side code tests as this global env var is
injected via Webpack at build time. */
appEnvironment = 'development';

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw err;
});
