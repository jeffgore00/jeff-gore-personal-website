import React, { useEffect } from 'react';

export const ThisComponentWillThrowAnError = (): React.ReactElement => {
  useEffect(() => {
    throw new Error(
      'This error is being thrown on purpose to test error handling.',
    );
  }, []);

  return <div data-testid="faulty-component" />;
};
