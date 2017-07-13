// import { browser } from 'protractor';

// import { Grid } from '../components/grid';
import { Preloader } from '../components/preloader';
import { ConstantsPage } from '../pages/constants-page';

describe('/admin/constants', () => {
  const preloader = new Preloader();
  const constantsPage = new ConstantsPage();

  beforeAll(async () => {
    await constantsPage.navigate();
    await preloader.waitToFinish();
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

  // TODO(d.maltsev)
  // it('should open edit dialog on row double click', async () => {
  //   const grid = new Grid(constantsPage.gridElement);
  //   await grid.clickRowById(1);
  //   await grid.doubleClickRowById(1);
  //   await browser.sleep(5000);
  // });
});
