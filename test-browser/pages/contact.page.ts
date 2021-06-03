/* eslint-disable class-methods-use-this */
import Page from './page';

class ContactPage extends Page {
  get heading(): WebdriverIO.Element {
    return $('h2=Contact Me');
  }

  open(): void {
    return super.open();
  }
}

export default new ContactPage();
