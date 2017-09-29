import { by, browser, element, ElementFinder } from 'protractor';

export class Header {
  async logout(): Promise<void> {
    await this.accountDropdownIcon.click();
    await this.logoutLink.click();
  }

  private get accountDropdownIcon(): ElementFinder {
    const xpath = '//app-header//ul[contains(@class, "navbar-right")]//a[i[contains(@class, "icon-user")]]';
    return element(by.xpath(xpath));
  }

  private get logoutLink(): ElementFinder {
    const xpath = '//app-header//ul[contains(@class, "navbar-right")]//div[contains(@class, "dropdown-content")]//li[last()]/a';
    return element(by.xpath(xpath));
  }
}
