import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ILayoutDimension } from '@app/layout/layout.interface';

@Injectable()
export class LayoutService {

  private _contentDimension$ = new BehaviorSubject<ILayoutDimension>(null);

  get contentDimension$(): Observable<ILayoutDimension> {
    return this._contentDimension$.asObservable();
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
