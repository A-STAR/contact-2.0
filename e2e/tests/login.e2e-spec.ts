import { toMatchImageSnapshot } from 'jest-image-snapshot';

jest.setTimeout(32000);

expect.extend({ toMatchImageSnapshot });

describe('Login Page', () => {
  it('should render', async (done) => {
    const baseUrl = global['__URL__'];
    const page = global['__PAGE__'];
    await page.goto(baseUrl);
    const screenshot = await page.screenshot();
    expect(screenshot)['toMatchImageSnapshot']();
    done();
  });
});
