import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { tap } from 'rxjs/operators/tap';

import { IAppState } from '../state/state.interface';
import { IMenuItem, IGuiObject } from './gui-objects.interface';

import { menuConfig } from '../../routes/menu-config';

@Injectable()
export class GuiObjectsService {
  static GUI_OBJECTS_FETCH         = 'GUI_OBJECTS_FETCH';
  static GUI_OBJECTS_FETCH_SUCCESS = 'GUI_OBJECTS_FETCH_SUCCESS';
  static GUI_OBJECTS_SELECTED = 'GUI_OBJECTS_SELECTED';

  private _guiObjects: Array<IGuiObject>;
  private isFetching = false;

  private readonly state$ = this.store.pipe(
    select(state => state.guiObjects),
  );

  constructor(private store: Store<IAppState>) {
    // is it really neccessary?
    this.state$.subscribe(state => this._guiObjects = state.data);
  }

  get menuItems(): Observable<Array<IMenuItem>> {
    return this.getGuiObjects()
      .map(guiObjects => guiObjects.map(guiObject => this.prepareGuiObject(guiObject)))
      .distinctUntilChanged();
  }

  get selectedMenuItem(): Observable<IMenuItem> {
    return this.state$
      .map(state => state.selectedObject)
      .filter(Boolean)
      .map(guiObject => ({
        ...menuConfig[guiObject.name],
        ...guiObject
      }));
  }

  get menuItemIds(): Observable<any> {
    return this.getGuiObjects()
      .map(guiObjects => this.flattenGuiObjectIds(guiObjects))
      .distinctUntilChanged();
  }

  refreshGuiObjects(): void {
    this.store.dispatch({ type: GuiObjectsService.GUI_OBJECTS_FETCH });
    this.isFetching = true;
  }

  selectMenuItem(menuItem: IMenuItem): void {
    this.store.dispatch({
      type: GuiObjectsService.GUI_OBJECTS_SELECTED,
      payload: menuItem
    });
  }

  findItemByLink(menuItems: IMenuItem[], link: string): IMenuItem {
    return menuItems.find(menuItem => {
      return menuItem.link === link || (menuItem.children && !!this.findItemByLink(menuItem.children, link));
    });
  }

  private prepareGuiObject(guiObject: IGuiObject): IMenuItem {
    const children = guiObject.children;
    return {
      ...menuConfig[guiObject.name],
      children: children && children.length ? children.map(child => this.prepareGuiObject(child)) : null
    };
  }

  private flattenGuiObjectIds(appGuiObjects: Array<IGuiObject>): any {
    return appGuiObjects.reduce((acc, guiObject) => ({
      ...acc,
      ...this.flattenGuiObjectIds(guiObject.children),
      [guiObject.name]: guiObject.id
    }), {});
  }

  private getGuiObjects(): Observable<Array<IGuiObject>> {
    if (!this._guiObjects && !this.isFetching) {
      this.refreshGuiObjects();
    }
    return this.state$
      .map(state => state.data)
      .pipe(
        filter(Boolean),
        tap(() => {
          this.isFetching = false;
        }),
        distinctUntilChanged(),
      );
  }
}
