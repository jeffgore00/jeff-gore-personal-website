import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

type Props = { numberOfLines: number };

export function ShimmeringLinesInPlaceOfContentNotYetReady(
  props: Props,
): React.ReactElement {
  const { numberOfLines } = props;
  return (
    <div data-testid="loading-content-lines">
      {new Array(numberOfLines).fill(null).map((_, index) => (
        <Skeleton key={String.fromCharCode(index)} animation="wave" />
      ))}
    </div>
  );
}
