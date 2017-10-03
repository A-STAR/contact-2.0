import { by, element, ElementFinder } from 'protractor';

export class LoginForm {
  async isLoginInputPresent(): Promise<boolean> {
    return this.loginInput.isPresent();
  }

  async isPasswordInputPresent(): Promise<boolean> {
    return this.passwordInput.isPresent();
  }

  async isSubmitButtonPresent(): Promise<boolean> {
    return this.submitButton.isPresent();
  }

  async login(username: string, password: string): Promise<void> {
    await this.loginInput.clear();
    await this.loginInput.sendKeys(username);
    await this.passwordInput.clear();
    await this.passwordInput.sendKeys(password);
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
