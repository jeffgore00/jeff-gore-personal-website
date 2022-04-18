/* eslint-disable class-methods-use-this */
import Page from './page';

class Homepage extends Page {
  get heading(): Promise<WebdriverIO.Element> {
    return $('h1');
  }

  get aboutMeLink(): Promise<WebdriverIO.Element> {
    return $('a*=About');
  }

  get blogLink(): Promise<WebdriverIO.Element> {
    return $('a*=Blog');
  }

  get projectsLink(): Promise<WebdriverIO.Element> {
    return $('a*=Projects');
  }

  get thingsILikeLink(): Promise<WebdriverIO.Element> {
    return $('a*=Things I Like');
  }

  get contactLink(): Promise<WebdriverIO.Element> {
    return $('a*=Contact');
  }

  get crazytownLink(): Promise<WebdriverIO.Element> {
    return $('a*=Crazytown');
  }

  get mobileHamburgerMenuIcon(): Promise<WebdriverIO.Element> {
    return $('button*=≡');
  }

  get mobileSideDrawerMenu(): Promise<WebdriverIO.Element> {
    return $('.jg-drawer-open');
  }

  get mobileSideDrawerMenuLinks(): Promise<WebdriverIO.Element[]> {
    return $$('.jg-drawer-open a');
  }

  get aboutMeBlurb(): Promise<WebdriverIO.Element> {
    return $('[data-testid="homepage-about-me-blurb"]');
  }

  get loadingContentLines(): Promise<WebdriverIO.Element> {
    return $('[data-testid="loading-content-lines"]');
  }

  get techBlogPreviewsSection(): Promise<WebdriverIO.Element> {
    return $('[data-testid="homepage-tech-blog-previews"]');
  }

  get commentaryBlogPreviewsSection(): Promise<WebdriverIO.Element> {
    return $('[data-testid="homepage-commentary-blog-previews"]');
  }

  get techBlogPreviewsHeading(): Promise<WebdriverIO.Element> {
    return $('[data-testid="homepage-tech-blog-previews-heading"]');
  }

  get commentaryBlogPreviewsHeading(): Promise<WebdriverIO.Element> {
    return $('[data-testid="homepage-commentary-blog-previews-heading"]');
  }

  get techBlogPreviews(): Promise<WebdriverIO.Element[]> {
    return this.techBlogPreviewsSection
      .then((ele) => ele.waitForDisplayed())
      .then(async () =>
        (await this.techBlogPreviewsSection).$$('.single-blog-preview'),
      );
  }

  get commentaryBlogPreviews(): Promise<WebdriverIO.Element[]> {
    return this.commentaryBlogPreviewsSection
      .then((ele) => ele.waitForDisplayed())
      .then(async () =>
        (await this.commentaryBlogPreviewsSection).$$('.single-blog-preview'),
      );
  }

  async getStructuredTechBlogPreviews(): Promise<
    {
      title: string;
      subtitle: string;
    }[]
  > {
    const previews = await this.techBlogPreviews;

    return Promise.all(
      previews.map(async (techBlogPreview) => {
        const heading = await techBlogPreview.$('.blog-preview-title-heading');
        const subtitle = await techBlogPreview.$('.blog-preview-subtitle');

        return {
          title: await heading.getText(),
          subtitle: await subtitle.getText(),
        };
      }),
    );
  }

  async getStructuredCommentaryBlogPreviews(): Promise<
    {
      title: string;
      subtitle: string;
    }[]
  > {
    const previews = await this.commentaryBlogPreviews;

    return Promise.all(
      previews.map(async (commentaryBlogPreview) => {
        const heading = await commentaryBlogPreview.$(
          '.blog-preview-title-heading',
        );
        const subtitle = await commentaryBlogPreview.$(
          '.blog-preview-subtitle',
        );

        return {
          title: await heading.getText(),
          subtitle: await subtitle.getText(),
        };
      }),
    );
  }

  get blogPreviews(): Promise<WebdriverIO.Element[]> {
    return $$('.single-blog-preview');
  }

  get githubFooterIcon(): Promise<WebdriverIO.Element> {
    return $('[data-testid="footer-github"]');
  }

  get linkedinFooterIcon(): Promise<WebdriverIO.Element> {
    return $('[data-testid="footer-linkedin"]');
  }

  get twitterFooterIcon(): Promise<WebdriverIO.Element> {
    return $('[data-testid="footer-twitter"]');
  }

  get instagramFooterIcon(): Promise<WebdriverIO.Element> {
    return $('[data-testid="footer-instagram"]');
  }

  async open(path?: string): Promise<void> {
    return super.open(path);
  }
}

export default new Homepage();
