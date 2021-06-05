/* This is necessary for client-side code tests as this global env var is
injected via Webpack at build time. */
appEnvironment = 'development';

jest.mock('react-media', () => jest.fn());
