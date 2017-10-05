import { browser } from 'protractor';

import { Header, LoginForm, Preloader } from '../components';

export abstract class AbstractPage {
  protected abstract url: string;

  private _header = new Header();
  private _loginForm = new LoginForm();
  private _preloader = new Preloader();

  get header(): Header {
    return this._header;
  }

  get loginForm(): LoginForm {
    return this._loginForm;
  }

  get preloader(): Preloader {
    return this._preloader;
  }

  /**
   * Ensures that user IS NOT logged in and navigates to login page
   *
   * @returns {Promise<void>}
   * @memberof AbstractPage
   */
  async navigateToLogin(): Promise<void> {
    const url = await this._navigate('/home');
    switch (url) {
      case '/login':
        break;
      case '/home':
        await this.header.logout();
        break;
      default:
        throw new Error(`Expected ${url} to be equal '/login' or '/home'`);
    }
  }

  /**
   * Navigates to the page and logs in if necessary
   *
   * @returns {Promise<void>}
   * @memberof AbstractPage
   */
  async navigate(): Promise<void> {
    const url = await this._navigate(this.url);
    switch (url) {
      case '/login':
        await this.loginForm.login('admin', 'spring');
        if (this.url !== await this.getCurrentUrl()) {
          throw new Error(`Expected ${url} to be equal '${this.url}'`);
        };
        break;
      case this.url:
        break;
      default:
        throw new Error(`Expected ${url} to be equal '/login' or '${this.url}'`);
    }
  }

  /**
   * Gets current URL (might be different from `this.url`)
   *
   * @returns {Promise<string>}
   * @memberof AbstractPage
   */
  async getCurrentUrl(): Promise<string> {
    const url = await browser.getCurrentUrl();
    return url.replace(/^.*?\/\/.+?\//g, '/');
  }

  private async _navigate(url: string): Promise<string> {
    await browser.get(url);
    await this.preloader.waitToFinish();
    return await this.getCurrentUrl();
  }
}
