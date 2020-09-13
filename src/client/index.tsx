import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ErrorBoundary } from './components/error-boundary';
import { Homepage } from './components/homepage';

ReactDOM.render(
  <ErrorBoundary>
    <Homepage />
  </ErrorBoundary>,
  document.getElementById('root'),
);
