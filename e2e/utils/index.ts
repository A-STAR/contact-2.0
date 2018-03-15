import { Page } from 'puppeteer';

const pause = async () => new Promise(resolve => setTimeout(resolve, 1000));

const getPath = async () => {
  const page: Page = global['__PAGE__'];
  return await page.evaluate('location.pathname');
};

export const click = async (selector: string) => {
  const page: Page = global['__PAGE__'];
  await page.click(selector);
};

export const clickTitleBarButton = async (selector: string, i: number) => {
  await click(`${selector} app-titlebar .titlebar-zone.right button:nth-child(${i})`);
};

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

export const clickDialogOkButton = async () => {
  await click('app-dialog button.btn.btn-success');
};

export const navigate = async (path: string) => {
  const baseUrl: string = global['__URL__'];
  const page: Page = global['__PAGE__'];
  await page.goto(baseUrl + '/' + path);
  if (await getPath() === '/login') {
    await type('app-login form app-text input', 'admin');
    await type('app-login form app-password-input input', 'spring');
    await click('app-login form button[type="submit"]');
  }
  await page.waitForSelector('app-header');
  await page.waitForFunction(() => document.querySelectorAll('app-spinner').length === 0);
};

export const expectToMatchUrl = async (url: string) => {
  await pause();
  return expect(await getPath() === '/' + url);
};

export const expectToMatchScreenshot = async (threshold = 0.1) => {
  await pause();
  const page: Page = global['__PAGE__'];
  const screenshot = await page.screenshot();
  expect(screenshot)['toMatchImageSnapshot']({
    failureThreshold: `${threshold}`,
    failureThresholdType: 'percent'
  });
};
