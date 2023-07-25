import React, { PropsWithChildren } from 'react';

export function createReactWrapperForPlainElement(elementType: string) {
  return function createHTMLElementViaReact(
    props: PropsWithChildren<{ [key: string]: unknown }>,
  ) {
    return React.createElement(elementType, props);
  };
}
