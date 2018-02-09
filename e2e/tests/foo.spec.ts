// import * as Nightmare from 'nightmare';
import * as Puppeteer from 'puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

jest.setTimeout(32000);

expect.extend({ toMatchImageSnapshot });

// const nightmare = new Nightmare({ show: true });

// describe('foo', () => {
//   it('should find the nightmare github link first', (done) => {
//     nightmare
//       .goto('https://duckduckgo.com')
//       .type('#search_form_input_homepage', 'github nightmare')
//       .click('#search_button_homepage')
//       .screenshot()
//       .then(screenshot => {
//         expect(screenshot)['toMatchImageSnapshot']();
//         done();
//       });
//   });
// });

describe('foo', () => {
  it('should find the nightmare github link first', async (done) => {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://duckduckgo.com');
    await page.type('#search_form_input_homepage', 'github nightmare');
    await page.click('#search_button_homepage');
    await page.waitForNavigation();
    const screenshot = await page.screenshot();
    expect(screenshot)['toMatchImageSnapshot']();
    done();
  });
});
