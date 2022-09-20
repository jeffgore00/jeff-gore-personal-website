/**
 * @jest-environment jsdom
 */

/* eslint-disable no-underscore-dangle, no-console */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import { DataDependentPageWrapper } from '.';
import logger from '../../utils/logger';

// prettier-ignore
describe('DataDependentPageWrapper', () => {
  it('works', () => {})
  
  // it should attempt to GET the content URL
    // WHEN waiting for the API response
      // renders content lines
    // WHEN the API responds
      // WHEN the status is 404
        // shows not found
        // logs the warn
      // WHEN the status is 500
        // shows system down
        // logs the error
      // WHEN the status is not the above (success)
        // renders the children
    // WHEN the API calls times out or errors out without a successful HTTP response
      // shows system down
      // logs the error
});
