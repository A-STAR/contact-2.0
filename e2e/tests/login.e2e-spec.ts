import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { navigate, takeScreenshot } from '../utils/index';

jest.setTimeout(32000);

expect.extend({ toMatchImageSnapshot });

describe('Login Page', () => {
  it('should render', async (done) => {
    await navigate('');
    const screenshot = await takeScreenshot();
    expect(screenshot)['toMatchImageSnapshot']({
      failureThreshold: '0.1',
      failureThresholdType: 'percent'
    });
    done();
  });
});
