# Jeff Gore's Personal Website

[![CircleCI](https://circleci.com/gh/jeffgore00/jeff-gore-personal-website.svg?style=shield)](https://app.circleci.com/pipelines/github/jeffgore00/jeff-gore-personal-website?branch=main)
[![Codecov](https://img.shields.io/codecov/c/gh/jeffgore00/jeff-gore-personal-website)](https://app.codecov.io/gh/jeffgore00/jeff-gore-personal-website/)

## Operating Instructions

All shell commands listed below need to be run from a Unix shell.

## Usage

First, make sure you install dependencies:

```shell
npm ci
```

Note: This repo contains the configuration for [Renovate][renovate], which automatically raises PRs in GitHub to update dependencies. This is why they are "pinned" to a specific version.

To start the application in development, use this:

```shell
npm run start:dev
```

This starts the application server on port 1337 and the Webpack development server on port 8080. (This differs from the production/default setting, which is a single server for all content.)

Once Webpack has compiled the client-side bundle, it will automatically open `http://localhost:8080` in your default web browser. All changes in the `/server` and `/client` directories are watched by nodemon and webpack-dev-server respectively, which means those servers will restart if any of the files they watch are modified.

By default, `react` and `react-dom` is fetched via CDN, rather than bundled, to minimize the size of `bundle.js`. But this default configuration does not allow for offline development. Therefore if you need to work offline, use this:

```shell
npm run start:dev:offline
```

This will signal the Webpack bundler to include React and React DOM in the bundle.

As expected, this is the command you want in production:

```shell
npm start
```

The above will start an HTTP server on `process.env.PORT` if that is defined, otherwise port 1337. This assumes that the compiled server code is available in `/dist` (see `build:server`).

## Build

You generally don't need to run these scripts in development, since `npm run start:dev` requires zero explicit build.

- `build:client` generates a Webpack bundle in `public/webpack.bundle.js`, along with a gzip-compressed version.

- `build:server` compiles the server TypeScript code into JavaScript and dumps the compiled code into the `dist` directory.

- `build` runs `build:client`, followed by `build:server`.

## Logging

### Core Functionality

A dedicated Winston `logger` exists on the application server in `src/server/utils/logger` with the methods `.error`, `.warn`, `.info`, and `.debug`, corresponding to different log levels.

Example usage:

```ts
logger.info('Fetching ships from Star Wars API');
```

The logger not only logs the message but attaches metadata: the log level, timestamp, as well as arbitrary metadata that you can provide. The `logger` outputs to the console, but can be configured via Winston transports to write the log content to another location. The above log in production looks like this (line breaks added for clarity):

```json
{
  "level": "info",
  "message": "Fetching ships from Star Wars API",
  "timestamp": "2021-03-28T16:26:32.219Z"
}
```

### Arbitrary Metadata

To add arbitrary metadata to a log, pass a second argument in the form of an object:

```ts
logger.info('Fetched current ship from Star Wars API', {
  shipId: 1,
  shipName: 'X-Wing',
  shipLocations: ['Alderaan', 'Tattoine'],
});
```

Production output:

```json
{
  "shipId": 1,
  "shipName": "X-Wing",
  "shipLocations": ["Alderaan", "Tattoine"],
  "level": "info",
  "message": "Fetched current ship from Star Wars API",
  "timestamp": "2021-03-28T16:26:32.221Z"
}
```

### Error Logging

If the additional data object is provided, contains the key name `error` and is an instance of an `Error`, the `logger` will pass the value through [serialize-error][serialize-error] before logging it. This allows you to see the stack trace of the error. (Note that this functionality exists at every log level, not just for the `.error` method.)

```ts
try {
  await axios.delete('https://www.cia.gov/api/agents/5');
} catch (error: unknown) {
  logger.error('Could not remove CIA secret agent', { error });
}
```

Production output:

```json
{
  "error": {
    "name": "Error",
    "message": "Access denied",
    "stack": "Error: Access denied\n    at /Users/bobross/Desktop/jeff-gore-personal-website/src/server/app.ts:29:11\n    at Layer.handle [as handle_request] (/Users/bobross/Desktop/jeff-gore-personal-website/node_modules/express/lib/router/layer.js:95:5)"
  },
  "level": "error",
  "message": "Could not remove CIA secret agent",
  "timestamp": "2021-03-28T16:41:22.348Z"
}
```

### Logging in Development

In development, logs are color-coded and formatted in a non-JSON string to make them easier to read and distinguish from one another. Arbitrary metadata is dimmed and presented in the format of `key=value`, its keys prepended with `data_`. The timestamp metadata appears in grey.

![Development Logger Screenshot](/public/readme-dev-logger.png 'Development Logger Screenshot')

### Passing Logs from Client to Server via API

The server exposes an API to make this logger available to clients, such as a web browser. In turn, a logger with the same function signature as the server logger is available to front-end code in `src/client/utils/logger`. This client-side logger sends the log data to the `/api/logs` endpoint, which then results in the server `logger` processing the log per the behavior described above.

The `api/logs` endpoint passes two additional pieces of metadata to the logger: `logFromClient: true` and `logSource`, which is the origin URL of the logging request. Here's an example of how the client-side `logger` would be used in a React component:

```ts
useEffect(() => {
  void logger.info('Homepage rendered');
}, []);
```

It is recommended to call the client-side logger with `void` to avoid lint errors. The logger triggers an asynchronous operation - the network call to calling `/api/logs` - but `void` signifies that the promise result does not need to be awaited, since the functionality of the app does not depend on a log being sent successfully. If the promise is rejected, the app will use a vanilla `console.error` to log the error and the intended log message.

### Logging Caveats

The downside of Winston's ability to pass arbitrary data is the possibility of interfering with core metadata by unwittingly using key names that are already in use. Here is a sample log which will not have the intended output, due to the use of reserved keys. The first three are Winston keys, the second are particular to this application.

```ts
// Again, this is an example of what NOT to do:
logger.info('Milestone', {
  level: 3, // will be ignored and does not affect log level
  message: 'Character reached new level', // will be appended to string above
  timestamp: '20200903', // will overwrite the baked-in ISO timestamp
  logFromClient: 'New Level', // will be overwritten if the log comes from /api/logs
  logSource: 'Milestone Service', // will be overwritten if the log comes from /api/logs
});
```

Output from above if the log comes from a client using `/api/logs`:

```json
{
  "level": "info",
  "message": "Milestone Character reached new level",
  "timestamp": "20200903",
  "logFromClient": true,
  "logSource": "http://domainofclientthatcalledlogsapi.com"
}
```

In sum: do not use the names `level`, `message`, `timestamp`, `logFromClient`, or `logSource` as keys for arbitrary metadata. (It would be nice if an ESLint plugin were out there to prevent people from overwriting Winston log metadata...😉)

## Testing

### Test Structure

All test files end in the extension `.test.ts`. Beyond that, the extensions vary by test type.

- Unit tests: `<name>.test.ts`
- API tests: `<name>.api.test.ts`
- Browser tests: `<name>.browser.test.ts`

This repo utilizes Jest for unit and API tests. Together, they account for the code coverage statistics and can be run with:

```shell
npm run test-unit-and-api
```

The standard `npm test` is designed to be run in a CI pipeline. It not only runs the above `npm run test-unit-and-api` script, but also ESLint and Prettier check, along with a spellcheck of all Markdown documents in the repo.

This repo does not contain the necessary configuration to run automated browser tests in CI. Therefore, if you want to run _all_ tests with one script on your machine, use:

```shell
npm run test:full:local
```

This will first run your browser tests using Chromedriver. Browser tests are run first because they should be the best indicator that your app actually works. If they fail, the script exits, and you will see screenshots for the failed tests in `test-result-screenshots` (see the Browser Tests section for more). If the browser tests succeed, then the script moves onto the unit and API tests.

### Unit Tests

A unit test file has the same name and location as the file it is designed to test, with the exception of the file extension. For example:

```
/server
|_ app.ts
|_ app.test.ts
```

### API Tests

API tests assert the expected HTTP response of the application server at a specific route, given a possible variety of request scenarios.

```
WHEN I make a PUT request to /api/logs
AND my request is in the correct shape
THEN I should receive a 200 response

WHEN I make a GET request to /api/health
THEN I should receive a 200 response
AND the response should be in the expected schema
```

They do not test side effects, such as logging, because this test is from the point of view of the consumer of the API. They are a type of integration test, as a server route often involves several middleware working in tandem. For that reason, API tests should not mock or stub out any source code (with the exception of logging code, in order to keep the console free of noise during a test).

API tests are located in `test-api` and are named after the `/api/____` server route being tested, with the exception of `_root` which is named after the main `/` route.

### Browser Tests

Automated browser tests open a browser and simulate the actions of a user on your web page, such as clicking, typing into fields, and scrolling.

In the case of this repo, these are fully integrated browser tests: the backend Express server is not mocked. Therefore these are highest-level integration tests possible, testing the entire application from the point of view of the user.

In this repo, these tests are located in the `test-browser` directory and are run with WebdriverIO with the Jasmine framework.

(Jest is currently [not supported by WebdriverIO](https://github.com/webdriverio/webdriverio/issues/2052#issuecomment-575380414) as an integrated test framework. Hence Jasmine, being an ancestor of Jest and closest to it in syntax, was chosen as the framework for browser tests.)

The `npm run test:browser` script runs the `wdio` WebdriverIO binary with a configuration file as an argument, per its standard usage. (The configuration is found in `wdio.conf.ts` and is compiled into JavaScript at runtime. The `wdio.conf.js` file is discarded after the test completes.)

Therefore you can pass any valid WDIO flag to this script, along with a few custom flags listed below.

To run non-headless automation locally, run `npm run test:browser -- -c`. As long as the major version of your `chromedriver` dev dependency matches your locally installed Chrome major version, this should work.

To run headless automation on a Selenium server against a deployed environment:

1. `npm run selenium`
2. `npm run test:browser -- -e prod`

To view all the flags for the `test:browser` script, you can use the `--info` command:

```shell
npm run test:browser -- --info
```

The definitions for these flags can be found in `wdio.conf.ts`.

<!-- prettier-ignore-start -->

[Node]: https://nodejs.org/
[Express]: https://expressjs.com/
[React]: https://reactjs.org/
[TypeScript]: https://www.typescriptlang.org/
[CircleCI]: https://circleci.com/
[Heroku]: https://www.heroku.com/
[Husky]: https://www.npmjs.com/package/husky
[ESLint]: https://eslint.org/
[Airbnb configuration]: https://www.npmjs.com/package/eslint-config-airbnb
[prettier]: https://prettier.io/
[commitlint]: https://commitlint.js.org/#/
[webpack-dev-server]: https://webpack.js.org/configuration/dev-server/
[nodemon]: https://nodemon.io/
[styled-components]: https://styled-components.com/
[typescript-plugin-styled-components]: https://github.com/Igorbek/typescript-plugin-styled-components
[React Developer Tools]: https://reactjs.org/blog/2019/08/15/new-react-devtools.html
[Jest]: https://jestjs.io/
[React Testing Library]: https://testing-library.com/docs/react-testing-library/intro/
[SuperTest]: https://www.npmjs.com/package/supertest
[WebdriverIO]: https://webdriver.io/
[Jasmine]: https://jasmine.github.io/
[Chromedriver]: https://chromedriver.chromium.org/
[selenium-standalone]: https://www.npmjs.com/package/selenium-standalone
[Webpack]: https://webpack.js.org/
[gzip]: https://en.wikipedia.org/wiki/Gzip
[webpack-bundle-analyzer]: https://www.npmjs.com/package/webpack-bundle-analyzer
[standard-version]: https://github.com/conventional-changelog/standard-version
[Morgan]: https://github.com/expressjs/morgan
[Winston]: https://github.com/winstonjs/winston
[Codecov]: https://about.codecov.io/
[Helmet]: https://helmetjs.github.io/
[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[Postman]: https://www.postman.com/
[Heroku routing magic]: https://devcenter.heroku.com/articles/http-routing#routing
[Renovate]: https://docs.renovatebot.com/
[serialize-error]: https://www.npmjs.com/package/serialize-error
<!-- prettier-ignore-end -->
