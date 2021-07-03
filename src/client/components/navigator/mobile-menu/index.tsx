import React, { useState } from 'react';
import loadable from '@loadable/component';

import { StyledButton, StyledLink, LinkPanel } from './styled-components';
import { navMenuEnabledLinks } from '../../../../shared/constants';

export function MobileNavMenu(): React.ReactElement {
  const DrawerModule = loadable.lib(
    () => import('@material-ui/core/SwipeableDrawer'),
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div data-testid="mobile-nav-menu">
      <StyledButton type="button" onClick={openDrawer}>
        ≡
      </StyledButton>
      <DrawerModule>
        {({ default: Drawer }) => (
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
        )}
      </DrawerModule>
    </div>
  );
}
