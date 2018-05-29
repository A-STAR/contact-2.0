import { expectToMatchUrl, navigate } from '../../utils/index';

describe('home', () => {
  beforeEach(async () => {
    await navigate('');
  });

  // Note:
  // Not taking screenshot because dashboard data is updated frequently
  it('should exist', async done => {
    await expectToMatchUrl('app/home');
    done();
  });
});
