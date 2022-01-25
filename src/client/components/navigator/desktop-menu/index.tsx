import React from 'react';

import { navMenuEnabledLinks } from '../../../../shared/constants';
import {
  DesktopNavMenuContainer,
  StyledLink,
  NonFirstHyperlink,
} from './styled-components';

export function DesktopNavMenu(): React.ReactElement {
  return (
    <DesktopNavMenuContainer>
      {Array.from(navMenuEnabledLinks).map(([title, path], index) => {
        const link = (
          <StyledLink to={path} key={title}>
            {title}
          </StyledLink>
        );
        if (index === 0) {
          return link;
        }
        return <NonFirstHyperlink key={title}>{link}</NonFirstHyperlink>;
      })}
    </DesktopNavMenuContainer>
  );
}
