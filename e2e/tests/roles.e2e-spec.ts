import { expectToMatchScreenshot, navigate } from '../utils/index';

describe('Dashboard', () => {
  it('should render', async done => {
    await navigate('admin/roles');
    await expectToMatchScreenshot();
    done();
  });
});
