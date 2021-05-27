import homepage from '../pages/home.page';
import aboutMePage from '../pages/about-me.page';
import blogPage from '../pages/blog.page';
import projectsPage from '../pages/projects.page';
import thingsIlikePage from '../pages/things-i-like.page';

// This global is injected before the tests begin (see wdio.conf.ts):
declare let wdioBaseUrl: string;

describe('URL routes', () => {
  beforeAll(() => {
    /* TODO: check with server first what links *should* be appearing. If a link is 
    disabled, do not test for it. */
    homepage.open();
  });

  describe('When the user clicks the "About Me" link', () => {
    beforeAll(() => {
      homepage.aboutMeLink.click();
      /* Implicit test that the route changes to the expected route. */
      browser.waitUntil(() => browser.getUrl() === `${wdioBaseUrl}/about`);
    });

    it('Displays the "About Me" page', () => {
      expect(aboutMePage.aboutMeHeading.isDisplayed()).toEqual(true);
    });

    describe('When the user clicks on my name in the header', () => {
      beforeAll(() => {
        homepage.heading.click();
        // browser.getUrl() always returns a trailing slash.
        browser.waitUntil(() => browser.getUrl() === `${wdioBaseUrl}/`);
      });

      /* Only one test needed to check that the user returnss to the homepage after being at a 
      different route. Nothing significant about the below being located in the "About Me" test block. */

      // eslint-disable-next-line jest/expect-expect
      it('Returns to the homepage', () => {
        /* TODO: once the homepage has a unique identity (about + blog), then test that.
        Currently the only test is the implicit test above that it gets back to the / base route */
      });
    });
  });

  describe('When the user clicks the "Blog" link', () => {
    beforeAll(() => {
      homepage.blogLink.click();
      browser.waitUntil(() => browser.getUrl() === `${wdioBaseUrl}/blog`);
    });

    it('Displays the "Blog" page', () => {
      expect(blogPage.blogHeading.isDisplayed()).toEqual(true);
    });
  });

  describe('When the user clicks the "Projects" link', () => {
    beforeAll(() => {
      homepage.projectsLink.click();
      browser.waitUntil(() => browser.getUrl() === `${wdioBaseUrl}/projects`);
    });

    it('Displays the "Projects" page', () => {
      expect(projectsPage.projectsHeading.isDisplayed()).toEqual(true);
    });
  });

  describe('When the user clicks the "Things I Like" link', () => {
    beforeAll(() => {
      homepage.thingsILikeLink.click();
      browser.waitUntil(
        () => browser.getUrl() === `${wdioBaseUrl}/things-i-like`,
      );
    });

    it('Displays the "Things I Like" page', () => {
      expect(thingsIlikePage.thingsILikeHeading.isDisplayed()).toEqual(true);
    });
  });
});
