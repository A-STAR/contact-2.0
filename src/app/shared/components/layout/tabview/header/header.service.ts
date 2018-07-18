import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators/first';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { RouteTab } from '@app/shared/components/layout/tabview/header/header.interface';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { RoutingService } from '@app/core/routing/routing.service';

@Injectable()
export class CanActivateTabGuard implements CanActivate, CanActivateChild {

  constructor(
      private routingService: RoutingService,
      private userPermissionService: UserPermissionsService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return route.data.tabs ?
      this.getTabPerms$(route.data.tabs)
        .pipe(
          first(),
          map(perms => {
            return perms.some(Boolean);
          })) : of(true);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return state.url && route.data.tabs && route.routeConfig.path ?
      this.onTabPermChange(route.data.tabs, route.routeConfig.path, state.url) : of(true);
  }

  private getTabPerms$(tabs: RouteTab[]): Observable<boolean[]> {
    return combineLatest(tabs.map(t => t.permission ? this.userPermissionService.has(t.permission) : of(true)));
  }

  private onTabPermChange(tabs: RouteTab[], link: string, absUrl: string): Observable<boolean> {
    return this.getTabPerms$(tabs)
      .pipe(
        first(),
        map((tabPerms: boolean[]) => {
          const allowedIndex = tabPerms.findIndex(Boolean);
          const currentIndex = tabs.findIndex(t => t.link === link);
          if (allowedIndex !== -1 && !tabPerms[currentIndex]) {
            this.navigate(this.getRedirectUrl(absUrl, tabs[allowedIndex]));
            return false;
          }
          return true;
        })
      );
  }


  private navigate(link: string): void {
    this.routingService.navigateToUrl(link);
  }

  private getRedirectUrl(absUrl: string, tab: RouteTab): string {
    const parts = absUrl.split('/');
    parts.splice(-1, 1, tab.link);
    return parts.join('/');
  }
}
