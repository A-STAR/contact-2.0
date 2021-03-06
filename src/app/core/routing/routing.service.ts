import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Injectable()
export class RoutingService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  isRouteMatchesUrl(route: ActivatedRoute, url: string): boolean {
    return this.getRouteFullUrl(route) === url;
  }

  navigate(segments: string[], route: ActivatedRoute = this.route, queryParams?: Params): Promise<boolean> {
    return this.router.navigate(segments, { relativeTo: route, queryParams });
  }

  /**
   * Navigates to `url` (must be relative to `/`) using params as route .
   * If any param is not found in `params` - it is retrieved from route params
   *
   * Example:
   * ```typescript
   * this.routingService.navigateToUrl('/debtor/{debtorId}/debt/{debtId}/address/{addressId}', { addressId: 1 })
   * ```
   * This will get `debtorId` and `debtId` from router and use `addressId = 1`
   */
  navigateToUrl(url: string, params: Record<string, string> = {}): Promise<boolean> {
    const absoluteUrl = url.replace(/\{.+?\}/gi, chunk => {
      const key = chunk.slice(1, -1);
      return params[key]
        ? params[key]
        : this.getRouteParam(this.route, key);
    });
    return this.router.navigate([ absoluteUrl ]);
  }

  /**
   * Navigates to the closest parent route from child regardless of how many url segments there are in the child route
   *
   * @param route current route
   */
  navigateToParent(route: ActivatedRoute): Promise<boolean> {
    const { parent } = route;
    return parent.component
      ? this.router.navigate([ '.' ], { relativeTo: parent })
      : this.navigateToParent(parent);
  }

  /**
   * Returns route param if it exists in any nested route
   */
  getRouteParam(route: ActivatedRoute, key: string): any {
    return this.getRouteParamRecursively(route.root, key);
  }

  getRouteQueryParamsString(route: ActivatedRoute): string {
    return Object.keys(route.snapshot.queryParams)
      .reduce((acc, key) => [ ...acc, `${key}=${route.snapshot.queryParams[key]}` ], [])
      .join('&');
  }

  getRouteUrl(route: ActivatedRoute): string {
    return `/${[
        ...route.snapshot.pathFromRoot.reduce((acc, r) => [ ...acc, ...r.url ], []),
        ...route.snapshot.url
      ].join('/')}`;
  }

  getRouteFullUrl(route: ActivatedRoute): string {
    let queryString = this.getRouteQueryParamsString(route);
    if (queryString.length) {
      queryString = '?' + queryString;
    }
    return `${this.getRouteUrl(route)}${queryString}`;
  }

  private getRouteParamRecursively(route: ActivatedRoute, key: string): any {
    const param = route.snapshot.paramMap.get(key);
    if (param) {
      return param;
    } else {
      return route.firstChild
        ? this.getRouteParamRecursively(route.firstChild, key)
        : null;
    }
  }

  // navigate(segments: string[], route: ActivatedRoute = this.route): Promise<boolean> {
  //   const defer = new Promise<boolean>(resolve => this.navigateRecursively(segments, 1, route, resolve));
  //   return defer;
  // }

  // private navigateRecursively(segments: string[], i: number, route: ActivatedRoute, resolve: (state: boolean) => void): void {
  //   const segmentsSlice = segments.slice(0, i);
  //   const isLastSegment = segmentsSlice.length === segments.length;
  //   const url = segmentsSlice.join('/');

  //   this.router.navigate([ url ], { replaceUrl: isLastSegment, relativeTo: route }).then(isSucceeded => {
  //     if (!isLastSegment) {
  //       this.navigateRecursively(segments, i + 1, route, resolve);
  //     } else {
  //       resolve(isSucceeded);
  //     }
  //   });
  // }
}
