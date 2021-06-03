/* NAV MENU */

export enum NavMenuLinkText {
  About = 'About',
  Projects = 'Projects',
  ThingsILike = 'Things I Like',
  Blog = 'Blog',
  Contact = 'Contact',
  Crazytown = 'Crazytown', // will never be enabled, just for test coverage of disabled route
}

export enum NavMenuLinkRoute {
  About = '/about',
  Projects = '/projects',
  ThingsILike = '/things-i-like',
  Blog = '/blog',
  Contact = '/contact',
  Crazytown = '/crazytown', // will never be enabled, just for test coverage of disabled route
}

/* Using a Map since it allows non-string keys. */
type NavMenuMap = Map<NavMenuLinkText, NavMenuLinkRoute>;

export const navMenuAllLinks: NavMenuMap = new Map([
  [NavMenuLinkText.About, NavMenuLinkRoute.About],
  [NavMenuLinkText.Blog, NavMenuLinkRoute.Blog],
  [NavMenuLinkText.Projects, NavMenuLinkRoute.Projects],
  [NavMenuLinkText.ThingsILike, NavMenuLinkRoute.ThingsILike],
  [NavMenuLinkText.Contact, NavMenuLinkRoute.Contact],
  [NavMenuLinkText.Crazytown, NavMenuLinkRoute.Crazytown], // will never be enabled, just for test coverage of disabled route
]);

export const navMenuAllLinksByPathname = new Map([
  [NavMenuLinkRoute.About, NavMenuLinkText.About],
  [NavMenuLinkRoute.Blog, NavMenuLinkText.Blog],
  [NavMenuLinkRoute.Projects, NavMenuLinkText.Projects],
  [NavMenuLinkRoute.ThingsILike, NavMenuLinkText.ThingsILike],
  [NavMenuLinkRoute.Contact, NavMenuLinkText.Contact],
  [NavMenuLinkRoute.Crazytown, NavMenuLinkText.Crazytown], // will never be enabled, just for test coverage of disabled route
]);

export const enabledPageRoutes = [
  NavMenuLinkRoute.About,
  NavMenuLinkRoute.Blog,
  NavMenuLinkRoute.Projects,
  NavMenuLinkRoute.ThingsILike,
  NavMenuLinkRoute.Contact,
];

enum LinkStatus {
  Enabled,
  Disabled,
}

function getNavMenuLinksFilteredToEnabledOrDisabled(desiredStatus: LinkStatus) {
  const filteredMap = new Map();
  navMenuAllLinks.forEach((value, key) => {
    const pageIsEnabled = enabledPageRoutes.includes(value);
    if (desiredStatus === LinkStatus.Enabled && pageIsEnabled) {
      filteredMap.set(key, value);
    }
    if (desiredStatus === LinkStatus.Disabled && !pageIsEnabled) {
      filteredMap.set(key, value);
    }
  });
  // This assumes that the map will have at least one entry.
  return <NavMenuMap>filteredMap;
}

export const navMenuEnabledLinks = (function generateNavMenuEnabledLinks(): NavMenuMap {
  return getNavMenuLinksFilteredToEnabledOrDisabled(LinkStatus.Enabled);
})();

export const navMenuDisabledLinks = (function generateNavMenuEnabledLinks(): NavMenuMap {
  return getNavMenuLinksFilteredToEnabledOrDisabled(LinkStatus.Disabled);
})();
