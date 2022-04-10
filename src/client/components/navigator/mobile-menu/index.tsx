import React, { useState } from 'react';
import Drawer from '@mui/material/SwipeableDrawer';

import { StyledButton, StyledLink, LinkPanel } from './styled-components';
import { navMenuEnabledLinks } from '../../../../shared/constants';

export function MobileNavMenu(): React.ReactElement {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div data-testid="mobile-nav-menu">
      <StyledButton type="button" onClick={openDrawer}>
        ≡
      </StyledButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onOpen={openDrawer}
        onClose={closeDrawer}
        classes={{
          paperAnchorRight: 'jg-drawer-open', // This says to apply this custom class when the "paper" (the actual visible white "drawer") is anchored right, which it is (see other props).
        }}
      >
        {Array.from(navMenuEnabledLinks).map(([title, path]) => (
          <StyledLink to={path} key={title} onClick={closeDrawer}>
            <LinkPanel>{title}</LinkPanel>
          </StyledLink>
        ))}
      </Drawer>
    </div>
  );
}
