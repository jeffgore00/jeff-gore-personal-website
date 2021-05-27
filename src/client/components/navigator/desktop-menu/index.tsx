import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';

export const DesktopNavMenuContainer = styled.div.attrs({
  'data-testid': 'desktop-nav-menu',
})`
  display: flex;
`;

const NonFirstHyperlink = styled.div`
  margin-left: 24px;
`;

export function DesktopNavMenu(): React.ReactElement {
  return (
    <DesktopNavMenuContainer>
      <Link to="/about">About</Link>
      <NonFirstHyperlink>
        <Link to="/blog">Blog</Link>
      </NonFirstHyperlink>
      <NonFirstHyperlink>
        <Link to="/projects">Projects</Link>
      </NonFirstHyperlink>
      <NonFirstHyperlink>
        <Link to="/things-i-like">Things I Like</Link>
      </NonFirstHyperlink>
    </DesktopNavMenuContainer>
  );
}
