import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, first, map, tap } from 'rxjs/operators';

import { AuthService } from '@app/core/auth/auth.service';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class SettingsService {
  static readonly REDIRECT_TOKEN = 'auth/redirect';
  static readonly REDIRECT_DEFAULT = '/';

  // App Settings
  app = {
    name: 'CRIF',
    description: 'Contact v2.0',
    year: (new Date()).getFullYear()
  };

  layout: any;

  private settingsKey: string;
  private _settings$ = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private persistenceService: PersistenceService,
    private router: Router
  ) {
    this._settings$
      .pipe(
        filter(Boolean)
      )
      .subscribe(settings => this.persistenceService.set(this.settingsKey, settings));

    this.authService.currentUser$
      .pipe(
        filter(Boolean),
        first(),
        map(user => user.userName),
        tap(settingsKey => this.settingsKey = settingsKey)
      )
      .subscribe(settingsKey =>
        this._settings$.next(this.persistenceService.getOr(settingsKey, {}))
      );

    const layout = this.persistenceService.getOr(PersistenceService.LAYOUT_KEY, {});

    // Layout Settings
    this.layout = {
      isFixed: true,
      isCollapsed: !!layout.isCollapsed,
      isBoxed: false,
      isRTL: false,
      horizontal: false,
      isFloat: false,
      asideHover: false,
      theme: null,
      asideScrollbar: false,
      isCollapsedText: false,
      useFullLayout: false,
      hiddenFooter: false,
      menuToggled: false,
      viewAnimation: 'ng-fadeInUp'
    };

    if (!$('.app-content') || !$('.topnavbar-wrapper')) {
      throw new Error('Could not find the content area or the navbar div');
    }
  }

  get settings$(): Observable<any> {
    return this._settings$.asObservable();
  }

  get(key: string): any {
    return this._settings$.value && this._settings$.value[key];
  }

  set(key: string, value: any): void {
    this._settings$.next({ ...this._settings$.value, [key]: value });
  }

  remove(key: string): void {
    const settings = this._settings$.value;
    delete settings[key];
    this._settings$.next(settings);
  }

  redirectToLogin(url: string = null): void {
    this.set(SettingsService.REDIRECT_TOKEN, url || this.router.url);
    this.authService.redirectToLogin();
  }

  redirectAfterLogin(): void {
    const url = this.get(SettingsService.REDIRECT_TOKEN) || SettingsService.REDIRECT_DEFAULT;
    this.router
      .navigate([ url ])
      .then(() => this.remove(SettingsService.REDIRECT_TOKEN));
  }

  // Calculate the available content area height
  getContentHeight(): number {
    return $('.app-content').height() - $('.topnavbar-wrapper').height();
  }

  getAppSetting(name: string): string | number {
    return name ? this.app[name] : this.app;
  }

  getLayoutSetting(name: string): boolean | string {
    return name ? this.layout[name] : this.layout;
  }

  setAppSetting(name: string, value: string): void {
    if (Object.prototype.hasOwnProperty.call(this.app, name)) {
      this.app[name] = value;
    }
  }

  setLayoutSetting(name: string, value: any): void {
    if (Object.prototype.hasOwnProperty.call(this.layout, name)) {
      this.layout[name] = value;
      this.persistenceService.set(PersistenceService.LAYOUT_KEY, this.layout);
    }
  }

  toggleLayoutSetting(name: string): void {
    this.setLayoutSetting(name, !this.getLayoutSetting(name));
  }
}
