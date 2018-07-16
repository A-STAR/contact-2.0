import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { ITab } from '@app/shared/components/layout/tabview/header/header.interface';
import { ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';

@Injectable()
export class TabHeaderService {

  constructor() { }

  tabs$ = new BehaviorSubject<ITab[]>([]);
}

@Injectable()
export class CanActivateTabGuard implements CanActivateChild {
  constructor(private headerService: TabHeaderService) {}
  canActivateChild(next: ActivatedRouteSnapshot): Observable<boolean> {
    return this.headerService.tabs$
      .switchMap(tabs => combineLatest(...tabs.map(t => t.hasPermission)))
      .map(perms => {
        return perms.some(Boolean);
      });
  }
}
