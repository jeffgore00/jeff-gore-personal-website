import React from 'react';
import ReactDOM from 'react-dom';

import * as TopLevelUserInterfaceModule from './components/top-level-user-interface';
import { generateSpiedReactComponent } from '../../test-utils/generate-spied-react-component';

const reactDOMRenderSpy = jest
  .spyOn(ReactDOM, 'render')
  .mockImplementation(jest.fn());

const TopLevelUserInterfaceSpy = generateSpiedReactComponent({
  module: TopLevelUserInterfaceModule,
  exportName: 'TopLevelUserInterface',
  implementation: () => <div />,
});

describe('root', () => {
  let root: HTMLElement;

  beforeAll(() => {
    root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });

  it('injects the <TopLevelUserInterface> component into <div id="root">', async () => {
    await import('.');
    expect(reactDOMRenderSpy).toHaveBeenCalledWith(
      <TopLevelUserInterfaceSpy />,
      root,
    );
  });
});
