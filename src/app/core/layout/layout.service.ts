import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter } from 'rxjs/operators';

import { IGuiObject } from '@app/core/gui-objects/gui-objects.interface';
import { IGuiObjectDef } from '@app/core/layout/layout.interface';

import { menuConfig } from '@app/routes/menu-config';

@Injectable()
export class LayoutService {
  private guiObjects: Record<string, IGuiObjectDef>;
  private _currentGuiObject$ = new BehaviorSubject<IGuiObjectDef>(null);

  readonly currentGuiObject$ = this._currentGuiObject$.asObservable();

  constructor(
    private router: Router,
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => this.onNavigation(event.urlAfterRedirects));
  }

  setGuiObjects(guiObjects: any): void {
    const flatGuiObjects = this.flattenGuiObjectIds(guiObjects);
    this.guiObjects = Object.keys(menuConfig).reduce((acc, key) => ({
      ...acc,
      [menuConfig[key].link]: {
        id: flatGuiObjects[key],
        docs: menuConfig[key].docs,
        name: key,
      },
    }), {});
    this.onNavigation(this.router.url);
  }

  private flattenGuiObjectIds(appGuiObjects: Array<IGuiObject>): any {
    return appGuiObjects.reduce((acc, guiObject) => ({
      ...acc,
      ...this.flattenGuiObjectIds(guiObject.children),
      [guiObject.name]: guiObject.id,
    }), {});
  }

  private onNavigation(fullUrl: string): void {
    if (this.guiObjects) {
      const url = fullUrl.split('/').slice(0, 4).join('/');
      this._currentGuiObject$.next(this.guiObjects[url]);
    }
  }
}
