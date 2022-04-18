/* eslint-disable class-methods-use-this */
import Page from './page';

class ThingsILikePage extends Page {
  get heading(): Promise<WebdriverIO.Element> {
    return $('h2=Things I Like');
  }

  open(): Promise<void> {
    return super.open();
  }
}

export default new ThingsILikePage();
