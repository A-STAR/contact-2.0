import { Injectable } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { IMenuItem, IMenuApiResponseItem } from './menu.interface';

import { AuthService } from '../auth/auth.service';

import { menuConfig } from '../../routes/menu-config';

const ADDITIONAL_MENU_ITEMS: Array<IMenuApiResponseItem> = [
  { id: 0, name: 'menuItemHome' },
];

@Injectable()
export class MenuService {
  private lastNavigationStartTimestamp: number = null;

  private guiObjects$: Observable<Array<IMenuItem>>;

  constructor(
    private http: AuthHttp,
    private authService: AuthService,
    private router: Router
  ) {
    this.guiObjects$ = this.authService
      .getRootUrl()
      .flatMap(root => {
        return this.http
          .get(`${root}/api/guiconfigurations`)
          .map(resp => resp.json())
          .map(resp => resp.appGuiObjects)
          .map(data => this.prepareMenu(data));
      });

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

    // TODO: log data when the API is ready
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
}
