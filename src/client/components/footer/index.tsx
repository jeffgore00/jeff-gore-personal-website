import React from 'react';
import styled from 'styled-components';

/* TODO: Remove role="contentinfo" when react-testing-library is fixed. The <footer>
should innately have this role, but RTL doesn't detect it. */
const FooterContainer = styled.footer.attrs({
  'data-testid': 'footer',
  role: 'contentinfo',
})`
  display: flex;
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
  GITHUB_URL: 'https://github.com/jeffgore00',
  LINKEDIN_URL: 'https://www.linkedin.com/in/jeff-gore',
  TWITTER_URL: 'https://twitter.com/jeffgore',
  INSTAGRAM_URL: 'https://www.instagram.com/jefeljefe',
};

export const Footer = (): React.ReactElement => (
  <FooterContainer>
    <a
      href={footerLinks.GITHUB_URL}
      data-testid="footer-github"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="GitHub" />
    </a>
    <a
      href={footerLinks.LINKEDIN_URL}
      data-testid="footer-linkedin"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="LinkedIn" />
    </a>
    <a
      href={footerLinks.TWITTER_URL}
      data-testid="footer-twitter"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="Twitter" />
    </a>
    <a
      href={footerLinks.INSTAGRAM_URL}
      data-testid="footer-instagram"
      target="_blank"
      rel="noreferrer"
    >
      <FooterIcon name="Instagram" />
    </a>
  </FooterContainer>
);
