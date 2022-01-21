import { getServerStatus, logs } from '.';
import packageJson from '../../../../../package.json';

const consoleWarnSpy = jest
  .spyOn(console, 'warn')
  .mockImplementation(() => null);

jest.mock('../../runtime/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Get Server Status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When process.env.SOURCE_VERSION is defined', () => {
    const sampleCommitHash = 'daa20e9175eb078889604272046bd0ff077dbfc3';

    beforeAll(() => {
      process.env.SOURCE_VERSION = sampleCommitHash;
    });

    afterAll(() => {
      delete process.env.SOURCE_VERSION;
    });

    it('returns the repo version and the value of that env variable (which should be a commit hash)', () => {
      expect(getServerStatus()).toEqual({
        version: packageJson.version,
        commit: sampleCommitHash,
      });
    });
  });

  describe('When process.env.SOURCE_VERSION is not defined', () => {
    beforeAll(() => {
      delete process.env.SOURCE_VERSION;
    });
    it('returns object with the repo version and unknown commit', () => {
      expect(getServerStatus()).toEqual({
        version: packageJson.version,
        commit: 'unknown',
      });
    });

    it('logs the inability to get the commit', () => {
      getServerStatus();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `<yellow text>${logs.FAILED_TO_GET_COMMIT_HASH}</yellow text>`,
      );
    });
  });
});
