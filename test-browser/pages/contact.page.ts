/* eslint-disable class-methods-use-this */
import Page from './page';

class ContactPage extends Page {
  get heading(): Promise<WebdriverIO.Element> {
    return $('h2=Contact Me');
  }

  open(): Promise<void> {
    return super.open();
  }
}

export default new ContactPage();
