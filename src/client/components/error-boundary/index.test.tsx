/* eslint-disable @typescript-eslint/ban-ts-comment, no-underscore-dangle, no-console */
import React, { useEffect } from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import { ErrorBoundary } from '.';
import logger from '../../utils/logger';

const FaultyComponent = (): React.ReactElement => {
  useEffect(() => {
    throw new Error('unique error');
  }, []);
  return <div data-testid="faulty-component" />;
};

describe('Error boundary', () => {
  let fallbackUi: HTMLElement;

  describe('When one of its children components throw an error', () => {
    let loggerSpy: jest.SpyInstance;
    let faultyComponent: HTMLElement;

    beforeAll(() => {
      // @ts-ignore
      loggerSpy = jest.spyOn(logger, 'error').mockImplementation(jest.fn());

      // Despite above, this is necessary to prevent JSDOM from logging the error:
      jest.spyOn(console, 'error').mockImplementation(() => null);

      render(
        <ErrorBoundary boundaryLocation="top-level">
          <FaultyComponent />
        </ErrorBoundary>,
      );
      fallbackUi = screen.queryByTestId('react-error-fallback-ui');
    });

    afterAll(cleanup);

    it('logs the error', () => {
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error Caught by React Error Boundary: unique error',
        {
          boundaryLocation: 'top-level',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          errorComponentStack: expect.any(String),
          // stack trace will include file location, so it would be tough to do an exact match
        },
      );
    });
    it('renders the fallback ui', () => {
      expect(fallbackUi).toBeTruthy();
      expect(faultyComponent).not.toBeTruthy();
    });
  });

  describe('When there is no error', () => {
    let healthyComponent: HTMLElement;

    beforeAll(() => {
      render(
        <ErrorBoundary boundaryLocation="top-level">
          <div data-testid="healthy-component" />
        </ErrorBoundary>,
      );
      healthyComponent = screen.queryByTestId('healthy-component');
      fallbackUi = screen.queryByTestId('react-error-fallback-ui');
    });

    afterAll(cleanup);

    it('renders the children', () => {
      expect(fallbackUi).not.toBeTruthy();
      expect(healthyComponent).toBeTruthy();
    });
  });
});
