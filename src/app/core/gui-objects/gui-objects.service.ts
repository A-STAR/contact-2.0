import { Injectable } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { Headers } from '@angular/http';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { IGuiObjectsState, IMenuItem, IGuiObject } from './gui-objects.interface';

import { ActionsLogService } from '../actions-log/actions-log.service';

import { menuConfig } from '../../routes/menu-config';

@Injectable()
export class GuiObjectsService {
  static GUI_OBJECTS_FETCH         = 'GUI_OBJECTS_FETCH';
  static GUI_OBJECTS_FETCH_SUCCESS = 'GUI_OBJECTS_FETCH_SUCCESS';

  private _guiObjects: Array<IGuiObject>;
  private lastNavigationStartTimestamp: number = null;

  constructor(
    private actionsLogService: ActionsLogService,
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
    this.state$.subscribe(state => this._guiObjects = state.data);
  }

  get menuItems(): Observable<Array<IMenuItem>> {
    return this.getGuiObjects()
      .map(guiObjects => guiObjects.map(guiObject => this.prepareGuiObject(guiObject)))
      .distinctUntilChanged();
  }

  get menuItemIds(): Observable<any> {
    return this.getGuiObjects()
      .map(guiObjects => this.flattenGuiObjectIds(guiObjects))
      .distinctUntilChanged();
  }

  createRefreshGuiObjectsAction(): Action {
    return { type: GuiObjectsService.GUI_OBJECTS_FETCH };
  }

  refreshGuiObjects(): void {
    const action = this.createRefreshGuiObjectsAction();
    this.store.dispatch(action);
  }

  private prepareGuiObject(guiObject: IGuiObject): IMenuItem {
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
    this.menuItemIds
      .take(1)
      .subscribe(menuItemIds => {
        if (menuItemIds[name] > 0) {
          this.actionsLogService.log(name, delay, menuItemIds[name]);
        }
      });
  }

  private flattenGuiObjectIds(appGuiObjects: Array<IGuiObject>): any {
    return appGuiObjects.reduce((acc, guiObject) => ({
      ...acc,
      ...this.flattenGuiObjectIds(guiObject.children),
      [guiObject.name]: guiObject.id
    }), {});
  }

  private getGuiObjects(): Observable<Array<IGuiObject>> {
    if (!this._guiObjects) {
      this.refreshGuiObjects();
    }
    return this.state$.map(state => state.data).filter(Boolean).distinctUntilChanged();
  }

  private get state$(): Observable<IGuiObjectsState> {
    return this.store.select(state => state.guiObjects);
  }
}
