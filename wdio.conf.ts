import { Options } from '@wdio/types';
import yargs from 'yargs/yargs';
import fs from 'fs';

/*
The use of "var" is required here, see 
https://javascript.plainenglish.io/typescript-and-global-variables-in-node-js-59c4bf40cb31
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#type-checking-for-globalthis
*/
/* eslint-disable no-var, vars-on-top */
declare global {
  var wdioBaseUrl: string;
  var specFilename: string;
  /* `browser` is injected by WDIO into the global namespace, but the @wdio/types
      Clients.Browser type definition is empty. ¯\_(ツ)_/¯ */
  var browser: {
    saveScreenshot: (filepath: string) => void;
  };
}
/* eslint-enable no-var, vars-on-top */

enum Environment {
  dev = 'dev',
  prod = 'prod',
  localProdlike = 'localProdlike',
}

enum ScreenshotModes {
  always = 'always',
  never = 'never',
  failedTestsOnly = 'failedTestsOnly',
}

/* "[In Node, the] first element will be process.execPath ... The second element will be the path to
the JavaScript file being executed. The remaining elements will be any additional command-line
arguments."  https://nodejs.org/docs/latest/api/process.html#process_process_argv */
const rawCommandLineArgs = process.argv.slice(2);

/* When creating new flags, avoid aliases reserved by WDIO itself (i.e. the `wdio` command):
  -f, --framework        defines the framework (Mocha, Jasmine or Cucumber) to run the specs
  -h, --hostname         automation driver host address
  -k, --key              corresponding access key to the user
  -l, --logLevel         level of logging verbosity
  -p, --port             automation driver port
  -r, --reporters        reporters to print out the results on stdout
  -u, --user             username if using a cloud service as automation backend
  -w, --waitforTimeout   timeout for all waitForXXX commands */

const { argv: parsedCommandLineArgs } = yargs(rawCommandLineArgs)
  .option('environment', {
    alias: 'e',
    describe:
      'The environment you want the tests pointed at. Default is `dev`, meaning WDIO will open your `localhost` app. The other option is `prod`. The URLs for your app in `dev` and `prod` can be found in `wdio.conf.ts`.',
    choices: Object.values(Environment),
    default: Environment.dev,
  })
  .option('headless', {
    describe: 'Use headless mode (Chrome only)',
    type: 'boolean',
    default: false,
  })
  .option('screenshot', {
    alias: 's',
    describe:
      'Whether to take screenshots of the viewport during testing. Default is for `failedTestsOnly`, which will save one screenshot at the point of failure of a given assertion (`it`) in the `test-results-screenshots` directory. Other options are `always` (screenshots for every `it`, at the point of failure or success), and `never`.',
    choices: Object.values(ScreenshotModes),
    default: ScreenshotModes.failedTestsOnly,
  })
  .option('chromedriver', {
    alias: 'c',
    describe:
      'Use Chromedriver to run the tests. Default is `false`, meaning it expects an automation server to be running on :4444.',
    type: 'boolean',
    default: false,
  })
  .help('info', 'Show custom WDIO flags. For standard WDIO help, use --help');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore. Not worth the time getting the yargs types to agree with TS.
const {
  environment,
  headless,
  screenshot,
  chromedriver,
}: {
  environment: Environment;
  headless: string;
  screenshot: string;
  chromedriver: string;
} = parsedCommandLineArgs;

const environmentMap = {
  dev: 'http://localhost:8080',
  localProdlike: 'http://localhost:1337',
  prod: 'TBD',
};

const baseUrl = environmentMap[environment];

// Commented out for now as latest WDIO has a TypeScript issue with `JasmineOpts`
/*
import { JasmineOpts } from '@wdio/jasmine-framework';
...
const jasmineOpts: JasmineOpts = {
  // default is 60000, this is just to show how to provide typed Jasmine options 
  defaultTimeoutInterval: 59999,
};
*/

const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./test-browser/specs/**/*.browser.test.ts'],
  maxInstances: 10,
  path: '/wd/hub',
  /*  automationProtocol: 'webdriver' was the default in WDIO v5, as of v6 it is 'devtools'
  (Chrome DevTools Protocol). "...to run a local test script you won't need to download a browser
  driver anymore. WebdriverIO checks if a browser driver is running and accessible at
  localhost:4444/ and uses Puppeteer as fallback if not." */
  automationProtocol: 'webdriver',
  capabilities: [
    {
      /* Run test files sequentially. If using in SauceLabs, you may want to increase the
      `maxInstances` to take advantage of councurrent tests. */
      maxInstances: 1,
      browserName: 'chrome',
      acceptInsecureCerts: true,
      /* WDIO expects only one set of browser options per capability. Therefore if this is
      expanded to become dynamic and include other browsers, you must ensure that only one set of
      browser options is supplied, or else all of them could be ignored. */
      ...(headless && {
        'goog:chromeOptions': {
          args: ['headless'],
        },
      }),
    },
  ],
  logLevel: 'warn',
  bail: 0,
  baseUrl,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  ...(chromedriver && { services: ['chromedriver'] }),
  framework: 'jasmine',
  reporters: ['spec'],
  autoCompileOpts: {
    tsNodeOpts: {
      project: 'tsconfig.wdio.json',
    },
  },
  onPrepare() {
    const createEmptyScreenshotDirectory = () => {
      const directoryPath = './test-result-screenshots';
      if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true });
      }
      fs.mkdirSync(directoryPath);
    };

    if (screenshot !== ScreenshotModes.never.toString()) {
      createEmptyScreenshotDirectory();
    }
  },
  beforeSession(conf, capabilities, specs) {
    // This is used by test-browser/pages/page.ts for logging
    global.wdioBaseUrl = baseUrl;
    const specFilepathSegments = specs[0].split('/');
    global.specFilename = specFilepathSegments[specFilepathSegments.length - 1];
  },
  async afterTest(test, context, { passed }) {
    const generateScreenshotName = (testPassed?: boolean) => {
      const [filenameNoExtension] =
        global.specFilename.split('.browser.test.ts');

      const testPassedMap = {
        true: 'PASSED',
        false: 'FAILED',
      };

      const testPassedStr =
        testPassed !== undefined
          ? `_${String(testPassedMap[String(testPassed)])}`
          : '';

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore. `test.id` DOES exist, takes the form of "spec_" where _ is a 0-indexed number
      const testId = <string>test.id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore. `test.description` DOES exist, it is first argument to the "it" block
      return `${filenameNoExtension}_${testId}${testPassedStr}_${test.description
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .join('-')}`;
    };

    if (screenshot === ScreenshotModes.failedTestsOnly.toString() && !passed) {
      await browser.saveScreenshot(
        `test-result-screenshots/${generateScreenshotName()}.png`,
      );
    }
    if (screenshot === ScreenshotModes.always.toString()) {
      await browser.saveScreenshot(
        `test-result-screenshots/${generateScreenshotName(passed)}.png`,
      );
    }
  },
};

export { config };
