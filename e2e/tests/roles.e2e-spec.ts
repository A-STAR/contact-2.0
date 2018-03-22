import {
  expectToMatchScreenshot,
  navigate,
  typeIntoDialogInput,
  clickDialogOkButton,
  clickTitleBarButton,
} from '../utils/index';

describe('admin/roles', () => {
  beforeEach(async () => {
    await navigate('admin/roles');
  });

  it('should render', async done => {
    await expectToMatchScreenshot();
    done();
  });

  it('should handle add role button click', async done => {
    await clickTitleBarButton('app-roles', 1);
    await expectToMatchScreenshot();
    done();
  });

  it('should add new role', async done => {
    await clickTitleBarButton('app-roles', 1);
    await typeIntoDialogInput('name', 'Test Role Name');
    await typeIntoDialogInput('comment', 'Test Role Comment');
    await clickDialogOkButton();
    await expectToMatchScreenshot();
    done();
  });
});