/* eslint-disable class-methods-use-this */
import Page from './page';

class ProjectsPage extends Page {
  get heading(): Promise<WebdriverIO.Element> {
    return $('h2=Projects');
  }

  open(): Promise<void> {
    return super.open();
  }
}

export default new ProjectsPage();
