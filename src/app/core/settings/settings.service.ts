import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { filter, map, first } from 'rxjs/operators';

import { AuthService } from '@app/core/auth/auth.service';
import { PersistenceService } from '../persistence/persistence.service';

import { propOr } from '../utils';

@Injectable()
export class SettingsService {

  // App Settings
  app = {
    name: 'CRIF',
    description: 'Contact v2.0',
    year: (new Date()).getFullYear()
  };

  layout: any;

  constructor(
    private authService: AuthService,
    private persistenceService: PersistenceService
  ) {
    const layout = this.persistenceService.getOr(PersistenceService.LAYOUT_KEY, {});
    const isCollapsed = propOr('isCollapsed', false)(layout);

    // Layout Settings
    this.layout = {
      isFixed: true,
      isCollapsed: isCollapsed,
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

  get settingsKey$(): Observable<string> {
    return this.authService.currentUser$
      .pipe(
        map(user => user && String(user.userId)),
        filter(Boolean)
      );
  }

  get(key: string): Observable<any> {
    return this.settingsKey$
      .pipe(
        map(settingsKey => this.persistenceService.getOr(settingsKey, {})),
        map(storage => storage && storage[key])
      );
  }

  set(key: string, value: any): void {
    this.settingsKey$
      .pipe(first())
      .subscribe(settingsKey =>
        this.persistenceService.set(settingsKey, {
          ...this.persistenceService.getOr(settingsKey, {}),
          [key]: value
        })
      );
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
