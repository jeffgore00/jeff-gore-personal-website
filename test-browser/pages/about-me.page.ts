/* eslint-disable class-methods-use-this */
import Page from './page';

class AboutMePage extends Page {
  get heading(): Promise<WebdriverIO.Element> {
    return $('h2=About Me');
  }

  open(): Promise<void> {
    return super.open();
  }
}

export default new AboutMePage();
