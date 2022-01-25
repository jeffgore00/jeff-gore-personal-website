import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

export const NonFirstHyperlink = styled.div`
  margin-left: 24px;
`;
