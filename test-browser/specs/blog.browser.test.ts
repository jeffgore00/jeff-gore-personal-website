import blogPage from '../pages/blog.page';

// This global is injected before the tests begin (see wdio.conf.ts):
declare let wdioBaseUrl: string;

describe('The Blogs page', () => {
  beforeAll(() => {
    blogPage.open();
  });

  describe('When the content has loaded', () => {
    it('Should show previews for all blogs, from newest to oldest', () => {
      const blogPreviews = blogPage.getStructuredBlogPreviews();
      expect(blogPreviews.length).toEqual(8);

      expect(blogPreviews[0].type).toEqual('TECH');
      expect(blogPreviews[0].title).toEqual(
        'The Algorithms That Still Matter (4/2/2050)',
      );
      expect(blogPreviews[0].subtitle).toEqual(
        'A cheat sheet to some fundamentals that are older than me.',
      );

      expect(blogPreviews[1].type).toEqual('TECH');
      expect(blogPreviews[1].title).toEqual(
        'WebAssembly - A Blast From The Past (4/1/2050)',
      );
      expect(blogPreviews[1].subtitle).toEqual(
        'A look back at the language that was the hotness during the 2030s.',
      );

      expect(blogPreviews[2].type).toEqual('COMMENTARY');
      expect(blogPreviews[2].title).toEqual(
        'Good Design Is A Human Right (3/15/2050)',
      );
      expect(blogPreviews[2].subtitle).toEqual(
        "We shouldn't have to look at ugly things. Inside, a proposal to codify that into international law.",
      );

      expect(blogPreviews[3].type).toEqual('COMMENTARY');
      expect(blogPreviews[3].title).toEqual(
        'Remember When We Had to Remember? (3/1/2050)',
      );
      expect(blogPreviews[3].subtitle).toEqual(
        'With the latest Neuralink, we welcome the end of human memory as we know it. Is that a good thing?',
      );

      expect(blogPreviews[4].type).toEqual('TECH');
      expect(blogPreviews[4].title).toEqual(
        'Coding Your Printed-Flesh Friends With DNAScript (2/2/2050)',
      );
      expect(blogPreviews[4].subtitle).toEqual(
        'Template-farmed humans are for casuals. As always, tinkering with the source yields the best results.',
      );

      expect(blogPreviews[5].type).toEqual('COMMENTARY');
      expect(blogPreviews[5].title).toEqual('My Trip To Mars (2/1/2050)');
      expect(blogPreviews[5].subtitle).toEqual(
        "A fun extraterrestrial jaunt, but oddly, everything smells like Cap'n Crunch.",
      );

      expect(blogPreviews[6].type).toEqual('TECH');
      expect(blogPreviews[6].title).toEqual(
        'Testing Open Source Holographs (1/2/2050)',
      );
      expect(blogPreviews[6].subtitle).toEqual(
        "Yes, it's possible. Here's how to plork this daunting task.",
      );

      expect(blogPreviews[7].type).toEqual('COMMENTARY');
      expect(blogPreviews[7].title).toEqual(
        "Holy God, I'm 64 Years Old (1/1/2050)",
      );
      expect(blogPreviews[7].subtitle).toEqual(
        'A reflection on decades of making fart noises and bird calls.',
      );
    });

    it('should display "Blog" in the <title>', () => {
      expect(browser.getTitle()).toEqual('Blog | Jeff Gore');
    });
  });

  describe('When the user clicks one of the blog links', () => {
    beforeAll(() => {
      blogPage.blogPreviews[0].$('a').click();
    });

    // eslint-disable-next-line jest/expect-expect
    it('should navigate to the URL for that blog', () => {
      /* Implicit test that the route changes to the expected route. */
      browser.waitUntil(
        () =>
          browser.getUrl() ===
          `${wdioBaseUrl}/blog/20500402-DUMMY-the-algorithms-that-still-matter`,
      );
      // This solves a mysterious issue with the below test occassionally failing.
      // Perhaps we need to wait for loading lines to disappear.
      browser.pause(1000);
    });

    it('should display that blogs content', () => {
      expect($('h2*=The Algorithms That Still Matter').isDisplayed()).toEqual(
        true,
      );
      expect(
        $(
          'h3*=A cheat sheet to some fundamentals that are older than me.',
        ).isDisplayed(),
      ).toEqual(true);
      expect($('span*=April 2, 2050').isDisplayed()).toEqual(true);
      expect(
        $('p*=Here are some algos that will blow you away.').isDisplayed(),
      ).toEqual(true);
    });

    it('should display the title of the blog in the <title>', () => {
      expect(browser.getTitle()).toEqual(
        'The Algorithms That Still Matter | Jeff Gore',
      );
    });
  });
});
