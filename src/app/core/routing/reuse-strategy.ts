import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { IRouteCache } from './routing.interface';

@Injectable()
export class ReuseStrategy implements RouteReuseStrategy {
  private cache: IRouteCache = {};

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const config = route.routeConfig;
    return config && !config.loadChildren;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getRouteUrl(route);
    this.cache[url] = { handle, showTab: Boolean(route.data.showTab) };
    this.addRedirect(route);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.getHandle(route);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const config = route.routeConfig;
    return !config || config.loadChildren
      ? false
      : this.getHandle(route);
  }

  private addRedirect(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        const routeFirstChild = route.firstChild;
        const routeFirstChildUrl = routeFirstChild
          ? routeFirstChild.url.map(urlSegment => urlSegment.path).join('/')
          : '';
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(c => this.addRedirect(c));
    }
  }

  private getHandle(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const item = this.cache[this.getRouteUrl(route)];
    return item && item.handle;
  }

  private getRouteUrl(route: ActivatedRouteSnapshot): string {
    return this.getRouteUrlRecursively(route).filter(Boolean).join('/');
  }

  private getRouteUrlRecursively(route: ActivatedRouteSnapshot): string[] {
    const paths = route.url.map(segment => segment.path);
    return route.parent
      ? [ ...this.getRouteUrlRecursively(route.parent), ...paths ]
      : paths;
  }
}
