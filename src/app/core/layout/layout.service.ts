import { Injectable } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged, filter, share } from 'rxjs/operators';

import { IGuiObject } from '@app/core/gui-objects/gui-objects.interface';
import { IGuiObjectDef } from '@app/core/layout/layout.interface';

import { menuConfig } from '@app/routes/menu-config';

@Injectable()
export class LayoutService {
  private _currentGuiObject$ = new BehaviorSubject<IGuiObjectDef>(null);
  private guiObjects: Record<string, IGuiObjectDef>;
  private navigation: { start: Date, end: Date } = { start: null, end: null};

  readonly currentGuiObject$ = this._currentGuiObject$.pipe(
    distinctUntilChanged((a, b) => a && b && a.id === b.id),
    share(),
  );

  constructor(
    private router: Router,
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
      )
      .subscribe(() => this.onNavigationStart());

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => this.onNavigationEnd(event));

    this.onNavigationStart();
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
    this.setCurrentGuiObject(this.router.url);
  }

  private flattenGuiObjectIds(appGuiObjects: Array<IGuiObject>): any {
    return appGuiObjects.reduce((acc, guiObject) => ({
      ...acc,
      ...this.flattenGuiObjectIds(guiObject.children),
      [guiObject.name]: guiObject.id,
    }), {});
  }

  private onNavigationStart(): void {
    this.navigation = {
      start: new Date(),
      end: null,
    };
  }

  private onNavigationEnd(event: NavigationEnd): void {
    this.navigation = {
      ...this.navigation,
      end: new Date(),
    };
    this.setCurrentGuiObject(event.urlAfterRedirects);
  }

  private setCurrentGuiObject(fullUrl: string): void {
    if (this.guiObjects) {
      const url = fullUrl.split('/').slice(0, 4).join('/');
      const duration = this.navigation.end.getTime() - this.navigation.start.getTime();
      this._currentGuiObject$.next({ ...this.guiObjects[url], duration });
    }
  }
}
