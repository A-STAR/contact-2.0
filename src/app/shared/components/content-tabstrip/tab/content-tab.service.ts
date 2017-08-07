import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';

import { ITab, ITabEvent, TabEventStageEnum } from './content-tab.interface';

import { ActionsLogService } from '../../../../core/actions-log/actions-log.service';
import { GuiObjectsService } from '../../../../core/gui-objects/gui-objects.service';

import { menuConfig } from '../../../../routes/menu-config';

@Injectable()
export class ContentTabService {
  private _tabs: ITab[] = [];
  private _activeIndex: number;
  private lastTabEvent: ITabEvent = null;

  constructor(
    private actionsLogService: ActionsLogService,
    private guiObjectsService: GuiObjectsService,
    private location: Location,
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
    const found = this._tabs.findIndex(el => el.component.COMPONENT_NAME === tab.component.COMPONENT_NAME);
    if (found === -1) {
      this.tabs = this.tabs.concat(tab);
      this.setActiveIndex(this.tabs.length - 1);
    } else {
      this.setActiveIndex(found);
    }
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
    this.router
      .navigateByUrl(this.tabs[active].path)
      .then(result => result);
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
    const i = this._activeIndex;
    this.router.navigate([url])
      .then(() => this.removeTab(i));
  }

  back(): void {
    const i = this._activeIndex;
    this.location.back();
    this.removeTab(i);
  }

  private onSectionLoadStart(): void {
    this.lastTabEvent = {
      timestamp: Date.now(),
      stage: TabEventStageEnum.NAVIGATION_START
    }
  }

  private onSectionLoadEnd(event: NavigationEnd): void {
    const delay = Date.now() - this.lastTabEvent.timestamp;
    const name = Object.keys(menuConfig).find(key => menuConfig[key].link === event.url);
    if (name) {
      this.logAction(name, delay);
    }
  }

  private logAction(name: string, delay: number): void {
    this.guiObjectsService.menuItemIds
      .take(1)
      .subscribe(menuItemIds => {
        if (menuItemIds[name] > 0) {
          this.actionsLogService.log(name, delay, menuItemIds[name]);
        }
      });
  }
}
