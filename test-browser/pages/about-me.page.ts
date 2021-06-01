/* eslint-disable class-methods-use-this */
import Page from './page';

class AboutMePage extends Page {
  get heading(): WebdriverIO.Element {
    return $('h2=About Me');
  }

  open(): void {
    return super.open();
  }
}

export default new AboutMePage();
