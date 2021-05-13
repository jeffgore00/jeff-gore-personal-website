import React from 'react';
import styled from 'styled-components';

/* TODO: Remove role="contentinfo" when react-testing-library is fixed. The <footer>
should innately have this role, but RTL doesn't detect it. */
const FooterContainer = styled.footer.attrs({
  'data-testid': 'footer',
  role: 'contentinfo',
})`
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 40px;
  justify-content: flex-end;
`;

const FooterIcon = ({ name }: { name: string }) => (
  <img
    src={`/icon_${name.toLowerCase()}.png`}
    alt={`Link to my ${name} page`}
    height="25"
    width="25"
    style={{ marginLeft: '5px' }}
  />
);

export const footerLinks = {
  GITHUB_URL: 'https://www.github.com/jeffgore00',
  LINKEDIN_URL: 'https://www.linkedin.com/in/jeff-gore',
  TWITTER_URL: 'https://twitter.com/jeffgore',
  INSTAGRAM_URL: 'https://www.instagram.com/jefeljefe',
};

export const Footer = (): React.ReactElement => (
  <FooterContainer>
    <a
      href="https://www.github.com/jeffgore00"
      data-testid="footer-github"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="GitHub" />
    </a>
    <a
      href="https://www.linkedin.com/in/jeff-gore"
      data-testid="footer-linkedin"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="LinkedIn" />
    </a>
    <a
      href="https://twitter.com/jeffgore"
      data-testid="footer-twitter"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="Twitter" />
    </a>
    <a
      href="https://www.instagram.com/jefeljefe"
      data-testid="footer-instagram"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="Instagram" />
    </a>
  </FooterContainer>
);
