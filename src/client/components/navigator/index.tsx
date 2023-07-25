import React from 'react';
import Media from 'react-media';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { DesktopNavMenu } from './desktop-menu';
import { MobileNavMenu } from './mobile-menu';
import { createReactWrapperForPlainElement } from '../../utils/styled-components';

const DESKTOP_MEDIA_QUERY = '(min-width: 700px)';

const StyledHeader = styled(createReactWrapperForPlainElement('h1')).attrs({
  'data-testid': 'name-header',
})`
  font-family: JetBrainsMonoItalic, monospace;
  font-style: italic;
  font-size: 2em;
  margin: 0;
  color: inherit;
  text-decoration: none !important;

  & a:-webkit-any-link {
    color: inherit;
    text-decoration: none !important;
  }

  &:hover {
    color: purple;
  }
`;

function NameHeader(): React.ReactElement {
  return (
    <StyledHeader>
      <Link to="/">Jeff Gore</Link>
    </StyledHeader>
  );
}

const NavigatorContainer = styled(
  createReactWrapperForPlainElement('nav'),
).attrs({
  'data-testid': 'navigator',
})`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.75em;
  & * {
    align-self: flex-end;
  }
  font-family: JetBrainsMono;
`;

export function Navigator(): React.ReactElement {
  return (
    <NavigatorContainer>
      <NameHeader />
      <Media query={DESKTOP_MEDIA_QUERY}>
        {(isDesktop): React.ReactElement =>
          isDesktop ? <DesktopNavMenu /> : <MobileNavMenu />
        }
      </Media>
    </NavigatorContainer>
  );
}
