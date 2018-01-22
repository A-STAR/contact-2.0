import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class RoutingService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  navigate(segments: string[], route: ActivatedRoute = this.route): void {
    this.navigateRecursively(segments, 1, route);
  }

  private navigateRecursively(segments: string[], i: number, route: ActivatedRoute): void {
    const segmentsSlice = segments.slice(0, i);
    const isLastSegment = segmentsSlice.length === segments.length;
    const url = segmentsSlice.join('/');
    this.router.navigate([ url ], { replaceUrl: isLastSegment, relativeTo: route }).then(() => {
      if (!isLastSegment) {
        this.navigateRecursively(segments, i + 1, route);
      }
    });
  }
}
