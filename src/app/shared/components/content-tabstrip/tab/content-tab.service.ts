import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { ITab, ITabEvent, TabEventStageEnum } from './content-tab.interface';

import { ActionsLogService } from '../../../../core/actions-log/actions-log.service';
import { GuiObjectsService } from '../../../../core/gui-objects/gui-objects.service';
import { PersistenceService } from '../../../../core/persistence/persistence.service';

import { menuConfig } from '../../../../routes/menu-config';

@Injectable()
export class ContentTabService {
  static STORAGE_KEY = 'state/contentTabs';

  private _tabs: ITab[] = [];
  private _activeIndex: number;
  private lastTabEvent: ITabEvent = null;

  constructor(
    private actionsLogService: ActionsLogService,
    private guiObjectsService: GuiObjectsService,
    private location: Location,
    private persistence: PersistenceService,
    private router: Router,
  ) {
    this.onSectionLoadStart();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.onSectionLoadStart();
      } else if (event instanceof NavigationEnd) {
        this.onSectionLoadEnd(event);
      }
    });
  }

  get tabs(): ITab[] {
    return this._tabs;
  }

  set tabs(tabs: ITab[]) {
    this._tabs = tabs;
  }

  addTab(tab: ITab): void {
    const found = this.tabs.findIndex(el => el.component.COMPONENT_NAME === tab.component.COMPONENT_NAME);
    if (found === -1) {
      this.tabs = this.tabs.concat(tab);
      this.setActiveIndex(this.tabs.length - 1);
      this.lastTabEvent.stage = TabEventStageEnum.TAB_OPEN;
    } else {
      this.setActiveIndex(found);
    }
  }

  getCurrentTab(): ITab {
    return this.tabs[this.getActiveIndex()];
  }

  removeTabNoNav(current: number): void {
    this.tabs = this.tabs.filter((tab, index) => index !== current);
    // this.setActiveIndex(this.tabs.length - 1);
  }

  removeTab(i: number): void {
    let active = this.getActiveIndex();
    const last = this.tabs.length - 1;

    if (!active) {
      // if it's the first tab, stay there
    } else if (active === last) {
      // last tab active, move left
      active = last - 1;
    }

    this.tabs = this.tabs.filter((tab, index) => index !== i);
    this.setActiveIndex(active);
    this.router.navigateByUrl(this.tabs[active].path);
  }

  setActiveIndex(i: number): void {
    this._activeIndex = i;
    this.tabs = this.tabs.map((tab, index) => {
      tab.active = index === i;
      return tab;
    });
  }

  getActiveIndex(): number {
    return this._activeIndex;
  }

  navigate(url: string): void {
    const i = this.getActiveIndex();
    this.router.navigate([url])
      .then(() => this.removeTab(i));
  }

  back(): void {
    const i = this._activeIndex;
    this.location.back();
    this.tabs = this.tabs.filter((tab, index) => index !== i);
  }

  gotoParent(router: Router, cutNSections: number): void {
    const current = this.getActiveIndex();
    const { path } = this.getCurrentTab();
    const re = new RegExp('(\/[^\/]*){' + cutNSections + '}$', 'g');
    router.navigate([ path.replace(re, '') ])
      .then(() => {
        if (path === this.getCurrentTab().path) {
            this.removeTab(current);
        } else {
          this.removeTabNoNav(current);
        }
      });
  }

  findTabIndexByPath(path: string | RegExp): number {
    return this._tabs.findIndex(tab => tab.path.match(path) !== null);
  }

  removeTabByPath(path: string | RegExp): void {
    const tabIndex = this.findTabIndexByPath(path);
    if (tabIndex !== null) {
      this.removeTab(tabIndex);
    }
  }

  saveState(): void {
    const currentTab = this.getCurrentTab();
    this.persistence.set(ContentTabService.STORAGE_KEY, currentTab.path);
  }

  private onSectionLoadStart(): void {
    this.lastTabEvent = {
      timestamp: Date.now(),
      stage: TabEventStageEnum.NAVIGATION_START
    };
  }

  private onSectionLoadEnd(event: NavigationEnd): void {
    if (this.lastTabEvent.stage === TabEventStageEnum.TAB_OPEN) {
      const delay = Date.now() - this.lastTabEvent.timestamp;
      const name = Object.keys(menuConfig).find(key => menuConfig[key].link === event.url);
      if (name) {
        this.logAction(name, delay);
      }
    }
  }

  private logAction(name: string, delay: number): void {
    this.guiObjectsService.menuItemIds
      .pipe(first())
      .subscribe(menuItemIds => {
        if (menuItemIds[name] > 0) {
          this.actionsLogService.log(name, delay, menuItemIds[name]);
        }
      });
  }
}
