import homepage from '../pages/home.page';
import aboutMePage from '../pages/about-me.page';
import blogPage from '../pages/blog.page';
import projectsPage from '../pages/projects.page';
import thingsIlikePage from '../pages/things-i-like.page';
import contactPage from '../pages/contact.page';

import {
  navMenuEnabledLinks,
  navMenuDisabledLinks,
  NavMenuLinkText,
} from '../../src/shared/constants';

const pageMap = new Map([
  [NavMenuLinkText.About, aboutMePage],
  [NavMenuLinkText.Blog, blogPage],
  [NavMenuLinkText.Projects, projectsPage],
  [NavMenuLinkText.ThingsILike, thingsIlikePage],
  [NavMenuLinkText.Contact, contactPage],
]);

// This global is injected before the tests begin (see wdio.conf.ts):
declare let wdioBaseUrl: string;

describe('URL routes', () => {
  beforeAll(async () => {
    /* TODO: check with server first what links *should* be appearing. If a link is 
    disabled, do not test for it. */
    await homepage.open();
  });
  describe(`When the user accesses the homepage ("/" base route)`, () => {
    let homepageLinkMap: Map<NavMenuLinkText, WebdriverIO.Element>;

    beforeAll(async () => {
      // Needs to be set within a test hook, after `homepage` is initialized
      homepageLinkMap = new Map([
        [NavMenuLinkText.About, await homepage.aboutMeLink],
        [NavMenuLinkText.Blog, await homepage.blogLink],
        [NavMenuLinkText.Projects, await homepage.projectsLink],
        [NavMenuLinkText.ThingsILike, await homepage.thingsILikeLink],
        [NavMenuLinkText.Contact, await homepage.contactLink],
        [NavMenuLinkText.Crazytown, await homepage.crazytownLink],
      ]);
    });

    navMenuEnabledLinks.forEach((route, pageName) => {
      describe(`When the user clicks the "${pageName}" link`, () => {
        beforeAll(async () => {
          await homepageLinkMap.get(pageName).click();
          /* Implicit test that the route changes to the expected route. */
          await browser.waitUntil(
            async () => (await browser.getUrl()) === `${wdioBaseUrl}${route}`,
          );
        });

        it(`Displays the "${pageName}" page`, async () => {
          expect(
            await (await pageMap.get(pageName).heading).isDisplayed(),
          ).toEqual(true);
        });

        describe('When the user clicks on my name in the header', () => {
          beforeAll(async () => {
            await (await homepage.heading).click();
            await browser.waitUntil(
              async () => (await browser.getUrl()) === `${wdioBaseUrl}/`,
            );
          });

          // eslint-disable-next-line jest/expect-expect
          it('Returns to the homepage', () => {
            /* TODO: once the homepage has a unique identity (about + blog), then test that.
            Currently the only test is the `waitUntil` above that it gets back to the `/` base route */
          });
        });
      });
    });
    navMenuDisabledLinks.forEach((route, pageName) => {
      it(`Should not display the disabled "${pageName}" link`, async () => {
        expect(await homepageLinkMap.get(pageName).isDisplayed()).toEqual(
          false,
        );
      });
    });
  });
  navMenuEnabledLinks.forEach((route, pageName) => {
    describe(`When the user accesses the ${route} URL directly`, () => {
      beforeAll(async () => {
        await browser.url(`${wdioBaseUrl}${route}`);
      });

      it(`Displays the "${pageName}" page`, async () => {
        expect(
          await (await pageMap.get(pageName).heading).isDisplayed(),
        ).toEqual(true);
      });
    });
  });

  describe(`When the user accesses an individual blog URL directly`, () => {
    beforeAll(async () => {
      await browser.url(
        `${wdioBaseUrl}/blog/20500402-DUMMY-the-algorithms-that-still-matter`,
      );
      // This solves a mysterious issue with the below test occassionally failing.
      await browser.pause(1000);
    });

    it(`Displays that blog entry`, async () => {
      expect(
        await (await $('h2*=The Algorithms That Still Matter')).isDisplayed(),
      ).toEqual(true);
    });
  });

  navMenuDisabledLinks.forEach((route) => {
    describe(`When the user accesses the disabled ${route} URL directly`, () => {
      beforeAll(async () => {
        await browser.url(`${wdioBaseUrl}${route}`);
      });

      it('Displays the plain text 404 response for an unrecognized route', async () => {
        expect(await (await $('body')).getText()).toEqual(
          `Operation "GET ${route}" not recognized on this server.`,
        );
      });
    });
  });
});
