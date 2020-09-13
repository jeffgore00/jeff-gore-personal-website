import * as developmentConfig from './development.json';
import * as testConfig from './test.json';
import * as productionConfig from './production.json';
import { getConfig } from '.';

describe('getConfig', () => {
  describe('When process.env.NODE_ENV is defined', () => {
    describe('when the value maps to one of the valid configs', () => {
      describe('When process.env.NODE_ENV equals "development"', () => {
        beforeAll(() => {
          process.env.NODE_ENV = 'development';
        });
        it('returns the corresponding config', () => {
          expect(getConfig()).toEqual(developmentConfig);
        });
      });
      describe('When process.env.NODE_ENV equals "test"', () => {
        beforeAll(() => {
          process.env.NODE_ENV = 'test';
        });
        it('returns the corresponding config', () => {
          expect(getConfig()).toEqual(testConfig);
        });
      });
      describe('When process.env.NODE_ENV equals "production"', () => {
        beforeAll(() => {
          process.env.NODE_ENV = 'production';
        });
        it('returns the corresponding config', () => {
          expect(getConfig()).toEqual(productionConfig);
        });
      });
    });
    describe('when the value does not map to one of the valid configs', () => {
      beforeAll(() => {
        process.env.NODE_ENV = 'unknown';
      });
      it('returns the production config', () => {
        expect(getConfig()).toEqual(productionConfig);
      });
    });
  });
  describe('When process.env.NODE_ENV is not defined', () => {
    beforeAll(() => {
      delete process.env.NODE_ENV;
    });
    it('returns the production config', () => {
      expect(getConfig()).toEqual(productionConfig);
    });
  });
});
