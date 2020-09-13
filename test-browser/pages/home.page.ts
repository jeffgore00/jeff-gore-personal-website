/* eslint-disable class-methods-use-this */
import Page from './page';

class Homepage extends Page {
  get heading(): WebdriverIO.Element {
    return $('h1*=Homepage');
  }

  open(): void {
    return super.open();
  }
}

export default new Homepage();
