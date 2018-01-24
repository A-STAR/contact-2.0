import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';

import {
  IContactRegistrationData,
  IContactRegistrationMode,
  IContactRegistrationParams,
  IOutcome,
} from './contact-registration.interface';
import { IDebt } from '@app/routes/workplaces/core/debts/debts.interface';
import { IPromiseLimit } from '@app/routes/workplaces/core/promise/promise.interface';

import { DataService } from '@app/core/data/data.service';
import { DebtsService } from '@app/routes/workplaces/core/debts/debts.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
// import { PromiseService } from '@app/routes/workplaces/core/promise/promise.service';
// import { first } from 'rxjs/operators/first';

@Injectable()
export class ContactRegistrationService {
  mode = IContactRegistrationMode.TREE;

  private _guid$    = new BehaviorSubject<string>(null);
  private _outcome$ = new BehaviorSubject<IOutcome>(null);
  private _params$  = new BehaviorSubject<Partial<IContactRegistrationParams>>(null);

  private _debt$ = new BehaviorSubject<any>(null);
  private _limit$ = new BehaviorSubject<any>(null);

  constructor(
    private dataService: DataService,
    private debtsService: DebtsService,
    private notificationsService: NotificationsService,
    // private promiseService: PromiseService,
  ) {}

  get isActive$(): Observable<boolean> {
    return this._params$.pipe(map(Boolean));
  }

  get params$(): Observable<Partial<IContactRegistrationParams>> {
    return this._params$.asObservable();
  }

  get params(): Partial<IContactRegistrationParams> {
    return this._params$.value;
  }

  set params(params: Partial<IContactRegistrationParams>) {
    this._params$.next(params);
  }

  get campaignId$(): Observable<number> {
    return this.params$.pipe(map(params => params && params.campaignId));
  }

  get campaignId(): number {
    return this.params && this.params.campaignId;
  }

  get contactId$(): Observable<number> {
    return this.params$.pipe(map(params => params && params.contactId));
  }

  get contactId(): number {
    return this.params && this.params.contactId;
  }

  get contactType$(): Observable<number> {
    return this.params$.pipe(map(params => params && params.contactType));
  }

  get contactType(): number {
    return this.params && this.params.contactType;
  }

  get debtId$(): Observable<number> {
    return this.params$.pipe(map(params => params && params.debtId));
  }

  get debtId(): number {
    return this.params && this.params.debtId;
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
    if (outcome && this.params) {
      this.initRegistration();
    }
  }

  get personId$(): Observable<number> {
    return this.params$.pipe(map(params => params && params.personId));
  }

  get personId(): number {
    return this.params && this.params.personId;
  }

  get personRole$(): Observable<number> {
    return this.params$.pipe(map(params => params && params.personRole));
  }

  get personRole(): number {
    return this.params && this.params.personRole;
  }

  get debt$(): Observable<IDebt> {
    return this.debtId$.pipe(
      mergeMap(debtId => this.debtsService.getDebt(debtId)),
    );
  }

  get limit$(): Observable<IPromiseLimit> {
    return this.debtId$.pipe(
      map(() => null),
      // mergeMap(debtId => {
      //   // TODO(d.maltsev): if contact registration is used NOT in call center, pass `false`
      //   return this.promiseService.getLimit(debtId, true).pipe(
      //     first(),
      //   );
      // }),
    );
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

  get canSetChangeReason$(): Observable<boolean> {
    return this._outcome$.pipe(
      map(outcome => outcome && [2, 3].includes(outcome.statusReasonMode) && Boolean(outcome.debtStatusCode)),
    );
  }

  completeRegistration(data: Partial<IContactRegistrationData>): Observable<void> {
    const { debtId, guid } = this;
    const payload = {
      ...this.initData,
      ...data,
    };
    return this.dataService.create('/debts/{debtId}/contactRegistration/{guid}/save', { debtId, guid }, payload)
      .pipe(
        catchError(this.notificationsService.error('modules.contactRegistration.outcome.errors.init').dispatchCallback()),
      );
  }

  private initRegistration(): void {
    this.guid = null;
    const { debtId } = this;
    this.dataService.create('/debts/{debtId}/contactRegistration', { debtId }, this.initData)
      .pipe(
        // TODO(d.maltsev): correct error message
        catchError(this.notificationsService.error('modules.contactRegistration.outcome.errors.init').dispatchCallback()),
      )
      .subscribe(response => this.guid = response.data[0].guid);
  }

  private get initData(): any {
    const { contactId, contactType, ...params } = this.params;
    return {
      ...params,
      ...this.getContactParams(contactId, contactType),
      code: this.outcome.code,
    };
  }

  private getContactParams(contactId: number, contactType: number): any {
    switch (contactType) {
      case 1:
      case 2:
        return { phoneId: contactId };
      case 3:
        return { addressId: contactId };
      default:
        return {};
    }
  }
}
