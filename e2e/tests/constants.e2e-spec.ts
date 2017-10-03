import { ConstantsPage } from '../pages';

describe('/admin/constants', () => {
  const constantsPage = new ConstantsPage();

  beforeAll(async () => {
    await constantsPage.navigate();
  });

  it('should have edit toolbar button', async () => {
    expect(constantsPage.isEditToolbarButtonPresent()).toBeTruthy();
  });

  it('should have refresh toolbar button', async () => {
    expect(constantsPage.isRefreshToolbarButtonPresent()).toBeTruthy();
  });

  it('should have grid', async () => {
    expect(constantsPage.isGridPresent()).toBeTruthy();
  });
});
