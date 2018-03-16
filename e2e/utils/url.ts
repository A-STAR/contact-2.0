import { Page } from 'puppeteer';

export const getUrl = async () => {
  const page: Page = global['__PAGE__'];
  return await page.evaluate(() => location.pathname);
};
