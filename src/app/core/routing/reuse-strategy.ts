import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { ICachedRoute, IRouteConfigData } from './routing.interface';

import { isEmpty, flattenArray } from '../utils';

/**
 * See:
 * https://github.com/angular/angular/issues/6634
 * https://github.com/angular/angular/issues/13869
 * https://github.com/angular/angular/issues/20072
 *
 * Short breakdown of the magic behind route reuse strategy:
 *
 * 1. When you navigate to a different route, `shouldReuseRoute` fires.
 *    If that returns `true`, the route you're currently on is reused and NONE of the other methods are fired.
 *
 * 2. If `shouldReuseRoute` returns `false`, `shouldDetach` and `shouldAttach` both fire.
 *    `shouldDetach` determines whether or not the route you're navigating *from* is stored.
 *    `shouldAttach` determines whether or not the route you're navigating *to* is retrieved.
 *
 * 3. If `shouldDetach`, returns `true`, `store` is fired.
 *
 * 4. If `shouldAttach` returns `true`, `retrieve` is fired.
 */
@Injectable()
export class ReuseStrategy implements RouteReuseStrategy {
  private routeCache = new Map<string, ICachedRoute>();

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  /**
   * We only detach and store route only if its config has `reuse = true` explicitly set.
   * This is for backwards compatibility, so that the existing routes wouldn't break the app.
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.shouldReuse(route);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getFullRouteUrl(route);
    const data = this.getRouteData(route);
    this.routeCache.set(url, { handle, data });
    this.addRedirectsRecursively(route);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteUrl(route);
    return this.shouldReuse(route) && this.routeCache.has(url);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const url = this.getFullRouteUrl(route);
    return this.shouldReuse(route) && this.routeCache.has(url)
      ? this.routeCache.get(url).handle
      : null;
  }

  /**
   * This is the tricky bit - we circumvent the Angular Router bugs here.
   *
   * See https://github.com/angular/angular/issues/13869#issuecomment-301632612 for the general idea and inspiration.
   *
   * Imagine the following route structure:
   * ```plaintext
   *        A
   *       / \
   *      /   \
   *     /     \
   *    B       C
   *   / \     / \
   *  D   E   F   G
   * ```
   * Suppose the following default redirects are set up:
   * - A -> B
   * - B -> D
   * - C -> F
   *
   * Scenario 1:
   * You navigate: `E -> C -> B`.
   * In this case, we have to change the default redirect from `B -> D` to `B -> E` in runtime, otherwise Angular Router fails.
   * It also has a nice side effect of preserving the nested routes' state.
   *
   * Scenario 2:
   * You navigate `G -> D -> A`.
   * This is like the previous case, except we have to add redirects to all children recursively
   * so that A could redirect to C and C, in turn, to G.
   */
  private addRedirectsRecursively(route: ActivatedRouteSnapshot): void {
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        const childConfigs = config.children;
        if (childConfigs) {
          const childConfigWithRedirect = childConfigs.find(c => c.path === '' && !!c.redirectTo);
          if (childConfigWithRedirect) {
            const routeFirstChild = route.firstChild;
            const routeFirstChildUrl = routeFirstChild
              ? this.getRouteUrlPaths(routeFirstChild).join('/')
              : '';
            /**
             * Currently Angular strips query strings when redirecting
             * See: https://github.com/angular/angular/issues/17934
             *
             * TODO(d.maltsev): replace all query params with optional params (mostly in contact registration)
             * e.g., ?personId=1&personRole=2 -> ;personId=1;personRole=2
             */
            childConfigWithRedirect.redirectTo = routeFirstChildUrl
              + this.getRouteMatrixString(routeFirstChild)
              + this.getRouteQueryString(route);
          }
        }
      }
      route.children.forEach(childRoute => this.addRedirectsRecursively(childRoute));
    }
  }

  private getFullRouteUrl(route: ActivatedRouteSnapshot): string {
    return this.getFullRouteUrlPaths(route).filter(Boolean).join('/')
      + this.getRouteMatrixString(route)
      + this.getRouteQueryString(route);
  }

  private getFullRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    const paths = this.getRouteUrlPaths(route);
    return route.parent
      ? [ ...this.getFullRouteUrlPaths(route.parent), ...paths ]
      : paths;
  }

  private getRouteUrlPaths(route: ActivatedRouteSnapshot): string[] {
    return route.url.map(urlSegment => urlSegment.path);
  }

  private getRouteQueryString(route: ActivatedRouteSnapshot): string {
    const params = new HttpParams({ fromObject: route.queryParams });
    const queryString = params.toString();
    return queryString && isEmpty(route.children)
      ? '?' + queryString
      : '';
  }

  private getRouteMatrixString(route: ActivatedRouteSnapshot): string {
    const params = new HttpParams({ fromObject: this.getOptionalParams(route) });
    const matrixString = params.toString();
    return matrixString
      ? ';' + matrixString.replace('&', ';')
      : '';
  }

  private getRouteData(route: ActivatedRouteSnapshot): IRouteConfigData {
    return route.routeConfig && route.routeConfig.data as IRouteConfigData;
  }

  private shouldReuse(route: ActivatedRouteSnapshot): boolean {
    const data = this.getRouteData(route);
    return data && data.reuse;
  }

  private getOptionalParams(route: ActivatedRouteSnapshot): any {
    const paths = route.pathFromRoot
      .map(r => r.routeConfig)
      .filter(Boolean)
      .map(c => c.path)
      .filter(Boolean)
      .map(c => c.split('/'));
    const mandatoryParamKeys = flattenArray(paths)
      .filter(p => p.startsWith(':'))
      .map(p => p.substr(1));
    return Object.keys(route.params)
      .reduce((acc, key) => mandatoryParamKeys.includes(key) ? acc : { ...acc, [key]: route.params[key] }, {});
  }
}
