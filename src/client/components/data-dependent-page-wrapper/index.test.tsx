/**
 * @jest-environment jsdom
 */

/* eslint-disable no-underscore-dangle, no-console */
import React from 'react';
import { cleanup, act, render, RenderResult } from '@testing-library/react';

import logger from '../../utils/logger';
import { DataDependentPageWrapper, NUMBER_OF_LOADING_LINES } from '.';
import * as useSetPageTitleModule from '../../hooks/use-set-page-title';
import { generateSpiedReactComponent } from '../../../../test-utils/generate-spied-react-component';
import * as LoadingLinesModule from '../loading-content-lines';
import * as PageNotFoundModule from '../../pages/page-not-found';

// TEST DATA OBJECTS
const sampleResponse: unknown = {
  ok: true,
  status: 200,
  json: () => Promise.resolve({ sampleDataKey: 'sampleDataValue' }),
};

const delayedContentApiResponse = new Promise((resolve) => {
  setTimeout(() => {
    resolve(sampleResponse);
  }, 1000);
});

// SPIES / MOCKS
const errorLoggerSpy = jest
  .spyOn(logger, 'error')
  .mockImplementation(() => null);

const fetchSpy = jest
  .spyOn(window, 'fetch')
  .mockImplementation(() => delayedContentApiResponse as Promise<Response>);

generateSpiedReactComponent({
  object: LoadingLinesModule,
  method: 'ShimmeringLinesInPlaceOfContentNotYetReady',
  implementation: () => (
    <div data-testid={`${NUMBER_OF_LOADING_LINES}-loading-lines`} />
  ),
});

generateSpiedReactComponent({
  object: PageNotFoundModule,
  method: 'PageNotFound',
  implementation: () => <div data-testid="page-not-found" />,
});

jest
  .spyOn(useSetPageTitleModule, 'useSetPageTitle')
  .mockImplementation(jest.fn());

// TEST HELPER METHODS

// Note: Tried to extract the repeated `act` calls into this function as well, but for some reason
// reassigning the component function parameter didn't work here.
const renderComponent = () =>
  render(
    <DataDependentPageWrapper contentUrl="http://localhost:8000">
      {(data: unknown) => (
        <div data-testid="child-element">{JSON.stringify(data)}</div>
      )}
    </DataDependentPageWrapper>,
  );

describe('DataDependentPageWrapper', () => {
  let component: RenderResult;

  beforeAll(async () => {
    await act(() => {
      component = renderComponent();
      return Promise.resolve();
    });
  });

  it('should attempt to GET the content URL', () => {
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:8000');
  });

  describe('When waiting for the API response', () => {
    /* Test setup is already done for this test by using a delayed API response by default. By
    the time the component finishes rendering, the API has not yet returned the data. */
    it('displays content loading lines', () => {
      expect(
        component.queryByTestId(`${NUMBER_OF_LOADING_LINES}-loading-lines`),
      ).toBeTruthy();
    });
  });

  describe('When the API responds', () => {
    describe('When the response status is 404', () => {
      beforeAll(async () => {
        cleanup();
        jest.clearAllMocks();
        fetchSpy.mockImplementation(() =>
          Promise.resolve({ ok: false, status: 404 } as Response),
        );
        await act(() => {
          component = renderComponent();
          return Promise.resolve();
        });
      });

      it('should show the not found page', () => {
        expect(component.queryByTestId('page-not-found')).toBeTruthy();
      });
    });

    describe('When the response status is not OK', () => {
      beforeAll(async () => {
        cleanup();
        jest.clearAllMocks();
        fetchSpy.mockImplementation(() =>
          Promise.resolve({ ok: false, status: 500 } as Response),
        );
        await act(() => {
          component = renderComponent();
          return Promise.resolve();
        });
      });

      it('should show the system down page', () => {
        expect(component.queryByTestId('system-down')).toBeTruthy();
      });

      it('should log the error', () => {
        expect(errorLoggerSpy).toHaveBeenCalledWith(
          'ERROR FETCHING CONTENT',
          undefined,
        );
      });
    });

    describe('When the response status is OK', () => {
      beforeAll(async () => {
        cleanup();
        jest.clearAllMocks();
        fetchSpy.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ sampleDataKey: 'sampleDataValue' }),
          } as Response),
        );
        await act(() => {
          component = renderComponent();
          return Promise.resolve();
        });
      });

      it('should render the children', () => {
        expect(component.queryByTestId('child-element')).toBeTruthy();
      });

      it('passes the resulting data to the children', () => {
        expect(component.queryByTestId('child-element').innerHTML).toEqual(
          '{"sampleDataKey":"sampleDataValue"}',
        );
      });
    });
  });

  describe('WHEN the API call times out or errors out without an HTTP response', () => {
    const sampleError = new Error('timeout');

    beforeAll(async () => {
      cleanup();
      jest.clearAllMocks();
      fetchSpy.mockImplementation(() => Promise.reject(sampleError));
      await act(() => {
        component = renderComponent();
        return Promise.resolve();
      });
    });

    it('should show the system down page', () => {
      expect(component.queryByTestId('system-down')).toBeTruthy();
    });

    it('should log the error', () => {
      expect(errorLoggerSpy).toHaveBeenCalledWith('ERROR FETCHING CONTENT', {
        error: sampleError,
      });
    });
  });
});
