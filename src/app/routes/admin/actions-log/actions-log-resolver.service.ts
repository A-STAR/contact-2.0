import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { ActionsLogService } from './actions-log.service';

@Injectable()
export class ActionsLogResolver implements Resolve<Array<any>> {

  constructor(private actionsLogService: ActionsLogService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {
    return Observable.zip(
      this.actionsLogService.getOperators(),
      this.actionsLogService.getActionTypes(),
      (employees, actionTypes) => [ employees, actionTypes ]
    );
  }
}
