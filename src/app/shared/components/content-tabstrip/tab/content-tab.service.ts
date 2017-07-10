import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ITab } from './content-tab.interface';

@Injectable()
export class ContentTabService {
  private _tabs: ITab[] = [];
  private _activeIndex: number;

  constructor(private router: Router) { }

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
}
