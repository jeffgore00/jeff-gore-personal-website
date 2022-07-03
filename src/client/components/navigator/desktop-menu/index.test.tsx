/**
 * @jest-environment jsdom
 */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { screen, render, getByText } from '@testing-library/react';
import { DesktopNavMenu } from '.';
import {
  navMenuEnabledLinks,
  NavMenuLinkRoute,
  NavMenuLinkText,
} from '../../../../shared/constants';

describe('Desktop Nav Menu', () => {
  let desktopNavMenu: HTMLElement;

  beforeAll(() => {
    render(
      <Router>
        <DesktopNavMenu />
      </Router>,
    );
    desktopNavMenu = screen.getByTestId('desktop-nav-menu'); // </nav>
  });

  it('displays the expected list of words as hyperlinks', () => {
    navMenuEnabledLinks.forEach(
      (linkRoute: NavMenuLinkRoute, linkText: NavMenuLinkText) => {
        const element = getByText(desktopNavMenu, linkText);
        const hrefValue = element.attributes.getNamedItem('href').value;
        expect(hrefValue).toEqual(linkRoute);
      },
    );
  });
});
