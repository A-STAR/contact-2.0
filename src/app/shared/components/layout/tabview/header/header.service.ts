import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { ITab } from '@app/shared/components/layout/tabview/header/header.interface';
import { CanActivateChild } from '@angular/router';

@Injectable()
export class TabHeaderService {

  constructor() { }

  set tabs(tabs: ITab[]) {
    this._tabs = tabs;
  }

  get tabs():  ITab[] {
    return this._tabs;
  }

  readonly tabPerms$: Observable<boolean[]> = combineLatest(this.tabs.map(t => t.hasPermission));

  private _tabs: ITab[] = [];
}

@Injectable()
export class CanActivateTabGuard implements CanActivateChild {
  constructor(private headerService: TabHeaderService) {}
  canActivateChild(): Observable<boolean> {
    return this.headerService.tabPerms$
      .map(perms => {
        return perms.some(Boolean);
      });
  }
}
