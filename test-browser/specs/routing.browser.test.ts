import homepage from '../pages/home.page';
import aboutMePage from '../pages/about-me.page';
import blogPage from '../pages/blog.page';
import projectsPage from '../pages/projects.page';
import thingsIlikePage from '../pages/things-i-like.page';

// This global is injected before the tests begin (see wdio.conf.ts):
declare let wdioBaseUrl: string;

describe('URL routes', () => {
  describe(`When the user accesses the homepage ("/" base route)`, () => {
    beforeEach(() => {
      /* TODO: check with server first what links *should* be appearing. If a link is 
      disabled, do not test for it. */
      homepage.open();
    });

    describe('When the user clicks the "About Me" link', () => {
      beforeEach(() => {
        homepage.aboutMeLink.click();
        /* Implicit test that the route changes to the expected route. */
        browser.waitUntil(() => browser.getUrl() === `${wdioBaseUrl}/about`);
      });

      it('Displays the "About Me" page', () => {
        expect(aboutMePage.aboutMeHeading.isDisplayed()).toEqual(true);
      });
    });

    describe('When the user clicks the "Blog" link', () => {
      beforeEach(() => {
        homepage.blogLink.click();
        browser.waitUntil(() => browser.getUrl() === `${wdioBaseUrl}/blog`);
      });

      it('Displays the "Blog" page', () => {
        expect(blogPage.blogHeading.isDisplayed()).toEqual(true);
      });
    });

    describe('When the user clicks the "Projects" link', () => {
      beforeEach(() => {
        homepage.projectsLink.click();
        browser.waitUntil(() => browser.getUrl() === `${wdioBaseUrl}/projects`);
      });

      it('Displays the "Projects" page', () => {
        expect(projectsPage.projectsHeading.isDisplayed()).toEqual(true);
      });
    });

    describe('When the user clicks the "Things I Like" link', () => {
      beforeEach(() => {
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
  describe(`When the user accesses the /about URL directly`, () => {
    beforeEach(() => {
      browser.url(`${wdioBaseUrl}/about`);
    });

    it('Displays the "About Me" page', () => {
      expect(aboutMePage.aboutMeHeading.isDisplayed()).toEqual(true);
    });
  });
  describe(`When the user accesses the /blog URL directly`, () => {
    beforeEach(() => {
      browser.url(`${wdioBaseUrl}/blog`);
    });

    it('Displays the "Blog" page', () => {
      expect(blogPage.blogHeading.isDisplayed()).toEqual(true);
    });
  });
  describe(`When the user accesses the /projects URL directly`, () => {
    beforeEach(() => {
      browser.url(`${wdioBaseUrl}/projects`);
    });

    it('Displays the "Projects" page', () => {
      expect(projectsPage.projectsHeading.isDisplayed()).toEqual(true);
    });
  });
  describe(`When the user accesses the /things-i-like URL directly`, () => {
    beforeEach(() => {
      browser.url(`${wdioBaseUrl}/things-i-like`);
    });

    it('Displays the "Things I Like" page', () => {
      expect(thingsIlikePage.thingsILikeHeading.isDisplayed()).toEqual(true);
    });
  });
});
