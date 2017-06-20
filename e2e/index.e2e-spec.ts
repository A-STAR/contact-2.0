import { IndexPage } from './index.page';

describe('Index Page', () => {
  let page: IndexPage;

  beforeEach(() => {
    page = new IndexPage();
    page.navigateTo();
  });

  it('should display login form for unauthorized users', () => {
    const loginElement = page.getLoginElement();
    expect(loginElement.getText()).toBeTruthy();
  });
});
