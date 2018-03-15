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
    await page.keyboard.press('Enter');
    // await page.click('app-login form button[type="submit"]');
    await page.waitForSelector('app-layout');
  }
};

export const takeScreenshot = async () => {
  const page: Page = global['__PAGE__'];
  return await page.screenshot();
};
