import {
  expectToMatchScreenshot,
  navigate,
  typeIntoDialogInput,
  clickDialogOkButton,
  clickTitleBarButton,
  clickGridRow,
} from '../utils/index';

describe('app/admin/roles', () => {
  beforeEach(async () => {
    await navigate('app/admin/roles');
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

  it('should handle copy role button click', async done => {
    await clickGridRow('app-roles', 1);
    await clickTitleBarButton('app-roles', 2);
    await expectToMatchScreenshot();
    done();
  });

  it('should handle edit role button click', async done => {
    await clickGridRow('app-roles', 1);
    await clickTitleBarButton('app-roles', 3);
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
