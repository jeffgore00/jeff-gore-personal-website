/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { render } from '@testing-library/react';

import { ShimmeringLinesInPlaceOfContentNotYetReady } from '.';
import { generateSpiedReactComponent } from '../../../../test-utils/generate-spied-react-component';

describe('loading lines', () => {
  beforeAll(() => {
    generateSpiedReactComponent({
      object: Skeleton,
      method: 'render',
      implementation: ({ animation }: { animation: string }) => (
        <div className={`single-line-with-${animation}-animation`} />
      ),
    });
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

    const { container: twentyLoadingLines } = render(
      <ShimmeringLinesInPlaceOfContentNotYetReady numberOfLines={20} />,
    );
    expect(twentyLoadingLines.innerHTML).toEqual(
      generateExpectedMarkup({ numberOfLines: 20 }),
    );
  });
});
