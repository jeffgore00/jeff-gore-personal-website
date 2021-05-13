import React from 'react';
import {
  render,
  screen,
  getByTestId,
  getByAltText,
} from '@testing-library/react';
import { Footer } from '.';
import { setupReactMediaMock } from '../../../../test-utils/react-media';

jest.mock('react-media', () => jest.fn());
setupReactMediaMock();

describe('Footer', () => {
  let footer: HTMLElement;

  beforeAll(() => {
    render(<Footer />);
    footer = screen.getByTestId('footer');
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
    expect(hrefValue).toEqual('https://www.github.com/jeffgore00');
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
    expect(hrefValue).toEqual('https://www.linkedin.com/in/jeff-gore');
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
    expect(hrefValue).toEqual('https://twitter.com/jeffgore');
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
    expect(hrefValue).toEqual('https://www.instagram.com/jefeljefe');
  });
});
