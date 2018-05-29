import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class RoutingService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  navigate(segments: string[], route: ActivatedRoute = this.route): Promise<boolean> {
    return this.router.navigate(segments, { relativeTo: route });
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
