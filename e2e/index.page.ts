import { browser, element, by, ElementFinder } from 'protractor';

export class IndexPage {
  navigateTo(): any {
    return browser.get('/');
  }

  getLoginElement(): ElementFinder {
    return element(by.css('app-login'));
  }
}
