import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { IGuiObjectsState, IMenuItem, IGuiObject } from './gui-objects.interface';

import { menuConfig } from '../../routes/menu-config';

@Injectable()
export class GuiObjectsService {
  static GUI_OBJECTS_FETCH         = 'GUI_OBJECTS_FETCH';
  static GUI_OBJECTS_FETCH_SUCCESS = 'GUI_OBJECTS_FETCH_SUCCESS';

  private _guiObjects: Array<IGuiObject>;

  constructor(private store: Store<IAppState>) {
    this.state$.subscribe(state => this._guiObjects = state.data);
  }

  get menuItems(): Observable<Array<IMenuItem>> {
    return this.getGuiObjects()
      .map(guiObjects => guiObjects.map(guiObject => this.prepareGuiObject(guiObject)))
      .distinctUntilChanged();
  }

  get menuMainItems(): Observable<IMenuItem[]> {
    return this.getGuiObjects()
      .map(guiObjects => guiObjects.filter(guiObject => !guiObject.children))
      .map(guiObjects => guiObjects.map(guiObject => this.prepareGuiObject(guiObject)));
  }

  get menuChildItems(): Observable<IMenuItem[]> {
    return this.getGuiObjects()
      .map(guiObjects => guiObjects.filter(guiObject => !!guiObject.children && !!guiObject.children.length))
      .map(guiObjects => guiObjects.map(guiObject => this.prepareGuiObject(guiObject)))
      .map(menuItems => this.getMenuItemsChildren(menuItems));
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

  private getMenuItemsChildren(menuItems: IMenuItem[]): IMenuItem[] {
    return menuItems.reduce((acc, menuItem) => [
      ...acc,
      ...menuItem.children
    ], []);
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
    return this.store.select(state => state.guiObjects)
      .filter(Boolean);
  }
}
