import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IncomingCallService {
  private _selectedDebtodId$ = new BehaviorSubject<number>(null);

  get selectedDebtorId$(): Observable<number> {
    return this._selectedDebtodId$;
  }

  set selectedDebtorId(debtorId: number) {
    this._selectedDebtodId$.next(debtorId);
  }
}
