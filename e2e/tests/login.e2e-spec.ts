import { browser } from 'protractor';

import { Preloader } from '../components/preloader';
import { LoginPage } from '../pages/login-page';

describe('Login page', () => {
  const preloader = new Preloader();
  const loginPage = new LoginPage();

  beforeAll(async () => {
    await loginPage.navigate();
    await preloader.waitToFinish();
  });

  it('should have login input', async () => {
    expect(loginPage.isLoginInputPresent()).toBeTruthy();
  });

  it('should have password input', async () => {
    expect(loginPage.isPasswordInputPresent()).toBeTruthy();
  });

  it('should have submit button', async () => {
    expect(loginPage.isSubmitButtonPresent()).toBeTruthy();
  });

  it('should handle click on submit button', async () => {
    await loginPage.enterLogin('admin');
    await loginPage.enterPassword('spring');
    await loginPage.clickSubmit();
    expect(browser.getCurrentUrl()).toMatch(LoginPage.URL_AFTER_REDIRECT);
  });

  // TODO(d.maltsev): test login errors
});
