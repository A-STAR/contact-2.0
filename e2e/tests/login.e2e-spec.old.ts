import { LoginPage } from '../pages';

describe('/login', () => {
  const loginPage = new LoginPage();

  beforeAll(async () => {
    await loginPage.navigateToLogin();
  });

  it('should have login input', async () => {
    expect(loginPage.loginForm.isLoginInputPresent()).toBeTruthy();
  });

  it('should have password input', async () => {
    expect(loginPage.loginForm.isPasswordInputPresent()).toBeTruthy();
  });

  it('should have submit button', async () => {
    expect(loginPage.loginForm.isSubmitButtonPresent()).toBeTruthy();
  });

  // TODO(d.maltsev): test login errors

  it('should handle click on submit button', async () => {
    await loginPage.loginForm.login('admin', 'spring');
    const url = await loginPage.getCurrentUrl();
    expect(url).toEqual('/home');
  });
});
