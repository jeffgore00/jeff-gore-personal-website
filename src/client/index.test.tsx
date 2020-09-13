import React from 'react';
import ReactDOM from 'react-dom';

import { ErrorBoundary } from './components/error-boundary';
import { Homepage } from './components/homepage';

const reactDOMRenderSpy = jest
  .spyOn(ReactDOM, 'render')
  .mockImplementation(jest.fn());
jest.mock('./components/homepage', () => ({
  Homepage: (): React.ReactElement => <div id="homepage" />,
}));

describe('root', () => {
  let root: HTMLElement;

  beforeAll(() => {
    root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });

  it('injects the <Homepage> element into <div id="root">', async () => {
    await import('.');
    expect(reactDOMRenderSpy).toHaveBeenCalledWith(
      <ErrorBoundary>
        <Homepage />
      </ErrorBoundary>,
      root,
    );
  });
});
