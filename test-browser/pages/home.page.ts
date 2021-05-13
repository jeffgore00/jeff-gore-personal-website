/* eslint-disable class-methods-use-this */
import Page from './page';

class Homepage extends Page {
  get heading(): WebdriverIO.Element {
    return $('h1');
  }

  get aboutMeLink(): WebdriverIO.Element {
    return $('a*=About');
  }

  get projectsLink(): WebdriverIO.Element {
    return $('a*=Projects');
  }

  get thingsILikeLink(): WebdriverIO.Element {
    return $('a*=Things I Like');
  }

  get mobileHamburgerMenuIcon(): WebdriverIO.Element {
    return $('[data-testid="mobile-nav-menu"]');
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

  open(): void {
    return super.open();
  }
}

export default new Homepage();
