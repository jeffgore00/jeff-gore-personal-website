import React from 'react';
import {
  render,
  screen,
  getByTestId,
  getByAltText,
  queryByText,
} from '@testing-library/react';
import { Footer, footerLinks } from '.';

describe('Footer', () => {
  let footer: HTMLElement;

  beforeAll(() => {
    render(<Footer />);
    footer = screen.getByTestId('footer');
  });

  it('displays my name with the copyright symbol and the current year', () => {
    const copyright = queryByText(
      footer,
      `© ${new Date().getFullYear()} Jeff Gore`,
    );

    expect(copyright).toBeTruthy();
  });

  it('displays a Github icon with a link', () => {
    const imageWrappedInLink: HTMLElement = getByTestId(
      footer,
      'footer-github',
    );
    const image: HTMLElement = getByAltText(
      imageWrappedInLink,
      'Link to my GitHub page',
    );
    expect(image.tagName).toEqual('IMG');
    const hrefValue = imageWrappedInLink.attributes.getNamedItem('href').value;
    expect(hrefValue).toEqual(footerLinks.GITHUB_URL);
    const targetValue =
      imageWrappedInLink.attributes.getNamedItem('target').value;
    expect(targetValue).toEqual('_blank');
  });

  it('displays a LinkedIn icon with a link', () => {
    const imageWrappedInLink: HTMLElement = getByTestId(
      footer,
      'footer-linkedin',
    );
    const image: HTMLElement = getByAltText(
      imageWrappedInLink,
      'Link to my LinkedIn page',
    );
    expect(image.tagName).toEqual('IMG');
    const hrefValue = imageWrappedInLink.attributes.getNamedItem('href').value;
    expect(hrefValue).toEqual(footerLinks.LINKEDIN_URL);
    const targetValue =
      imageWrappedInLink.attributes.getNamedItem('target').value;
    expect(targetValue).toEqual('_blank');
  });

  it('displays a Twitter icon with a link', () => {
    const imageWrappedInLink: HTMLElement = getByTestId(
      footer,
      'footer-twitter',
    );
    const image: HTMLElement = getByAltText(
      imageWrappedInLink,
      'Link to my Twitter page',
    );
    expect(image.tagName).toEqual('IMG');
    const hrefValue = imageWrappedInLink.attributes.getNamedItem('href').value;
    expect(hrefValue).toEqual(footerLinks.TWITTER_URL);
    const targetValue =
      imageWrappedInLink.attributes.getNamedItem('target').value;
    expect(targetValue).toEqual('_blank');
  });

  it('displays an Instagram icon with a link', () => {
    const imageWrappedInLink: HTMLElement = getByTestId(
      footer,
      'footer-instagram',
    );
    const image: HTMLElement = getByAltText(
      imageWrappedInLink,
      'Link to my Instagram page',
    );
    expect(image.tagName).toEqual('IMG');
    const hrefValue = imageWrappedInLink.attributes.getNamedItem('href').value;
    expect(hrefValue).toEqual(footerLinks.INSTAGRAM_URL);
    const targetValue =
      imageWrappedInLink.attributes.getNamedItem('target').value;
    expect(targetValue).toEqual('_blank');
  });
});
