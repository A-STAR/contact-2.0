import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { IContactRegistrationMode, IOutcome } from './contact-registration.interface';

@Injectable()
export class ContactRegistrationService {
  campaignId: number;
  guid: string = null;
  mode = IContactRegistrationMode.TREE;

  private _contactId$   = new BehaviorSubject<number>(null);
  private _contactType$ = new BehaviorSubject<number>(null);
  private _debtId$      = new BehaviorSubject<number>(null);
  private _outcome$     = new BehaviorSubject<IOutcome>(null);
  private _personId$    = new BehaviorSubject<number>(null);
  private _personRole$  = new BehaviorSubject<number>(null);

  get contactId$(): Observable<number> {
    return this._contactId$.asObservable();
  }

  get contactId(): number {
    return this._contactId$.value;
  }

  set contactId(contactId: number) {
    this._contactId$.next(contactId);
  }

  get contactType$(): Observable<number> {
    return this._contactType$.asObservable();
  }

  get contactType(): number {
    return this._contactType$.value;
  }

  set contactType(contactType: number) {
    this._contactType$.next(contactType);
  }

  get debtId$(): Observable<number> {
    return this._debtId$.asObservable();
  }

  get debtId(): number {
    return this._debtId$.value;
  }

  set debtId(debtId: number) {
    this._debtId$.next(debtId);
  }

  get outcome$(): Observable<IOutcome> {
    return this._outcome$.asObservable();
  }

  get outcome(): IOutcome {
    return this._outcome$.value;
  }

  set outcome(outcome: IOutcome) {
    this._outcome$.next(outcome);
  }

  get personId$(): Observable<number> {
    return this._personId$.asObservable();
  }

  get personId(): number {
    return this._personId$.value;
  }

  set personId(personId: number) {
    this._personId$.next(personId);
  }

  get personRole$(): Observable<number> {
    return this._personRole$.asObservable();
  }

  get personRole(): number {
    return this._personRole$.value;
  }

  set personRole(personRole: number) {
    this._personRole$.next(personRole);
  }

  get canSetComment$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.commentMode)));
  }

  get canSetNextCallDate$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.nextCallMode)));
  }

  get canSetPayment$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.paymentMode)));
  }

  get canSetPromise$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.promiseMode)));
  }
}
