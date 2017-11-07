import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IncomingCallService {
  private _selectedDebtorId$ = new BehaviorSubject<number>(null);
  private _searchParams$ = new BehaviorSubject<object>(null);

  get selectedDebtorId$(): Observable<number> {
    return this._selectedDebtorId$;
  }

  set selectedDebtorId(debtorId: number) {
    this._selectedDebtorId$.next(debtorId);
  }

  get searchParams$(): Observable<object> {
    return this._searchParams$;
  }

  set searchParams(params: object) {
    this._searchParams$.next(params);
  }
}
