import { Injectable } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
// import { Headers } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { IGuiObjectsState, IMenuItem, IMenuApiResponseItem } from './menu.interface';

import { DataService } from '../data/data.service';

import { menuConfig } from '../../routes/menu-config';

@Injectable()
export class MenuService {
  static GUI_OBJECTS_FETCH         = 'GUI_OBJECTS_FETCH';
  static GUI_OBJECTS_FETCH_SUCCESS = 'GUI_OBJECTS_FETCH_SUCCESS';
  static GUI_OBJECTS_FETCH_FAILURE = 'GUI_OBJECTS_FETCH_FAILURE';

  private lastNavigationStartTimestamp: number = null;

  constructor(
    private dataService: DataService,
    private router: Router,
    private store: Store<IAppState>,
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

  get menuItems$(): Observable<Array<IMenuItem>> {
    return this.state.map(state => state.guiObjects)
      .map(guiObjects => guiObjects.map(guiObject => this.prepareGuiObject(guiObject)))
      .distinctUntilChanged();
  }

  get isResolved(): Observable<boolean> {
    return this.state
      .map(state => state.isResolved)
      .filter(isResolved => isResolved !== null)
      .take(1);
  }

  createRefreshGuiObjectsAction(): Action {
    return { type: MenuService.GUI_OBJECTS_FETCH };
  }

  refreshGuiObjects(): void {
    const action = this.createRefreshGuiObjectsAction();
    this.store.dispatch(action);
  }

  private prepareGuiObject(guiObject: IMenuApiResponseItem): IMenuItem {
    const children = guiObject.children;
    return {
      ...menuConfig[guiObject.name],
      children: children && children.length ? children.map(child => this.prepareGuiObject(child)) : null
    };
  }

  private onSectionLoadStart(): void {
    this.lastNavigationStartTimestamp = Date.now();
  }

  private onSectionLoadEnd(event: NavigationEnd): void {
    const delay = Date.now() - this.lastNavigationStartTimestamp;
    const name = Object.keys(menuConfig).find(key => menuConfig[key].link === event.url);
    if (name) {
      this.logAction(name, delay);
    }
  }

  private logAction(name: string, delay: number): void {
    // const data = {
    //   typeCode: 1,
    //   duration: delay
    // };
    // const headers = new Headers({
    //   'X-Gui-Object': this.guiObjectIds[name]
    // });

    // this.dataService.create('/actions', {}, data, { headers }).subscribe();
  }

  // private flattenGuiObjectIds(appGuiObjects: Array<IMenuApiResponseItem>): any {
  //   return appGuiObjects.reduce((acc, guiObject) => ({
  //     ...acc,
  //     ...this.flattenGuiObjectIds(guiObject.children),
  //     [guiObject.name]: guiObject.id
  //   }), {});
  // }

  private get state(): Observable<IGuiObjectsState> {
    return this.store.select(state => state.guiObjects);
  }
}
