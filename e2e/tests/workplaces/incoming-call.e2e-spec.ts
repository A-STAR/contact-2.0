import {
  expectToMatchScreenshot,
  navigate,
} from '../../utils/index';

describe('app/workplaces/incoming-call', () => {
  beforeEach(async () => {
    await navigate('app/workplaces/incoming-call');
  });

  it('should render', async done => {
    await expectToMatchScreenshot();
    done();
  });
});
