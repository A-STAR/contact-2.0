import { Injectable } from '@angular/core';

import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class SettingsService {

  // App Settings
  app = {
    name: 'CRIF',
    description: 'Contact v2.0',
    year: (new Date()).getFullYear()
  };

  layout: any;

  private _settingsKey: string;

  constructor(
    private persistenceService: PersistenceService
  ) {
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

  set settingsKey(value: string) {
    this._settingsKey = value;
  }

  get(key: string): any {
    const settings = this.persistenceService.getOr(this._settingsKey, {});
    return settings[key];
  }

  set(key: string, value: any): void {
    const settings = this.persistenceService.getOr(this._settingsKey, {});
    this.persistenceService.set(this._settingsKey, { ...settings, [key]: value });
  }

  remove(key: string): void {
    const settings = this.persistenceService.getOr(this._settingsKey, {});
    delete settings[key];
    this.persistenceService.set(this._settingsKey, settings);
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
