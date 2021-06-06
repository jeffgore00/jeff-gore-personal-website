export function generateSpiedReactComponent({
  module,
  exportName,
  implementation,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any; // tried { [key: string]: unknown }, but that bizarrely causes a TS error with the next parameter
  exportName: string;
  implementation: ({
    children,
  }?: {
    children: React.ReactChild;
  }) => JSX.Element;
}): () => JSX.Element {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore. TypeScript complains that a Spy is not invocable as a React component (i.e. <SpiedComponent>), but it is.
  const MockedComponent: () => JSX.Element = jest
    .spyOn(module, exportName)
    .mockImplementation(implementation);
  return MockedComponent;
}
