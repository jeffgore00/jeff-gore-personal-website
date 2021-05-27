/* eslint-disable class-methods-use-this */
import Page from './page';

class ProjectsPage extends Page {
  get projectsHeading(): WebdriverIO.Element {
    return $('h2=Projects');
  }

  open(): void {
    return super.open();
  }
}

export default new ProjectsPage();
