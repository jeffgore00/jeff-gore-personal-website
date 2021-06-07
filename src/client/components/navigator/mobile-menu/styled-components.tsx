import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
  text-decoration: none;
  font-style: italic;
  color: black;
  &:visited {
    color: black;
  }
`;

export const StyledButton = styled.button`
  background-color: inherit;
  border: none;
  font-size: 2em;
  cursor: pointer;

  &:hover,
  &:focus {
    color: purple;
  }
`;

export const LinkPanel = styled.div.attrs({
  'data-testid': 'link-panel',
})`
  height: 3em;
  font-size: 1.5em;
  font-family: JetBrainsMono;
  border-width: 2px;
  padding-left: 1em;
  padding-right: 3em;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  &:hover,
  &:focus {
    background-color: lightgray;
  }
`;
