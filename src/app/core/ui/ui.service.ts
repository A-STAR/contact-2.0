import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { UIActionType } from '@app/core/ui/ui.interface';

/**
 * See:
 * https://blog.nrwl.io/managing-state-in-angular-applications-22b75ef5625f
 *
 * This service is for managing client state (including transient client state).
 * In future this service could be used to manage multi-tab functionality replacing route reuse.
 *
 * TODO(d.maltsev):
 * - optionally save state to local storage
 * - optionally update state ignoring route params (e.g. for grid columns width)
 */
@Injectable()
export class UIService {

  private uiState$ = this.store.pipe(
    select(state => state.ui),
  );

  constructor(
    private router: Router,
    private store: Store<IAppState>,
  ) {}

  getState(key: string): Observable<any> {
    const k = this.generateKey(key);
    return this.uiState$.pipe(
      select(state => state[k]),
    );
  }

  updateState(key: string, state: any): void {
    this.store.dispatch({
      type: UIActionType.UPDATE,
      payload: {
        key: this.generateKey(key),
        state,
      },
    });
  }

  private generateKey(key: string): string {
    return this.router.url + ':' + key;
  }
}
