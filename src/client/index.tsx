import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';

import { ErrorBoundary } from './components/error-boundary';
import { Homepage } from './components/homepage';

export const PageStylingContainer = styled.div.attrs({
  id: 'page-styling-container',
})`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 40px;
  font-family: Helvetica, sans serif;
`;

ReactDOM.render(
  <PageStylingContainer>
    <ErrorBoundary boundaryLocation="top-level">
      <Homepage />
    </ErrorBoundary>
  </PageStylingContainer>,
  document.getElementById('root'),
);
