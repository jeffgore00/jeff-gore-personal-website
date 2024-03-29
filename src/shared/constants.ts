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

export const navMenuAllLinksByName: NavMenuMap = new Map([
  [NavMenuLinkText.About, NavMenuLinkRoute.About],
  [NavMenuLinkText.Blog, NavMenuLinkRoute.Blog],
  [NavMenuLinkText.Projects, NavMenuLinkRoute.Projects],
  [NavMenuLinkText.ThingsILike, NavMenuLinkRoute.ThingsILike],
  [NavMenuLinkText.Contact, NavMenuLinkRoute.Contact],
  [NavMenuLinkText.Crazytown, NavMenuLinkRoute.Crazytown], // will never be enabled, just for test coverage of disabled route
]);

export const allRoutesByName = new Map([
  // Visible links on the nav menu
  ...Array.from(navMenuAllLinksByName),
  // Content-specific links
  ['Individual Blog', `${NavMenuLinkRoute.Blog}/:contentId`],
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
  `${NavMenuLinkRoute.Blog}/:contentId`,
];

enum LinkStatus {
  Enabled,
  Disabled,
}

function getNavMenuLinksFilteredToEnabledOrDisabled(
  links: Map<string, string>,
  desiredStatus: LinkStatus,
) {
  let filteredMap: Map<string, string>;

  function addValueToMap(key: string, value: string) {
    if (!filteredMap) {
      filteredMap = new Map([[key, value]]);
    }
    filteredMap.set(key, value);
  }

  links.forEach((value, key) => {
    const pageIsEnabled = enabledPageRoutes.includes(value);
    if (desiredStatus === LinkStatus.Enabled && pageIsEnabled) {
      addValueToMap(key, value);
    }
    if (desiredStatus === LinkStatus.Disabled && !pageIsEnabled) {
      addValueToMap(key, value);
    }
  });
  // istanbul ignore next for the || new Map() case.
  return filteredMap || new Map();
}

export const navMenuEnabledLinks = (function generateNavMenuEnabledLinks():
  | NavMenuMap
  | Map<undefined, undefined> {
  //  Undefined is for the empty map case.
  return getNavMenuLinksFilteredToEnabledOrDisabled(
    navMenuAllLinksByName,
    LinkStatus.Enabled,
  );
})();

export const navMenuDisabledLinks = (function generateNavMenuEnabledLinks():
  | NavMenuMap
  | Map<undefined, undefined> {
  //  Undefined is for the empty map case.
  return getNavMenuLinksFilteredToEnabledOrDisabled(
    navMenuAllLinksByName,
    LinkStatus.Disabled,
  );
})();

export const enabledRoutesByName = (function generateNavMenuEnabledLinks():
  | NavMenuMap
  | Map<undefined, undefined> {
  //  Undefined is for the empty map case.
  return getNavMenuLinksFilteredToEnabledOrDisabled(
    allRoutesByName,
    LinkStatus.Enabled,
  );
})();
