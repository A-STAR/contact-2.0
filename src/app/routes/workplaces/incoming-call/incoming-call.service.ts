import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IncomingCallService {
  private _selectedDebtor$ = new BehaviorSubject<any>(null);
  private _searchParams$ = new BehaviorSubject<object>(null);

  get selectedDebtor$(): Observable<any> {
    return this._selectedDebtor$;
  }

  set selectedDebtor(debtor: any) {
    this._selectedDebtor$.next(debtor);
  }

  get searchParams$(): Observable<object> {
    return this._searchParams$;
  }

  set searchParams(params: object) {
    this._searchParams$.next(params);
  }
}
