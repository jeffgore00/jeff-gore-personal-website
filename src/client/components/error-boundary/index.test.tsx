/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/ban-ts-comment, no-underscore-dangle, no-console */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import { ErrorBoundary } from '.';
import logger from '../../utils/logger';
import { ThisComponentWillThrowAnError } from '../../../../test-utils/components/error-component';

describe('Error boundary', () => {
  let fallbackUi: HTMLElement;

  describe('When one of its children components throw an error', () => {
    let loggerSpy: jest.SpyInstance;
    let faultyComponent: HTMLElement;

    beforeAll(() => {
      loggerSpy = jest.spyOn(logger, 'error').mockImplementation(jest.fn());

      // Despite above, this is necessary to prevent JSDOM from logging the error:
      jest.spyOn(console, 'error').mockImplementation(() => null);

      render(
        <ErrorBoundary boundaryLocation="top-level">
          <ThisComponentWillThrowAnError />
        </ErrorBoundary>,
      );
      faultyComponent = screen.queryByTestId('faulty-component');
      fallbackUi = screen.queryByTestId('react-error-fallback-ui');
    });

    afterAll(cleanup);

    it('logs the error', () => {
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error Caught by React Error Boundary: This error is being thrown on purpose to test error handling.',
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

    describe('When the boundaryLocation is "top-level"', () => {
      it('Renders the "Oops." header as an <h1> (since the main "Jeff Gore" header is not displayed)', () => {
        expect(fallbackUi.getElementsByTagName('h1')[0]).toBeTruthy();
        expect(fallbackUi.getElementsByTagName('h2')[0]).toBeFalsy();
      });
    });

    describe('When the boundaryLocation is not "top-level"', () => {
      beforeAll(() => {
        cleanup();
        render(
          <ErrorBoundary boundaryLocation="within-header-and-footer">
            <ThisComponentWillThrowAnError />
          </ErrorBoundary>,
        );
        fallbackUi = screen.queryByTestId('react-error-fallback-ui');
      });
      it('Renders the "Oops." header as an <h2> (since the main "Jeff Gore" header is already displayed)', () => {
        expect(fallbackUi.getElementsByTagName('h1')[0]).toBeFalsy();
        expect(fallbackUi.getElementsByTagName('h2')[0]).toBeTruthy();
      });
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
