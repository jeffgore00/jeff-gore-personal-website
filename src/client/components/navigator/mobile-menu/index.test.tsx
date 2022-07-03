/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  cleanup,
  screen,
  queryByText,
  getByText,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { MobileNavMenu } from '.';

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property: useLocation"
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactChild }) => (
    <div id={`link-to-${to}`}>{children}</div>
  ),
}));

describe('Mobile nav menu', () => {
  let mobileNav: HTMLElement;
  let testingContainer: HTMLElement;

  beforeAll(() => {
    testingContainer = document.createElement('div');
    testingContainer.setAttribute('id', 'testing-container');
    render(<MobileNavMenu />, {
      container: document.body.appendChild(testingContainer),
    });
    mobileNav = screen.getByTestId('mobile-nav-menu');
  });

  afterAll(cleanup);

  it('renders a hamburger icon', () => {
    expect(queryByText(mobileNav, '≡')).toBeTruthy();
  });

  it('adds a swipeable drawer that is hidden by default', () => {
    // The drawer is hidden
    expect(screen.queryByRole('presentation')).not.toBeTruthy();
    expect(document.querySelector('.jg-drawer-open')).not.toBeTruthy();

    // ...and the main content is not hidden
    expect(testingContainer.getAttribute('aria-hidden')).toEqual(null);
  });

  describe('When the hamburger icon is clicked', () => {
    beforeAll(() => {
      getByText(mobileNav, '≡').click();
    });

    it('opens the drawer as a layer on top of the existing page', () => {
      expect(screen.queryByRole('presentation')).toBeTruthy();
      expect(document.querySelector('.jg-drawer-open')).toBeTruthy();
      expect(
        Number(
          getComputedStyle(screen.getByRole('presentation')).getPropertyValue(
            'z-index',
          ),
        ),
      ).toBeGreaterThan(0);
    });

    it('sets "aria-hidden":"true" on the page underneath', () => {
      expect(testingContainer.getAttribute('aria-hidden')).toEqual('true');
    });

    describe('When the area outside of the open drawer is clicked', () => {
      beforeAll(async () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const backdrop = document.querySelector(
          '.MuiBackdrop-root',
        ) as HTMLElement;
        backdrop.click();

        try {
          await waitForElementToBeRemoved(
            document.querySelector('.jg-drawer-open'),
          );
        } catch {
          // elements are already removed
        }
      });

      it('removes the drawer layer from the page', () => {
        expect(screen.queryByRole('presentation')).not.toBeTruthy();
      });

      it('Removes the "aria-hidden":"true" attribute from the page underneath', () => {
        expect(testingContainer.getAttribute('aria-hidden')).toEqual(null);
      });
    });
  });
});
