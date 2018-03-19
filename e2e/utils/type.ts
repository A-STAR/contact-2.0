import { Page } from 'puppeteer';

export const type = async (selector: string, text: string) => {
  const page: Page = global['__PAGE__'];
  await page.type(selector, text);
};

export const typeIntoDialogInput = async (name: string, text: string) => {
  const page: Page = global['__PAGE__'];
  const selector = ['input', 'textarea']
    .map(s => `app-dialog app-dynamic-form [ng-reflect-name="${name}"] ${s}`)
    .join(', ');
  await page.type(selector, text);
};
