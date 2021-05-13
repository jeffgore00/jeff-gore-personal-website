import homepage from '../pages/home.page';

describe('The homepage', () => {
  beforeAll(() => {
    homepage.open();
  });

  ['desktop', 'mobile'].forEach((screenSize) => {
    describe(`On ${screenSize}`, () => {
      beforeAll(() => {
        if (screenSize === 'mobile') {
          // Simulate mobile window (Pixel 2)
          browser.setWindowSize(411, 731);
        }
      });
      it('should display a heading', () => {
        expect(homepage.heading.isDisplayed()).toBe(true);
      });
      describe('Footer', () => {
        /* These icons are also links that open in a new tab, but this aspect
        is already handled by unit tests and turned out to be unreliable in browser
        tests due to varying behavior when a link is accessed. */
        it('should display a GitHub icon', () => {
          expect(homepage.githubFooterIcon.isDisplayed()).toEqual(true);
        });
        it('should display a LinkedIn icon', () => {
          expect(homepage.linkedinFooterIcon.isDisplayed()).toEqual(true);
        });
        it('should display a Twitter icon', () => {
          expect(homepage.twitterFooterIcon.isDisplayed()).toEqual(true);
        });
        it('should display a Instagram icon', () => {
          expect(homepage.instagramFooterIcon.isDisplayed()).toEqual(true);
        });
      });

      if (screenSize === 'desktop') {
        it('should display an "About Me" link', () => {
          expect(homepage.aboutMeLink.isDisplayed()).toBe(true);
        });
        it('should display a "Projects" link', () => {
          expect(homepage.projectsLink.isDisplayed()).toBe(true);
        });
        it('should display a "Things I Like" link', () => {
          expect(homepage.thingsILikeLink.isDisplayed()).toBe(true);
        });
      }
      if (screenSize === 'mobile') {
        it('should not display the "About Me", "Projects", or "Things I Like" links', () => {
          expect(homepage.aboutMeLink.isDisplayed()).toBe(false);
          expect(homepage.projectsLink.isDisplayed()).toBe(false);
          expect(homepage.thingsILikeLink.isDisplayed()).toBe(false);
        });
        it('should display a hamburger icon', () => {
          expect(homepage.mobileHamburgerMenuIcon.isDisplayed()).toBe(true);
        });
      }
    });
  });
});
