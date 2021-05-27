import React from 'react';
import ReactDOM from 'react-dom';

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
    const { TopLevelUserInterface } = await import('.');
    expect(reactDOMRenderSpy).toHaveBeenCalledWith(TopLevelUserInterface, root);
  });
});
