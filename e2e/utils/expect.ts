import { Page } from 'puppeteer';

import { getUrl } from './url';
import { pause } from './pause';

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
