/* eslint-disable class-methods-use-this */
import Page from './page';

class BlogPage extends Page {
  get blogHeading(): WebdriverIO.Element {
    return $('h2=Blog');
  }

  open(): void {
    return super.open();
  }
}

export default new BlogPage();
