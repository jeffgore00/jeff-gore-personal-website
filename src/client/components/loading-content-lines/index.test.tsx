/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { render } from '@testing-library/react';

import { ShimmeringLinesInPlaceOfContentNotYetReady } from '.';

describe('loading lines', () => {
  beforeAll(() => {
    jest
      // @ts-ignore. This exists.
      .spyOn(Skeleton, 'render')
      // @ts-ignore. This is valid.
      .mockImplementation(({ animation }: { animation: string }) => (
        <div className={`single-line-with-${animation}-animation`} />
      ));
  });

  function generateExpectedMarkup({
    numberOfLines,
  }: {
    numberOfLines: number;
  }) {
    return `<div data-testid="loading-content-lines">${'<div class="single-line-with-wave-animation"></div>'.repeat(
      numberOfLines,
    )}</div>`;
  }

  it('renders the number of shimmering lines equal to `numberOfLines`', () => {
    const { container: threeLoadingLines } = render(
      <ShimmeringLinesInPlaceOfContentNotYetReady numberOfLines={3} />,
    );
    expect(threeLoadingLines.innerHTML).toEqual(
      generateExpectedMarkup({ numberOfLines: 3 }),
    );

    const { container: fourLoadingLines } = render(
      <ShimmeringLinesInPlaceOfContentNotYetReady numberOfLines={20} />,
    );
    expect(fourLoadingLines.innerHTML).toEqual(
      generateExpectedMarkup({ numberOfLines: 20 }),
    );
  });
});