import React from 'react';

import { StyledPageHeader } from '../../src/client/components/top-level-user-interface/styled-components';

export function PlaceholderPage({
  pageName,
}: {
  pageName: string;
}): React.ReactElement {
  return <StyledPageHeader>{pageName}</StyledPageHeader>;
}
