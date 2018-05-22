import {
  clickDialogOkButton,
  clickGridRow,
  clickTitleBarButton,
  expectToMatchScreenshot,
  navigate,
  pause,
  scrollTo,
  typeIntoDialogInput,
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
    const role = {
      name: 'Test Role Name',
      comment: 'Test Role Comment',
    };
    await clickTitleBarButton('app-roles', 1);
    await typeIntoDialogInput('name', role.name);
    await typeIntoDialogInput('comment', role.comment);
    await clickDialogOkButton();
    await pause();
    await scrollTo('app-roles', 2, role.name);
    await expectToMatchScreenshot();
    done();
  });
});
