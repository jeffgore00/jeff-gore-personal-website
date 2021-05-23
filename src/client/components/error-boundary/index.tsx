// Based on example from https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html

/* eslint-disable react/destructuring-assignment */
import React, { ErrorInfo } from 'react';

import logger from '../../utils/logger';

type Props = {
  children: React.ReactNode;
  boundaryLocation: string;
};

export class ErrorBoundary extends React.Component<
  Props,
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
        boundaryLocation: this.props.boundaryLocation,
      },
    );
  }

  render(): React.ReactElement | React.ReactNode {
    if (this.state.hasError) {
      return (
        <div data-testid="react-error-fallback-ui">
          <h1>Oops.</h1>
          <p>
            If you&apos;re seeing this message, something has gone very wrong
            with my website. Please shoot me an email at{' '}
            <a href="mailto:jgore00@gmail.com">jgore00@gmail.com</a> or DM me on
            Twitter (<a href="https://twitter.com/jeffgore">@jeffgore</a>) to
            let me know!
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
