import { browser, by, element, ElementFinder } from 'protractor';

export class LoginPage {
  static URL = '/';
  static URL_AFTER_REDIRECT = '/home';

  async navigate(): Promise<void> {
    return browser.get(LoginPage.URL);
  }

  async isLoginInputPresent(): Promise<boolean> {
    return this.loginInput.isPresent();
  }

  async isPasswordInputPresent(): Promise<boolean> {
    return this.passwordInput.isPresent();
  }

  async isSubmitButtonPresent(): Promise<boolean> {
    return this.submitButton.isPresent();
  }

  async enterLogin(value: string): Promise<void> {
    await this.loginInput.clear();
    await this.loginInput.sendKeys(value);
  }

  async enterPassword(value: string): Promise<void> {
    await this.passwordInput.clear();
    await this.passwordInput.sendKeys(value);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  private get loginInput(): ElementFinder {
    return element(by.css('app-login form > div > input[name="login"]'));
  }

  private get passwordInput(): ElementFinder {
    return element(by.css('app-login form > div > input[name="password"]'));
  }

  private get submitButton(): ElementFinder {
    return element(by.css('app-login form > button[type="submit"]'));
  }
}
