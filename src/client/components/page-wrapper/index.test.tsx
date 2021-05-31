/*
It renders children within an error boundary and a <main>

It renders the navigator within a <header>

It renders the footer
*/

import React from 'react';
import { queryByTestId, render, screen } from '@testing-library/react';

import { setupReactMediaMock } from '../../../../test-utils/react-media';
import { PageWrapper } from '.';
import * as NavigatorModule from '../navigator';

jest.mock('react-media', () => jest.fn());
setupReactMediaMock();

describe('Homepage', () => {
  let pageWrapper: HTMLElement;

  beforeAll(() => {
    jest
      .spyOn(NavigatorModule, 'Navigator')
      .mockImplementation(() => <div data-testid="mocked-navigator" />);
    render(
      <PageWrapper>
        <div data-testid="child-of-page-wrapper" />
      </PageWrapper>,
    );
    pageWrapper = screen.getByTestId('page-wrapper');
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
