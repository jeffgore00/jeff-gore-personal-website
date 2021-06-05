import styled from 'styled-components';

export const PageStylingContainer = styled.div.attrs({
  id: 'page-styling-container',
})`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 40px;
  font-family: Helvetica, sans serif;
`;

/* Possible refactor: use styled-components injectGlobal to make font-face 
available to all components.
https://stackoverflow.com/questions/42675725/isolated-styled-components-with-font-face */
export const StyledPageHeader = styled.h2`
  font-family: JetBrainsMono, monospace;
  font-style: normal;
  font-size: 1.5em;
  @font-face {
    font-family: JetBrainsMono;
    src: local('JetBrains Mono Regular'), url('JetBrainsMono-Regular.woff2');
    font-weight: normal;
    font-style: normal;
  }
`;
