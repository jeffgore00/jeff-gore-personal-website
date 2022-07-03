/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */

type ReactComponent = (props: { [key: string]: unknown }) => JSX.Element;

export function generateSpiedReactComponent({
  object,
  method,
  implementation,
  spyOnRenderMethod = false,
}: {
  object: { [method: string]: any };
  method: string;
  implementation: ReactComponent;
  spyOnRenderMethod?: boolean;
}): ReactComponent {
  let MockedComponent: jest.SpyInstance<ReactComponent>;

  /* For styled components and others, the exports are objects and not functions (perhaps class 
  components?). Hence we have to spy on the `render` method specifically. */
  if (spyOnRenderMethod) {
    MockedComponent = jest
      .spyOn(object[method], 'render')
      .mockImplementation(implementation);
  } else {
    MockedComponent = jest
      .spyOn(object, method)
      .mockImplementation(implementation);
  }

  /* TypeScript complains that a Spy is not invocable as a React component (i.e. <SpiedComponent>), 
  but it is. Therefore the return type is set to ReactComponent rather than the true 
  jest.SpyInstance<ReactComponent> to satisfy the TS compiler in all files where this util is used. */
  // @ts-ignore
  return MockedComponent;
}
