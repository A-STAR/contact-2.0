import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import {
  IContactRegistrationData,
  IContactRegistrationMode,
  IOutcome,
} from './contact-registration.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ContactRegistrationService {
  mode = IContactRegistrationMode.TREE;

  private _campaignId$  = new BehaviorSubject<number>(null);
  private _contactId$   = new BehaviorSubject<number>(null);
  private _contactType$ = new BehaviorSubject<number>(null);
  private _debtId$      = new BehaviorSubject<number>(null);
  private _guid$        = new BehaviorSubject<string>(null);
  private _outcome$     = new BehaviorSubject<IOutcome>(null);
  private _personId$    = new BehaviorSubject<number>(null);
  private _personRole$  = new BehaviorSubject<number>(null);

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  get campaignId$(): Observable<number> {
    return this._campaignId$.asObservable();
  }

  get campaignId(): number {
    return this._campaignId$.value;
  }

  set campaignId(campaignId: number) {
    this._campaignId$.next(campaignId);
  }

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

  get guid$(): Observable<string> {
    return this._guid$.asObservable();
  }

  get guid(): string {
    return this._guid$.value;
  }

  set guid(guid: string) {
    this._guid$.next(guid);
  }

  get outcome$(): Observable<IOutcome> {
    return this._outcome$.asObservable();
  }

  get outcome(): IOutcome {
    return this._outcome$.value;
  }

  set outcome(outcome: IOutcome) {
    this._outcome$.next(outcome);
    this.initRegistration();
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

  get canSetPromise$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.promiseMode)));
  }

  get canSetPayment$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.paymentMode)));
  }

  get canSetNextCallDate$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.nextCallMode)));
  }

  get canSetComment$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.commentMode)));
  }

  get canSetAutoCommentId$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && Boolean(outcome.autoCommentIds)));
  }

  get canSetPhone$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && outcome.addPhone === 1));
  }

  get canSetContactPerson$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && outcome.changeContactPerson === 1));
  }

  get canSetDebtReason$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.debtReasonMode)));
  }

  get canSetRefusal$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && outcome.isRefusal === 1));
  }

  get canSetAttachment$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.fileAttachMode)));
  }

  get canSetCallReason$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.callReasonMode)));
  }

  completeRegistration(data: Partial<IContactRegistrationData>): Observable<void> {
    const { debtId, guid } = this;
    return this.dataService.create('/debts/{debtId}/contactRegistration/{guid}/save', { debtId, guid }, data)
      .pipe(
        catchError(this.notificationsService.error('modules.contactRegistration.outcome.errors.init').dispatchCallback()),
      );
  }

  private initRegistration(): void {
    this.guid = null;
    const { campaignId, debtId, personId, personRole } = this;
    const data = {
      addressId: this.contactType === 3 ? this.contactId : undefined,
      campaignId,
      code: this.outcome.code,
      personId,
      personRole,
      phoneId: [1, 2].includes(this.contactType) ? this.contactId : undefined,
    };
    this.dataService.create('/debts/{debtId}/contactRegistration', { debtId }, data)
      .pipe(
        // TODO(d.maltsev): correct error message
        catchError(this.notificationsService.error('modules.contactRegistration.outcome.errors.init').dispatchCallback()),
      )
      .subscribe(response => this.guid = response.data[0].guid);
  }
}
