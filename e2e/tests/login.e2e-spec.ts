import { toMatchImageSnapshot } from 'jest-image-snapshot';

jest.setTimeout(32000);

expect.extend({ toMatchImageSnapshot });

describe('Login Page', () => {
  it('should render', async (done) => {
    const page = await global['__BROWSER__'].newPage();
    await page.goto('http://appservertest.luxbase.int:4100');
    const screenshot = await page.screenshot();
    await page.close();
    expect(screenshot)['toMatchImageSnapshot']();
    done();
  });
});
