/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, queryByTestId, screen } from '@testing-library/react';

import { PageWrapper } from '.';
import * as NavigatorModule from '../navigator';
import * as FooterModule from '../footer';
import * as ErrorBoundaryModule from '../error-boundary';

import * as useSetPageTitleModule from '../../hooks/use-set-page-title';
import {
  navMenuAllLinksByPathname,
  NavMenuLinkRoute,
} from '../../../shared/constants';

const mockPathname = '/projects';
const mockPathnameEnum = mockPathname as NavMenuLinkRoute;

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property: useLocation"
jest.mock('react-router-dom', () => ({
  Link: () => <div />, // only needed because the source file still imports the actual Navigator, even though it spies on it immediately after
  useLocation: () => ({
    pathname: mockPathname,
    search: '',
    hash: '',
    state: {},
  }),
}));

describe('Page Wrapper', () => {
  let pageWrapper: HTMLElement;
  let useSetPageTitle: jest.SpyInstance;

  beforeAll(() => {
    jest
      .spyOn(NavigatorModule, 'Navigator')
      .mockImplementation(() => <div data-testid="mocked-navigator" />);

    jest
      .spyOn(FooterModule, 'Footer')
      .mockImplementation(() => <footer data-testid="mocked-footer" />);

    jest.spyOn(ErrorBoundaryModule, 'ErrorBoundary').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore. This is valid
      ({ children }: { children: React.ReactChildren }) => children,
    );

    useSetPageTitle = jest
      .spyOn(useSetPageTitleModule, 'useSetPageTitle')
      .mockImplementation(jest.fn());

    render(
      <PageWrapper>
        <div data-testid="child-of-page-wrapper" />
      </PageWrapper>,
    );
    pageWrapper = screen.getByTestId('page-wrapper');
  });

  it('calls the useSetPageTitle hook with the enum corresponding to the pathname', () => {
    expect(useSetPageTitle).toBeCalledWith(
      navMenuAllLinksByPathname.get(mockPathnameEnum),
    );
  });

  it('renders the Navigator', () => {
    expect(queryByTestId(pageWrapper, 'mocked-navigator')).toBeTruthy();
  });

  it('renders the Navigator within a <header> element', () => {
    const child = queryByTestId(pageWrapper, 'mocked-navigator');
    expect(child.closest('header')).toBeTruthy();
  });

  it('renders the `children` elements passed in as a prop', () => {
    expect(queryByTestId(pageWrapper, 'child-of-page-wrapper')).toBeTruthy();
  });

  it('renders the `children` elements within a <main> element', () => {
    const child = queryByTestId(pageWrapper, 'child-of-page-wrapper');
    expect(child.closest('main')).toBeTruthy();
  });

  it('renders the elements in this order: <header>, <main>, <footer>', () => {
    const header = pageWrapper.querySelector('header');
    expect(header.nextElementSibling.tagName).toEqual('MAIN');
    expect(header.nextElementSibling.nextElementSibling.tagName).toEqual(
      'FOOTER',
    );
  });
});
