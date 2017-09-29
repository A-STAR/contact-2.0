import { by, element, ElementFinder } from 'protractor';

import { AbstractPage } from '.';

export class ConstantsPage extends AbstractPage {
  protected url = '/admin/constants';

  async isEditToolbarButtonPresent(): Promise<boolean> {
    return this.editToolbarButton.isPresent();
  }

  async isRefreshToolbarButtonPresent(): Promise<boolean> {
    return this.refreshToolbarButton.isPresent();
  }

  async isGridPresent(): Promise<boolean> {
    return this.grid.isPresent();
  }

  // async isEditToolbarButtonDisabled(): Promise<boolean> {
  //   return this.editToolbarButton.getAttribute('disabled').then(Boolean);
  // }

  // async isRefreshToolbarButtonDisabled(): Promise<boolean> {
  //   return this.refreshToolbarButton.getAttribute('disabled').then(Boolean);
  // }

  // async clickEditToolbarButton(): Promise<void> {
  //   await this.editToolbarButton.click();
  // }

  // async clickRefreshToolbarButton(): Promise<void> {
  //   await this.refreshToolbarButton.click();
  // }

  // get gridElement(): WebElementPromise {
  //   return this.grid.getWebElement();
  // }

  private get grid(): ElementFinder {
    return element(by.css('app-constants app-grid'));
  }

  private get editToolbarButton(): ElementFinder {
    return element(by.xpath('//app-constants//app-toolbar-2//button[i[contains(@class, "fa-pencil")]]'));
  }

  private get refreshToolbarButton(): ElementFinder {
    return element(by.xpath('//app-constants//app-toolbar-2//button[i[contains(@class, "fa-refresh")]]'));
  }
}
