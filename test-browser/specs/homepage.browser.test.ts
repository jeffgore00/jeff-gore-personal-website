import homepage from '../pages/home.page';
import { footerLinks } from '../../src/client/components/footer';

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
        afterEach(() => {
          browser.switchWindow(wdioBaseUrl);
        });
        /* eslint-disable jest/expect-expect */
        it('should display a GitHub icon which is a link to my GitHub page in a new tab', () => {
          homepage.githubFooterIcon.click();
          browser.switchWindow(footerLinks.GITHUB_URL);
          browser.closeWindow();
        });
        it('should display a LinkedIn icon which is a link to my LinkedIn page in a new tab', () => {
          homepage.linkedinFooterIcon.click();
          browser.switchWindow(footerLinks.LINKEDIN_URL);
          browser.closeWindow();
        });
        it('should display a Twitter icon which is a link to my Twitter page in a new tab', () => {
          homepage.twitterFooterIcon.click();
          browser.switchWindow(footerLinks.TWITTER_URL);
          browser.closeWindow();
        });
        it('should display a Instagram icon which is a link to my Instagram page in a new tab', () => {
          homepage.instagramFooterIcon.click();
          browser.switchWindow(footerLinks.INSTAGRAM_URL);
          browser.closeWindow();
        });
        /* eslint-enable jest/expect-expect */
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
