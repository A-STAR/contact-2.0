import { ACliContact2Page } from './app.po';

describe('acli-contact2 App', () => {
  let page: ACliContact2Page;

  beforeEach(() => {
    page = new ACliContact2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
