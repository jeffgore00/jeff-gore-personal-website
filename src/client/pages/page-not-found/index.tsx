import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

import { createReactWrapperForPlainElement } from '../../utils/styled-components';

const NotFoundParagraph = styled(createReactWrapperForPlainElement('p')).attrs({
  'data-testid': 'page-not-found',
})`
  margin-top: 1em;
`;

export function PageNotFound() {
  const location = useLocation();
  const notFoundMessage = `Page "${location.pathname}" not found.`;

  return <NotFoundParagraph>{notFoundMessage}</NotFoundParagraph>;
}
