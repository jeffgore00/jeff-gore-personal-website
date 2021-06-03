import homepage from '../pages/home.page';
import { footerLinks } from '../../src/client/components/footer';
import {
  navMenuEnabledLinks,
  NavMenuLinkText,
} from '../../src/shared/constants';

const viewportScenarios = {
  WIDE: 'the viewport width is greater than or equal to 700px',
  NARROW: 'the viewport width is less than 700px',
};

describe('The homepage', () => {
  beforeAll(() => {
    homepage.open();
  });

  describe('Footer', () => {
    /* Originally the links were tested by actually clicking them and checking that the new tab
    URL matched the link, but the behavior of other websites cannot be controlled. For instance sometimes
    the LinkedIn page would redirect to a different page. */
    it('should display a GitHub icon which is a link to my Github page', () => {
      expect(homepage.githubFooterIcon.isDisplayed()).toEqual(true);
      expect(homepage.githubFooterIcon.getAttribute('href')).toEqual(
        footerLinks.GITHUB_URL,
      );
    });
    it('should display a LinkedIn icon which is a link to my LinkedIn page', () => {
      expect(homepage.linkedinFooterIcon.isDisplayed()).toEqual(true);
      expect(homepage.linkedinFooterIcon.getAttribute('href')).toEqual(
        footerLinks.LINKEDIN_URL,
      );
    });
    it('should display a Twitter icon which is a link to my Twitter page', () => {
      expect(homepage.twitterFooterIcon.isDisplayed()).toEqual(true);
      expect(homepage.twitterFooterIcon.getAttribute('href')).toEqual(
        footerLinks.TWITTER_URL,
      );
    });
    it('should display a Instagram icon which is a link to my Instagram page', () => {
      expect(homepage.instagramFooterIcon.isDisplayed()).toEqual(true);
      expect(homepage.instagramFooterIcon.getAttribute('href')).toEqual(
        footerLinks.INSTAGRAM_URL,
      );
    });
  });

  describe('Header', () => {
    it('should display my name as the main <h1> header', () => {
      expect(homepage.heading.getText()).toEqual('Jeff Gore');
    });

    /* TODO: use wdio-image-comparison-service for visual regression testing */
    it('should display my name in a custom font', () => {
      expect(homepage.heading.getCSSProperty('font-family').value).toEqual(
        'jetbrainsmono',
      );
    });

    /* TODO: Once you have devices tested as part of WDIO capabilities, then it would look more like
    supportedViewportScenarios.forEach */
    [viewportScenarios.WIDE, viewportScenarios.NARROW].forEach(
      (viewportScenario) => {
        describe(`When ${viewportScenario}`, () => {
          let originalWindowSize: { width: number; height: number };
          let homepageLinkMap: Map<NavMenuLinkText, WebdriverIO.Element>;

          beforeAll(() => {
            homepageLinkMap = new Map([
              [NavMenuLinkText.About, homepage.aboutMeLink],
              [NavMenuLinkText.Blog, homepage.blogLink],
              [NavMenuLinkText.Projects, homepage.projectsLink],
              [NavMenuLinkText.ThingsILike, homepage.thingsILikeLink],
              [NavMenuLinkText.Contact, homepage.contactLink],
              [NavMenuLinkText.Crazytown, homepage.crazytownLink],
            ]);

            if (viewportScenario === viewportScenarios.NARROW) {
              /* TODO: only call setWindowSize if we know it's a non-mobile device. Resizing a 
              window isn't feasible or necessary on a mobile device. */
              originalWindowSize = browser.getWindowSize();
              browser.setWindowSize(411, 731);
            }
          });

          afterAll(() => {
            if (viewportScenario === viewportScenarios.NARROW) {
              const { width, height } = originalWindowSize;
              browser.setWindowSize(width, height);
            }
          });

          if (viewportScenario === viewportScenarios.WIDE) {
            navMenuEnabledLinks.forEach((route, pageName) => {
              it(`should display the "${pageName}" link`, () => {
                expect(homepageLinkMap.get(pageName).isDisplayed()).toBe(true);
              });
            });
            it('should not display a hamburger icon', () => {
              expect(homepage.mobileHamburgerMenuIcon.isDisplayed()).toBe(
                false,
              );
            });
          }
          if (viewportScenario === viewportScenarios.NARROW) {
            const enabledLinksText = Array.from(navMenuEnabledLinks.keys())
              .map((val) => `"${val}"`)
              .join(', ');

            it('should display a hamburger icon', () => {
              expect(homepage.mobileHamburgerMenuIcon.isDisplayed()).toBe(true);
            });

            it(`should not display the ${enabledLinksText} links`, () => {
              navMenuEnabledLinks.forEach((route, pageName) => {
                expect(homepageLinkMap.get(pageName).isDisplayed()).toBe(false);
              });
            });
          }
        });
      },
    );
  });
});
