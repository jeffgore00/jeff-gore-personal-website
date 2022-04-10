import React from 'react';
import Skeleton from '@mui/material/Skeleton';

type Props = { numberOfLines: number };

/*
HTML of each <Skeleton> line:
<span class="MuiSkeleton-root MuiSkeleton-text MuiSkeleton-wave"></span>
*/

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
