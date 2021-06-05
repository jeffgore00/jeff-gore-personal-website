import React from 'react';
import { render } from '@testing-library/react';

import { Homepage, HOMEPAGE_RENDERED_LOG } from '.';
import logger from '../../utils/logger';

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
