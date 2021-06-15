/* eslint-disable class-methods-use-this */
import Page from './page';

class Homepage extends Page {
  get heading(): WebdriverIO.Element {
    return $('h1');
  }

  get aboutMeLink(): WebdriverIO.Element {
    return $('a*=About');
  }

  get blogLink(): WebdriverIO.Element {
    return $('a*=Blog');
  }

  get projectsLink(): WebdriverIO.Element {
    return $('a*=Projects');
  }

  get thingsILikeLink(): WebdriverIO.Element {
    return $('a*=Things I Like');
  }

  get contactLink(): WebdriverIO.Element {
    return $('a*=Contact');
  }

  get crazytownLink(): WebdriverIO.Element {
    return $('a*=Crazytown');
  }

  get mobileHamburgerMenuIcon(): WebdriverIO.Element {
    return $('button*=≡');
  }

  get mobileSideDrawerMenu(): WebdriverIO.Element {
    return $('.jg-drawer-open');
  }

  get mobileSideDrawerMenuLinks(): WebdriverIO.Element[] {
    return $$('.jg-drawer-open a');
  }

  get aboutMeBlurb(): WebdriverIO.Element {
    return $('[data-testid="homepage-about-me-blurb"]');
  }

  get loadingContentLines(): WebdriverIO.Element {
    return $('[data-testid="loading-content-lines"]');
  }

  get techBlogPreviewsSection(): WebdriverIO.Element {
    return $('[data-testid="homepage-tech-blog-previews"]');
  }

  get commentaryBlogPreviewsSection(): WebdriverIO.Element {
    return $('[data-testid="homepage-commentary-blog-previews"]');
  }

  get techBlogPreviewsHeading(): WebdriverIO.Element {
    return $('[data-testid="homepage-tech-blog-previews-heading"]');
  }

  get commentaryBlogPreviewsHeading(): WebdriverIO.Element {
    return $('[data-testid="homepage-commentary-blog-previews-heading"]');
  }

  get techBlogPreviews(): WebdriverIO.Element[] {
    this.techBlogPreviewsSection.waitForDisplayed();
    return this.techBlogPreviewsSection.$$('.single-blog-preview');
  }

  get commentaryBlogPreviews(): WebdriverIO.Element[] {
    this.commentaryBlogPreviewsSection.waitForDisplayed();
    return this.commentaryBlogPreviewsSection.$$('.single-blog-preview');
  }

  getStructuredTechBlogPreviews(): {
    title: string;
    subtitle: string;
  }[] {
    const { techBlogPreviews } = this;
    return techBlogPreviews.map((techBlogPreview) => ({
      title: techBlogPreview.$('.blog-preview-title-heading').getText(),
      subtitle: techBlogPreview.$('.blog-preview-subtitle').getText(),
    }));
  }

  getStructuredCommentaryBlogPreviews(): {
    title: string;
    subtitle: string;
  }[] {
    const { commentaryBlogPreviews } = this;
    return commentaryBlogPreviews.map((commentaryBlogPreview) => ({
      title: commentaryBlogPreview.$('.blog-preview-title-heading').getText(),
      subtitle: commentaryBlogPreview.$('.blog-preview-subtitle').getText(),
    }));
  }

  get blogPreviews(): WebdriverIO.Element[] {
    return $$('.single-blog-preview');
  }

  get githubFooterIcon(): WebdriverIO.Element {
    return $('[data-testid="footer-github"]');
  }

  get linkedinFooterIcon(): WebdriverIO.Element {
    return $('[data-testid="footer-linkedin"]');
  }

  get twitterFooterIcon(): WebdriverIO.Element {
    return $('[data-testid="footer-twitter"]');
  }

  get instagramFooterIcon(): WebdriverIO.Element {
    return $('[data-testid="footer-instagram"]');
  }

  open(path?: string): void {
    return super.open(path);
  }
}

export default new Homepage();
