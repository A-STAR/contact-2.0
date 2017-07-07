import { browser, element, by } from 'protractor';

describe('Index page', () => {
  beforeEach(() => browser.get('/'));

  it('should display login form for unauthorized users', () => {
    const loginElement = element(by.css('app-login'));
    expect(loginElement.getText()).toBeTruthy();
  });

  it('should let click on login button', async () => {
    const preloader = element(by.css('app-root ~ div'));
    const loginInput = element(by.css('app-login form > div > input[name="login"]'));
    const passwordInput = element(by.css('app-login form > div > input[name="password"]'));
    const submitButton = element(by.css('app-login form > button[type="submit"]'));

    await browser.wait(() => preloader.getAttribute('class').then(c => c === 'preloader-hidden'));

    await loginInput.clear();
    await loginInput.sendKeys('admin');

    await passwordInput.clear();
    await passwordInput.sendKeys('spring');

    await submitButton.click();

    // TODO(d.maltsev): how can we avoid using sleep?
    await browser.sleep(1000);

    expect(browser.getCurrentUrl()).toMatch('/home');
  });
});
