import { Page } from 'puppeteer';

export const click = async (selector: string) => {
  const page: Page = global['__PAGE__'];
  await page.click(selector);
};

export const clickTitleBarButton = async (selector: string, i: number) => {
  await click(`${selector} app-titlebar .titlebar-zone.right button:nth-child(${i})`);
};

export const clickDialogOkButton = async () => {
  await click('app-dialog button.btn.btn-success');
};

export const clickGridRow = async (selector: string, i: number) => {
  await click(`${selector} .ag-body .ag-body-viewport-wrapper .ag-row:nth-child(${i})`);
};
