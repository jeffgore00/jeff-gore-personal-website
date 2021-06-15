import React from 'react';
import { render } from '@testing-library/react';

import { useSetPageTitle } from '.';

function TestComponent({
  pageName,
}: {
  pageName?: string;
}): React.ReactElement {
  useSetPageTitle(pageName);
  return <div />;
}

TestComponent.defaultProps = {
  pageName: '',
};

describe('useSetPageTitle', () => {
  beforeAll(() => {
    const title = document.createElement('title');
    document.head.appendChild(title);
  });

  describe('When the pageName argument is supplied', () => {
    beforeAll(() => {
      render(<TestComponent pageName="Projects" />);
    });
    it('Should change the page title to "<pageName> | Jeff Gore"', () => {
      expect(document.head.querySelector('title').innerHTML).toEqual(
        'Projects | Jeff Gore',
      );
    });
  });
  describe('When the pageName argument is not supplied', () => {
    beforeAll(() => {
      render(<TestComponent />);
    });
    it('Should change the page title to "Jeff Gore"', () => {
      expect(document.head.querySelector('title').innerHTML).toEqual(
        'Jeff Gore',
      );
    });
  });
});
