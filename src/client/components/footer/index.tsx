import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer.attrs({
  'data-testid': 'footer',
})`
  display: flex;
  align-items: center;
`;

const CopyrightContainer = styled.div.attrs({
  'data-testid': 'copyright-footer',
})`
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
`;

const SocialMediaIconsContainer = styled.div.attrs({
  'data-testid': 'social-media-icons',
})`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;

/* The images are natively sized to 48x48px, but explicit width and height is still recommended by
Lighthouse: https://web.dev/optimize-cls/?utm_source=lighthouse&utm_medium=lr#images-without-dimensions */
function FooterIcon({ name }: { name: string }) {
  return (
    <img
      src={`/icon_${name.toLowerCase()}.webp`}
      alt={`Link to my ${name} page`}
      style={{ marginLeft: '15px' }}
      width="48px"
      height="48px"
    />
  );
}

export const footerLinks = {
  GITHUB_URL: 'https://github.com/jeffgore00',
  LINKEDIN_URL: 'https://www.linkedin.com/in/jeff-gore',
  TWITTER_URL: 'https://twitter.com/jeffgore',
  INSTAGRAM_URL: 'https://www.instagram.com/jefeljefe',
};

export function Footer(): React.ReactElement {
  return (
    <FooterContainer>
      <CopyrightContainer>{`© ${new Date().getFullYear()} Jeff Gore`}</CopyrightContainer>
      <SocialMediaIconsContainer>
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
      </SocialMediaIconsContainer>
    </FooterContainer>
  );
}
