/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';

import {
  DesktopNavMenuContainer,
  StyledLink,
  NonFirstHyperlink,
} from './styled-components';

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property: useLocation"
jest.mock('react-router-dom', () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactChild;
    className: string;
  }) => (
    <div className={className} id={`link-to-${to}`}>
      {children}
    </div>
  ),
}));

describe('DesktopNavMenuContainer presentational component', () => {
  it('renders the wrapped content with the expected CSS styles and HTML attributes', () => {
    const { container } = render(
      <DesktopNavMenuContainer>
        The Algorithms That Still Matter
      </DesktopNavMenuContainer>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('StyledLink presentational component', () => {
  it('renders the React Router <Link> with the expected CSS styles', () => {
    const { container } = render(<StyledLink to="/blog" key="Blog" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('NonFirstHyperlink presentational component', () => {
  it('renders the wrapped content with the expected CSS styles and HTML attributes', () => {
    const { container } = render(
      <NonFirstHyperlink>
        <a href="/blog">Blog</a>
      </NonFirstHyperlink>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
