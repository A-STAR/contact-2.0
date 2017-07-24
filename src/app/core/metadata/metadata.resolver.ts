import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IMetadataState } from './metadata.interface';
import { IAppState } from '../state/state.interface';

import { MetadataService } from './metadata.service';

@Injectable()
export class MetadataResolver implements Resolve<boolean> {

  constructor(
    private metadataService: MetadataService,
    private store: Store<IAppState>
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.metadataService.refresh();
    return this.metadataService.isResolved
      .map(isResolved => {
        if (isResolved === false) {
          this.handleError();
        }
        return isResolved;
      })
      .take(1);
  }

  private handleError(): void {
    // TODO(a.maltsev) Navigate to error page
  }

  private get state(): Observable<IMetadataState> {
    return this.store.select(state => state.metadata);
  }
}
