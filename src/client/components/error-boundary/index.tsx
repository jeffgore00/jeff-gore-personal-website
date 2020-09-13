// Based on example from https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html

/* eslint-disable react/destructuring-assignment */
import React, { ErrorInfo } from 'react';

import logger from '../../utils/logger';

type Props = {
  children: React.ReactNode;
};

export class ErrorBoundary extends React.Component<
  Record<string, unknown>,
  { hasError: boolean }
> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ hasError: true });
    void logger.error(
      `Error Caught by React Error Boundary: ${error.message}`,
      {
        errorComponentStack: info.componentStack,
      },
    );
  }

  render(): React.ReactElement | React.ReactNode {
    if (this.state.hasError) {
      return (
        <div data-testid="react-error-fallback-ui">
          <h1>Something went wrong.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}
