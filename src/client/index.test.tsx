/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import * as TopLevelUserInterfaceModule from './components/top-level-user-interface';
import { generateSpiedReactComponent } from '../../test-utils/generate-spied-react-component';

const reactDOMRootSpy = { render: jest.fn(), unmount: () => {} };

const reactDOMCreateRootSpy = jest
  .spyOn(ReactDOM, 'createRoot')
  .mockImplementation(() => reactDOMRootSpy);

const TopLevelUserInterfaceSpy = generateSpiedReactComponent({
  object: TopLevelUserInterfaceModule,
  method: 'TopLevelUserInterface',
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
    expect(reactDOMCreateRootSpy).toHaveBeenCalledWith(root);

    expect(reactDOMRootSpy.render).toHaveBeenCalledWith(
      <TopLevelUserInterfaceSpy />,
    );
  });
});
