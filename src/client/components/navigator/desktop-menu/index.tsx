import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { navMenuEnabledLinks } from '../../../../shared/constants';

export const DesktopNavMenuContainer = styled.div.attrs({
  'data-testid': 'desktop-nav-menu',
})`
  display: flex;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:visited {
    color: black;
  }
  &:hover {
    text-decoration: underline;
    color: purple;
  }
`;

const NonFirstHyperlink = styled.div`
  margin-left: 24px;
`;

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
