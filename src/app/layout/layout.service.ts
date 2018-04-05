import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter } from 'rxjs/operators';

import { ILayoutDimension } from '@app/layout/layout.interface';

@Injectable()
export class LayoutService {
  private _contentDimension$ = new BehaviorSubject<ILayoutDimension>(null);
  private _url = this.router.url;

  readonly contentDimension$ = this._contentDimension$.asObservable();

  constructor(
    private router: Router,
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        this._url = event.urlAfterRedirects;
      });
  }

  get url(): string {
    return this._url;
  }

  triggerContentDimensionChange(): void {
    this._contentDimension$.next({
      width: this.content.width(),
      height: this.content.height()
    });
  }

  private get content(): any {
    return $('.content');
  }
}
