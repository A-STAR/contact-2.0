import { Injectable } from '@angular/core';

import { PersistenceService } from '../persistence/persistence.service';
import { propOr } from '../utils';


@Injectable()
export class SettingsService {

  public app: any;
  public layout: any;
  private user: any;

  constructor(private persistenceService: PersistenceService) {

    // User Settings
    this.user = {
      name: 'John',
      job: 'ng-developer',
      picture: 'assets/img/user/02.jpg'
    };

    // App Settings
    this.app = {
      name: 'CRIF',
      description: 'Contact v2.0',
      year: (new Date()).getFullYear()
    };

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
      offsidebarOpen: false,
      asideToggled: false,
      viewAnimation: 'ng-fadeInUp'
    };

    if (!$('.app-content') || !$('.topnavbar-wrapper')) {
      throw Error('Could not find the content area or the navbar div');
    }
  }

  // Calculate the available content area height
  getContentHeight(): number {
    return $('.app-content').height() - $('.topnavbar-wrapper').height();
  }

  getAppSetting(name: string): string | number {
    return name ? this.app[name] : this.app;
  }
  getUserSetting(name: string): string {
    return name ? this.user[name] : this.user;
  }
  getLayoutSetting(name: string): boolean | string {
    return name ? this.layout[name] : this.layout;
  }

  setAppSetting(name: string, value: string): void {
    if (typeof this.app[name] !== 'undefined') {
      this.app[name] = value;
    }
  }
  setUserSetting(name: string, value: string): void {
    if (typeof this.user[name] !== 'undefined') {
      this.user[name] = value;
    }
  }
  setLayoutSetting(name: string, value: any): any {
    if (typeof this.layout[name] !== 'undefined') {
      return this.layout[name] = value;
    }
  }

  toggleLayoutSetting(name: string): any {
    return this.setLayoutSetting(name, !this.getLayoutSetting(name));
  }

}
