/* eslint-disable class-methods-use-this */
import Page from './page';

class BlogPage extends Page {
  get heading(): Promise<WebdriverIO.Element> {
    return $('h2=Blog');
  }

  open(): Promise<void> {
    return super.open('/blog?useDummyPreviews=true');
  }

  get blogPreviews(): Promise<WebdriverIO.Element[]> {
    return $('[data-testid="blog-page-blog-previews"]')
      .then((ele) => ele.waitForDisplayed())
      .then(() => $$('.single-blog-preview'));
  }

  async getStructuredBlogPreviews(): Promise<
    {
      type: string;
      title: string;
      subtitle: string;
    }[]
  > {
    const previews = await this.blogPreviews;

    return Promise.all(
      previews.map(async (blogPreview) => {
        const type = await blogPreview.$('.blog-preview-type-heading');
        const heading = await blogPreview.$('.blog-preview-title-heading');
        const subtitle = await blogPreview.$('.blog-preview-subtitle');

        return {
          type: await type.getText(),
          title: await heading.getText(),
          subtitle: await subtitle.getText(),
        };
      }),
    );
  }
}

export default new BlogPage();
