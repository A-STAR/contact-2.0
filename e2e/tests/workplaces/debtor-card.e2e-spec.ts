import {
  expectToMatchScreenshot,
  navigate,
} from '../../utils/index';

describe('app/workplaces/debtor/1/debt/1', () => {
  beforeEach(async () => {
    await navigate('app/workplaces/debtor/1/debt/1');
  });

  it('should render', async done => {
    await expectToMatchScreenshot();
    done();
  });
});
