import { expectToMatchUrl, navigate } from '../utils/index';

describe('Dashboard', () => {
  // Note:
  // Not taking screenshot because dashboard data is updated frequently
  it('should exist', async done => {
    await navigate('');
    await expectToMatchUrl('home');
    done();
  });
});
