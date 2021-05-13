import React from 'react';
import styled from 'styled-components';

export const DesktopNavMenuContainer = styled.div.attrs({
  'data-testid': 'desktop-nav-menu',
})`
  display: flex;
`;

const NonFirstHyperlink = styled.a.attrs((props) => ({
  href: props.href,
}))`
  margin-left: 24px;
`;

export function DesktopNavMenu(): React.ReactElement {
  return (
    <DesktopNavMenuContainer>
      <a href="/about">About</a>
      <NonFirstHyperlink href="/projects">Projects</NonFirstHyperlink>
      <NonFirstHyperlink href="/things-i-like">Things I Like</NonFirstHyperlink>
    </DesktopNavMenuContainer>
  );
}
