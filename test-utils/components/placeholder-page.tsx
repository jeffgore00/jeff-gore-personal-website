import React from 'react';

import { StyledPageHeader } from '../../src/client/styled-components';

export function PlaceholderPage({
  pageName,
}: {
  pageName: string;
}): React.ReactElement {
  return <StyledPageHeader>{pageName}</StyledPageHeader>;
}
