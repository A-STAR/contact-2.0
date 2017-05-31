import { Injectable } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/observable/concat';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/combineLatest';

import { IMenuItem, IMenuApiResponseItem, IMenuApiResponse } from './menu.interface';

import { AuthService } from '../auth/auth.service';

import { menuConfig } from '../../routes/menu-config';

const ADDITIONAL_MENU_ITEMS: Array<IMenuApiResponseItem> = [
  { id: 0, name: 'menuItemHome' },
];

@Injectable()
export class MenuService {
  private menuItems: Array<IMenuItem> = null;

  private lastNavigationStartTimestamp: number = null;

  private guiObjectIds = {};

  private menuLog = new Subject<Array<any>>();

  constructor(
    private http: AuthHttp,
    private authService: AuthService,
    private router: Router
  ) {
    this.onSectionLoadStart();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.onSectionLoadStart();
      } else if (event instanceof NavigationEnd) {
        this.onSectionLoadEnd(event);
      }
    });

    Observable
      .combineLatest(this.menuLog, Observable.of(this.menuItems))
      .subscribe(data => {
        const [key, delay] = data[0];
        console.log(`${this.guiObjectIds[key]}, ${delay}`);
      });
  }

  loadMenu(): Observable<boolean> {
    return this.authService
      .getRootUrl()
      .flatMap(root => {
        return this.http
          .get(`${root}/api/guiconfigurations`)
          .map(resp => resp.json())
          .do(resp => this.prepareMenu(resp))
          .map(resp => true);
      })
      .catch(error => {
        // TODO: move into wrapper
        if ([401, 403].find(status => error.status === status)) {
          this.authService.redirectToLogin();
        } else {
          this.router.navigate(['/connection-error']);
        }
        throw error;
      });
  }

  getMenu(): Array<IMenuItem> {
    return this.menuItems;
  }

  private onSectionLoadStart(): void {
    this.lastNavigationStartTimestamp = Date.now();
  }

  private onSectionLoadEnd(event: NavigationEnd): void {
    const delay = Date.now() - this.lastNavigationStartTimestamp;
    const menuConfigItemKey = Object.keys(menuConfig).find(key => menuConfig[key].link === event.url);
    this.menuLog.next([menuConfigItemKey, delay]);
  }

  private prepareMenu(response: IMenuApiResponse): Array<IMenuItem> {
    return this.menuItems = ADDITIONAL_MENU_ITEMS
      .concat(response.appGuiObjects)
      .map(item => this.prepareMenuNode(item));
  }

  private prepareMenuNode(node: IMenuApiResponseItem): IMenuItem {
    // This is not pure
    this.guiObjectIds[node.name] = node.id;
    return {
      ...menuConfig[node.name],
      children: node.children && node.children.length ? node.children.map(child => this.prepareMenuNode(child)) : undefined
    };
  }
}
