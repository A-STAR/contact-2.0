import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class RoutingService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  navigate(segments: string[]): void {
    this.navigateRecursively(segments);
  }

  private navigateRecursively(segments: string[], i: number = 1): void {
    const segmentsSlice = segments.slice(0, i);
    const isLastSegment = segmentsSlice.length === segments.length;
    const url = segmentsSlice.join('/');
    this.router.navigate([ url ], { replaceUrl: isLastSegment, relativeTo: this.route }).then(() => {
      if (!isLastSegment) {
        this.navigateRecursively(segments, i + 1);
      }
    });
  }
}
