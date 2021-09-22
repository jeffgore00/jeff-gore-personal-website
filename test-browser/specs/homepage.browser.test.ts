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
    homepage.open('/?useDummyPreviews=true');
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
            if (viewportScenario === viewportScenarios.NARROW) {
              /* TODO: only call setWindowSize if we know it's a non-mobile device. Resizing a 
              window isn't feasible or necessary on a mobile device. */
              originalWindowSize = browser.getWindowSize();
              browser.setWindowSize(411, 731);
            }
          });

          beforeEach(() => {
            homepageLinkMap = new Map([
              [NavMenuLinkText.About, homepage.aboutMeLink],
              [NavMenuLinkText.Blog, homepage.blogLink],
              [NavMenuLinkText.Projects, homepage.projectsLink],
              [NavMenuLinkText.ThingsILike, homepage.thingsILikeLink],
              [NavMenuLinkText.Contact, homepage.contactLink],
              [NavMenuLinkText.Crazytown, homepage.crazytownLink],
            ]);
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

            describe('When the hamburger menu icon is clicked', () => {
              beforeAll(() => {
                homepage.mobileHamburgerMenuIcon.click();
              });

              it('displays a "drawer" menu from the right side', () => {
                expect(homepage.mobileSideDrawerMenu.isDisplayed()).toBe(true);
              });
              navMenuEnabledLinks.forEach((route, pageName) => {
                it(`In that menu, it should display the "${pageName}" link`, () => {
                  expect(
                    homepage.mobileSideDrawerMenu
                      .$(`a*=${pageName}`)
                      .isDisplayed(),
                  ).toBe(true);
                });
              });

              describe('When any of the link panels are clicked', () => {
                let originalUrl: string;

                beforeAll(() => {
                  originalUrl = browser.getUrl();
                  if (homepage.mobileHamburgerMenuIcon.isClickable()) {
                    homepage.mobileHamburgerMenuIcon.click();
                    browser.pause(1000);
                  }
                  const keys = Array.from(navMenuEnabledLinks.keys());
                  const randomIndex = Math.floor(
                    Math.random() * navMenuEnabledLinks.size,
                  );
                  const randomPageName = keys[randomIndex];
                  homepage.mobileSideDrawerMenu
                    .$(`[data-testid="link-panel"]*=${randomPageName}`)
                    .click({ x: 1 });
                });

                afterAll(() => {
                  // restore the homepage for the next test
                  homepage.open('/?useDummyPreviews=true');
                });

                it('The drawer closes to the right', () => {
                  // wait one second for the drawer closing animation to complete
                  browser.pause(1000);
                  expect(homepage.mobileSideDrawerMenu.isDisplayed()).toBe(
                    false,
                  );
                });

                it('Should result in navigation to another URL', () => {
                  expect(browser.getUrl()).not.toEqual(originalUrl);
                });
              });

              describe('When the greyed out area outside of the drawer is clicked', () => {
                let originalUrl: string;

                beforeAll(() => {
                  originalUrl = browser.getUrl();

                  if (homepage.mobileHamburgerMenuIcon.isClickable()) {
                    homepage.mobileHamburgerMenuIcon.click();
                    browser.pause(1000);
                  }
                  // x = -100[px] to signify click at the left-hand side of the screen, which is where the greyed-out area is.
                  $('[role="presentation"]').click({ x: -100 });
                });

                it('The drawer closes to the right', () => {
                  // wait one second for the drawer closing animation to complete
                  browser.pause(1000);
                  expect(homepage.mobileSideDrawerMenu.isDisplayed()).toBe(
                    false,
                  );
                });

                it('The user should be on the same page', () => {
                  expect(browser.getUrl()).toEqual(originalUrl);
                });
              });
            });
          }
        });
      },
    );
  });

  describe('Body', () => {
    it('Should show a summary message about me', () => {
      expect(homepage.aboutMeBlurb.isDisplayed()).toBe(true);
    });

    describe('When the content has loaded', () => {
      it('Should show the most recent three non-draft tech blog articles under a heading', () => {
        expect(homepage.techBlogPreviewsHeading.isDisplayed()).toEqual(true);

        const techBlogPreviews = homepage.getStructuredTechBlogPreviews();
        expect(techBlogPreviews.length).toEqual(3);

        const [preview1, preview2, preview3] = techBlogPreviews;

        expect(preview1.title).toEqual(
          'The Algorithms That Still Matter (4/2/2050)',
        );
        expect(preview1.subtitle).toEqual(
          'A cheat sheet to some fundamentals that are older than me.',
        );

        expect(preview2.title).toEqual(
          'WebAssembly - A Blast From The Past (4/1/2050)',
        );
        expect(preview2.subtitle).toEqual(
          'A look back at the language that was the hotness during the 2030s.',
        );

        expect(preview3.title).toEqual(
          'Coding Your Printed-Flesh Friends With DNAScript (2/2/2050)',
        );
        expect(preview3.subtitle).toEqual(
          'Template-farmed humans are for casuals. As always, tinkering with the source yields the best results.',
        );
      });

      it('Should show the most recent three non-draft commentary blog articles under a heading', () => {
        expect(homepage.commentaryBlogPreviewsHeading.isDisplayed()).toEqual(
          true,
        );

        const commentaryBlogPreviews =
          homepage.getStructuredCommentaryBlogPreviews();
        expect(commentaryBlogPreviews.length).toEqual(3);

        const [preview1, preview2, preview3] = commentaryBlogPreviews;

        expect(preview1.title).toEqual(
          'Good Design Is A Human Right (3/15/2050)',
        );
        expect(preview1.subtitle).toEqual(
          "We shouldn't have to look at ugly things. Inside, a proposal to codify that into international law.",
        );

        expect(preview2.title).toEqual(
          'Remember When We Had to Remember? (3/1/2050)',
        );
        expect(preview2.subtitle).toEqual(
          'With the latest Neuralink, we welcome the end of human memory as we know it. Is that a good thing?',
        );

        expect(preview3.title).toEqual('My Trip To Mars (2/1/2050)');
        expect(preview3.subtitle).toEqual(
          "A fun extraterrestrial jaunt, but oddly, everything smells like Cap'n Crunch.",
        );
      });
    });
  });
});
