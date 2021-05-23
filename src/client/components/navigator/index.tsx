import React from 'react';
import Media from 'react-media';
import styled from 'styled-components';
import { DesktopNavMenu } from './desktop-menu';

const DESKTOP_MEDIA_QUERY = '(min-width: 700px)';

const StyledHeader = styled.h1`
  @font-face {
    font-family: JetBrainsMono;
    src: local('JetBrains Mono Italic'), url('JetBrainsMono-Italic.woff2');
    font-weight: normal;
    font-style: italic;
  }
  font-family: JetBrainsMono;
  font-style: italic;
  font-size: 2em;
  margin: 0;
  color: inherit;
  text-decoration: none !important;

  & a:-webkit-any-link {
    color: inherit;
    text-decoration: none !important;
  }
`;

const NameHeader = (): React.ReactElement => (
  <StyledHeader>
    <a href="/">Jeff Gore</a>
  </StyledHeader>
);

const NavigatorContainer = styled.nav.attrs({
  'data-testid': 'navigator',
})`
  display: flex;
  justify-content: space-between;
`;

export const Navigator = (): React.ReactElement => (
  <NavigatorContainer>
    <Media query={DESKTOP_MEDIA_QUERY}>
      {(isDesktop): React.ReactElement => (
        <>
          <NameHeader />
          {isDesktop ? (
            <DesktopNavMenu />
          ) : (
            <div data-testid="mobile-nav-menu">|||</div>
          )}
        </>
      )}
    </Media>
  </NavigatorContainer>
);
