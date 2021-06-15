/* eslint-disable class-methods-use-this */
import Page from './page';

class BlogPage extends Page {
  get heading(): WebdriverIO.Element {
    return $('h2=Blog');
  }

  open(): void {
    return super.open('/blog?useDummyPreviews=true');
  }

  get blogPreviews(): WebdriverIO.Element[] {
    $('[data-testid="blog-page-blog-previews"]').waitForDisplayed();
    return $$('.single-blog-preview');
  }

  getStructuredBlogPreviews(): {
    type: string;
    title: string;
    subtitle: string;
  }[] {
    const { blogPreviews } = this;
    return blogPreviews.map((commentaryBlogPreview) => ({
      type: commentaryBlogPreview.$('.blog-preview-type-heading').getText(),
      title: commentaryBlogPreview.$('.blog-preview-title-heading').getText(),
      subtitle: commentaryBlogPreview.$('.blog-preview-subtitle').getText(),
    }));
  }
}

export default new BlogPage();
