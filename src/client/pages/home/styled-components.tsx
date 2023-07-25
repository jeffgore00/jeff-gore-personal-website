import styled from 'styled-components';
import { createReactWrapperForPlainElement } from '../../utils/styled-components';

export const AboutMeHeader = styled(
  createReactWrapperForPlainElement('h2'),
).attrs({
  'data-testid': 'homepage-about-me-blurb',
})`
  font-family: sans-serif;
  font-size: 1.25em;
`;
