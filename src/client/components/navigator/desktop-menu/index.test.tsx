import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen, render, getByText } from '@testing-library/react';
import { DesktopNavMenu } from '.';

describe('Desktop Nav Menu', () => {
  let desktopNavMenu: HTMLElement;

  enum NavMenuLinkText {
    About = 'About',
    Projects = 'Projects',
    ThingsILike = 'Things I Like',
  }

  type NavMenuLinks = {
    [key in NavMenuLinkText]: string;
  };

  const expectedLinks: NavMenuLinks = {
    [NavMenuLinkText.About]: '/about',
    [NavMenuLinkText.Projects]: '/projects',
    [NavMenuLinkText.ThingsILike]: '/things-i-like',
  };

  beforeAll(() => {
    render(
      <Router>
        <DesktopNavMenu />
      </Router>,
    );
    desktopNavMenu = screen.getByTestId('desktop-nav-menu'); // </nav>
  });
  it('displays the expected list of words as hyperlinks', () => {
    Object.keys(expectedLinks).forEach((linkText: NavMenuLinkText) => {
      const element = getByText(desktopNavMenu, linkText);
      const hrefValue = element.attributes.getNamedItem('href').value;
      expect(hrefValue).toEqual(expectedLinks[linkText]);
    });
  });
});
