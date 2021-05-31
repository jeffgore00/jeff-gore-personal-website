import React from 'react';
import { render } from '@testing-library/react';

import { setupReactMediaMock } from '../../../../test-utils/react-media';
import { Homepage, HOMEPAGE_RENDERED_LOG } from '.';
import logger from '../../utils/logger';

jest.mock('react-media', () => jest.fn());
setupReactMediaMock();

describe('Homepage', () => {
  let loggerSpy: jest.SpyInstance;

  beforeAll(() => {
    loggerSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());
    render(<Homepage />);
  });

  it('sends a log to the server after the homepage renders', () => {
    expect(loggerSpy).toHaveBeenCalledWith(HOMEPAGE_RENDERED_LOG);
  });
});
