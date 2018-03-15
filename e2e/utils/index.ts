import { Page } from 'puppeteer';

export const getPath = async () => {
  const page: Page = global['__PAGE__'];
  return await page.evaluate('location.pathname');
};

export const navigate = async (path: string) => {
  const baseUrl: string = global['__URL__'];
  const page: Page = global['__PAGE__'];
  await page.goto(baseUrl + '/' + path);
  if (await getPath() === '/login') {
    await page.type('app-login form app-text input', 'admin');
    await page.type('app-login form app-password-input input', 'spring');
    await page.click('app-login form button[type="submit"]');
  }
  await page.waitForSelector('app-header');
  await page.waitForFunction(() => document.querySelectorAll('app-spinner').length === 0);
};

export const expectToMatchUrl = async (url: string) => {
  return expect(await getPath() === '/' + url);
};

export const expectToMatchScreenshot = async (threshold = 0.1) => {
  const page: Page = global['__PAGE__'];
  const screenshot = await page.screenshot();
  expect(screenshot)['toMatchImageSnapshot']({
    failureThreshold: `${threshold}`,
    failureThresholdType: 'percent'
  });
};
