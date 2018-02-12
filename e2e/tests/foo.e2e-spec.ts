import { toMatchImageSnapshot } from 'jest-image-snapshot';

jest.setTimeout(32000);

expect.extend({ toMatchImageSnapshot });

describe('foo', () => {
  it('should find the nightmare github link first', async (done) => {
    const page = await global['__BROWSER__'].newPage();
    await page.goto('https://duckduckgo.com');
    await page.type('#search_form_input_homepage', 'github nightmare');
    await page.click('#search_button_homepage');
    await page.waitForNavigation();
    const screenshot = await page.screenshot();
    await page.close();
    expect(screenshot)['toMatchImageSnapshot']();
    done();
  });
});
