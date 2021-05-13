import React from 'react';
import {
  render,
  screen,
  getByRole,
  queryByText,
  queryByTestId,
} from '@testing-library/react';
import { Navigator } from '.';
import { setupReactMediaMock } from '../../../../test-utils/react-media';

jest.mock('react-media', () => jest.fn());
const {
  simulateMobileScreenWidth,
  simulateDesktopScreenWidth,
} = setupReactMediaMock();

describe('The Navigator component', () => {
  describe('Name section', () => {
    let navbar: HTMLElement;

    beforeAll(() => {
      render(<Navigator />);
      navbar = screen.getByRole('navigation');
    });

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
        render(<Navigator />);
        navbar = screen.getByRole('navigation');
      });

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
        render(<Navigator />);
        navbar = screen.getByRole('navigation');
      });

      it('should display the desktop nav', () => {
        expect(queryByTestId(navbar, 'desktop-nav-menu')).toBeTruthy();
      });

      it('should not display the hamburger nav', () => {
        expect(queryByTestId(navbar, 'mobile-nav-menu')).toBeNull();
      });
    });
  });
});
