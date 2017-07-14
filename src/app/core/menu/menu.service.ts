import { Injectable } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IMenuItem, IMenuApiResponseItem } from './menu.interface';

import { DataService } from '../data/data.service';

import { menuConfig } from '../../routes/menu-config';

const ADDITIONAL_MENU_ITEMS: Array<IMenuApiResponseItem> = [
  { id: 0, name: 'menuItemHome' },
];

@Injectable()
export class MenuService {
  private lastNavigationStartTimestamp: number = null;

  private guiObjects$: Observable<Array<IMenuItem>>;

  private guiObjectIds: { [key: string]: number };

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.guiObjects$ = this.dataService.read('/guiconfigurations')
      .map(response => response.appGuiObjects)
      .do(data => this.guiObjectIds = this.flattenGuiObjectIds(data))
      .map(data => this.prepareMenu(data));

    this.onSectionLoadStart();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.onSectionLoadStart();
      } else if (event instanceof NavigationEnd) {
        this.onSectionLoadEnd(event);
      }
    });
  }

  get guiObjects(): Observable<Array<IMenuItem>> {
    return this.guiObjects$;
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
    const data = {
      typeCode: 1,
      duration: delay
    };
    const headers = new Headers({
      'X-Gui-Object': this.guiObjectIds[name]
    });

    this.dataService
      .create('/actions', {}, data, { headers })
      .take(1)
      .subscribe();
  }

  private prepareMenu(appGuiObjects: Array<IMenuApiResponseItem>): Array<IMenuItem> {
    return ADDITIONAL_MENU_ITEMS
      .concat(appGuiObjects)
      .map(item => this.prepareMenuNode(item));
  }

  private prepareMenuNode(node: IMenuApiResponseItem): IMenuItem {
    return {
      ...menuConfig[node.name],
      children: node.children && node.children.length ? node.children.map(child => this.prepareMenuNode(child)) : undefined
    };
  }

  private flattenGuiObjectIds(appGuiObjects: Array<IMenuApiResponseItem>): any {
    return appGuiObjects.reduce((acc, guiObject) => ({
      ...acc,
      ...this.flattenGuiObjectIds(guiObject.children),
      [guiObject.name]: guiObject.id
    }), {});
  }
}
