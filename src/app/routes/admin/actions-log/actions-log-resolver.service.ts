import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../core/state/state.interface';

import { ActionsLogService } from './actions-log.service';

@Injectable()
export class ActionsLogResolver implements Resolve<void> {

  constructor(private actionsLogService: ActionsLogService,
              private store: Store<IAppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return Observable.zip(
      this.actionsLogService.getEmployees(),
      this.actionsLogService.getActionTypes(),
      (employees, actionTypes) => {
        this.store.next({
          type: ActionsLogService.EMPLOYEES_FETCH_SUCCESS,
          payload: employees
        });
        this.store.next({
          type: ActionsLogService.ACTION_TYPES_FETCH_SUCCESS,
          payload: actionTypes
        });
      }
    );
  }
}
