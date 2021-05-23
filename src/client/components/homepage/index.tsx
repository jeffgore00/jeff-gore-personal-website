import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Navigator } from '../navigator';
import { Footer } from '../footer';

import logger from '../../utils/logger';

export const HomepageStylingContainer = styled.div.attrs({
  id: 'home',
  'data-testid': 'home',
})``;

export const HOMEPAGE_RENDERED_LOG = 'Homepage Rendered';

export const Homepage = (): React.ReactElement => {
  useEffect(() => {
    void logger.info(HOMEPAGE_RENDERED_LOG);
  }, []);

  return (
    <HomepageStylingContainer>
      <header>
        <Navigator />
      </header>
      <Footer />
    </HomepageStylingContainer>
  );
};
