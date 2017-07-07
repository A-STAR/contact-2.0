import { by, browser, element, ElementFinder, promise } from 'protractor';

export class Preloader {
  waitToFinish(): promise.Promise<promise.Promise<boolean>> {
    return browser.wait(() => this.preloader.getAttribute('class').then(c => c === 'preloader-hidden'));
  }

  private get preloader(): ElementFinder {
    return element(by.css('app-root ~ div'));
  }
}
