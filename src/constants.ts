/* NAV MENU */

export enum NavMenuLinkText {
  About = 'About',
  Projects = 'Projects',
  ThingsILike = 'Things I Like',
  Blog = 'Blog',
  Crazytown = 'Crazytown', // will never be enabled, just for test coverage
}

export enum NavMenuLinkRoute {
  About = '/about',
  Projects = '/projects',
  ThingsILike = '/things-i-like',
  Blog = '/blog',
  Crazytown = '/crazytown',
}

/* Using a Map since it allows non-string keys. */
type NavMenuMap = Map<NavMenuLinkText, NavMenuLinkRoute>;

export const navMenuAllLinks: NavMenuMap = new Map([
  [NavMenuLinkText.About, NavMenuLinkRoute.About],
  [NavMenuLinkText.Blog, NavMenuLinkRoute.Blog],
  [NavMenuLinkText.Projects, NavMenuLinkRoute.Projects],
  [NavMenuLinkText.ThingsILike, NavMenuLinkRoute.ThingsILike],
  [NavMenuLinkText.Crazytown, NavMenuLinkRoute.Crazytown],
]);

export const enabledPageRoutes = [
  NavMenuLinkRoute.About,
  NavMenuLinkRoute.Blog,
  NavMenuLinkRoute.Projects,
  NavMenuLinkRoute.ThingsILike,
];

export const navMenuEnabledLinks = (function generateNavMenuEnabledLinks(): NavMenuMap {
  const filteredMap = new Map();
  navMenuAllLinks.forEach((value, key) => {
    if (enabledPageRoutes.includes(value)) {
      filteredMap.set(key, value);
    }
  });
  // This assumes that at least one route will always be enabled.
  return <NavMenuMap>filteredMap;
})();
