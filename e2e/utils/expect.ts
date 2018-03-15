import { Page } from 'puppeteer';

import { getUrl } from './url';

const pause = async () => new Promise(resolve => setTimeout(resolve, 1000));

export const expectToMatchUrl = async (url: string) => {
  await pause();
  return expect(await getUrl() === '/' + url);
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
