/**
 * @jest-environment jsdom
 */

// External dependencies
import React from 'react';
import { render, act, RenderResult } from '@testing-library/react';

// The module being tested, plus its constants
import { PageNotFound } from '.';

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property: useLocation"
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/hello' }),
}));

describe('Page Not Found Page', () => {
  let component: RenderResult;

  beforeAll(async () => {
    await act(async () => {
      component = render(<PageNotFound />);
      return Promise.resolve();
    });
  });

  it('displays content loading lines', () => {
    expect(component.queryByTestId(`page-not-found`).innerHTML).toEqual(
      'Page "/hello" not found.',
    );
  });
});
