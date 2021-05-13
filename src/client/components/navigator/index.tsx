import React from 'react';
import Media from 'react-media';
import styled from 'styled-components';
import { DesktopNavMenu } from './desktop-menu';

const DESKTOP_MEDIA_QUERY = '(min-width: 700px)';

const StyledHeader = styled.h1`
  margin: 0;
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
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 40px;
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
