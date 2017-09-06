import { by, browser, WebElementPromise } from 'protractor';

export class Grid {
  constructor(private grid: WebElementPromise) {}

  async clickRowById(id: number): Promise<void> {
    const row = this.getRow(id);
    browser.actions().click(row);
  }

  async doubleClickRowById(id: number): Promise<void> {
    const row = this.getRow(id);
    browser.actions().doubleClick(row);
  }

  private getRow(id: number): WebElementPromise {
    // We are assuming that the first row cell corresponds to id
    // tslint:disable-next-line
    const xpath = `//datatable-body-row[./div[contains(@class, "datatable-row-center")]/datatable-body-cell[1]/div/span[@title="${id}"]]`;
    return this.grid.findElement(by.xpath(xpath));
  }
}
