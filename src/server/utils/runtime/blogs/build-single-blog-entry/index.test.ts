import { buildSingleBlogEntry } from '.';

describe('buildSingleBlogEntry', () => {
  it('renders to static markup a blog in the expected format', async () => {
    const output = await buildSingleBlogEntry(
      '20500402-DUMMY-the-algorithms-that-still-matter',
    );
    expect(output).toEqual({
      contentSubtype: 'TECH',
      contentType: 'BLOG',
      draft: false,
      dummy: true,
      htmlContent:
        '<h2 id="blog-title">The Algorithms That Still Matter</h2><h3 id="blog-subtitle">A cheat sheet to some fundamentals that are older than me.</h3><span id="blog-publish-date">April 2, 2050</span><div id="blog-content"><p>Here are some algos that will blow you away.</p></div>',
      publishDate: new Date('2050-04-02T00:00:00.000Z'),
      subtitle: 'A cheat sheet to some fundamentals that are older than me.',
      title: 'The Algorithms That Still Matter',
    });
  });
});
