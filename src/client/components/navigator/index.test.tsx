/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
  getByRole,
  queryByText,
  queryByTestId,
  cleanup,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Navigator } from '.';
import { setupReactMediaMock } from '../../../../test-utils/react-media';

const { simulateMobileScreenWidth, simulateDesktopScreenWidth } =
  setupReactMediaMock();

describe('The Navigator component', () => {
  describe('Name section', () => {
    let navbar: HTMLElement;

    beforeAll(() => {
      render(
        <Router>
          <Navigator />
        </Router>,
      );
      navbar = screen.getByRole('navigation');
    });

    afterAll(cleanup);

    it('should display my name', () => {
      const nameElement = getByRole(navbar, 'heading');
      expect(queryByText(nameElement, 'Jeff Gore')).toBeTruthy();
    });

    it('should link back to the homepage', () => {
      const nameElement = getByRole(navbar, 'heading');
      const hyperlink = getByRole(nameElement, 'link');
      const hrefValue = hyperlink.attributes.getNamedItem('href').value;
      expect(hrefValue).toEqual('/');
    });
  });
  describe('Navigation Menu', () => {
    describe('On a small screen', () => {
      let navbar: HTMLElement;

      beforeAll(() => {
        simulateMobileScreenWidth();
        render(
          <Router>
            <Navigator />
          </Router>,
        );
        navbar = screen.getByRole('navigation');
      });

      afterAll(cleanup);

      it('should display the hamburger nav', () => {
        expect(queryByTestId(navbar, 'mobile-nav-menu')).toBeTruthy();
      });

      it('should not display the desktop nav', () => {
        expect(queryByTestId(navbar, 'desktop-nav-menu')).toBeNull();
      });
    });

    describe('On a large screen', () => {
      let navbar: HTMLElement;

      beforeAll(() => {
        simulateDesktopScreenWidth();
        render(
          <Router>
            <Navigator />
          </Router>,
        );
        navbar = screen.getByRole('navigation');
      });

      afterAll(cleanup);

      it('should display the desktop nav', () => {
        expect(queryByTestId(navbar, 'desktop-nav-menu')).toBeTruthy();
      });

      it('should not display the hamburger nav', () => {
        expect(queryByTestId(navbar, 'mobile-nav-menu')).toBeNull();
      });
    });
  });
});
