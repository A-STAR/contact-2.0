import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ActionsLogService } from './actions-log.service';

@Injectable()
export class ActionsLogResolver implements Resolve<void> {

  constructor(private actionsLogService: ActionsLogService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {
    return this.actionsLogService.employeesAndActionTypes;
  }
}
