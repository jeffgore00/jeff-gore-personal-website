import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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

export const TopLevelUserInterface = (
  <Router>
    <PageStylingContainer>
      <ErrorBoundary boundaryLocation="top-level">
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/about">
          <h2>About Me</h2>
        </Route>
        <Route exact path="/blog">
          <h2>Blog</h2>
        </Route>
        <Route exact path="/projects">
          <h2>Projects</h2>
        </Route>
        <Route exact path="/things-i-like">
          <h2>Things I Like</h2>
        </Route>
      </ErrorBoundary>
    </PageStylingContainer>
  </Router>
);

ReactDOM.render(TopLevelUserInterface, document.getElementById('root'));
