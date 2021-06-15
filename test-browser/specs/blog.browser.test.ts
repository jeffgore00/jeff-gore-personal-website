import blogPage from '../pages/blog.page';

describe('The Blogs page', () => {
  beforeAll(() => {
    blogPage.open();
  });

  describe('Body', () => {
    describe('When the content has loaded', () => {
      it('Should show all of the blogs published previews', () => {
        const blogPreviews = blogPage.getStructuredBlogPreviews();
        expect(blogPreviews.length).toEqual(8);

        expect(blogPreviews[0].type).toEqual('TECH');
        expect(blogPreviews[0].title).toEqual(
          'The Algorithms That Still Matter (4/2/2050)',
        );
        expect(blogPreviews[0].subtitle).toEqual(
          'A cheat sheet to some fundamentals that are older than me.',
        );

        expect(blogPreviews[1].type).toEqual('COMMENTARY');
        expect(blogPreviews[1].title).toEqual(
          'Good Design Is A Human Right (4/1/2050)',
        );
        expect(blogPreviews[1].subtitle).toEqual(
          "We shouldn't have to look at ugly things. Inside, a proposal to codify that into international law.",
        );

        expect(blogPreviews[2].type).toEqual('TECH');
        expect(blogPreviews[2].title).toEqual(
          'WebAssembly - A Blast From The Past (3/2/2050)',
        );
        expect(blogPreviews[2].subtitle).toEqual(
          'A look back at the language that was the hotness during the 2030s.',
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
    });
  });
});
