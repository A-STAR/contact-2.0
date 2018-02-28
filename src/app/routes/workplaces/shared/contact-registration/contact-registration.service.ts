import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { catchError, filter, first, map, mergeMap } from 'rxjs/operators';

import {
  IContactRegistrationData,
  IContactRegistrationMode,
  IContactRegistrationParams,
  IContactRegistrationStatus,
  IOutcome,
} from './contact-registration.interface';
import { IDebt } from '@app/routes/workplaces/core/debts/debts.interface';
import { IPromiseLimit } from '@app/routes/workplaces/core/promise/promise.interface';

import { DataService } from '@app/core/data/data.service';
import { DebtsService } from '@app/routes/workplaces/core/debts/debts.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PromiseService } from '@app/routes/workplaces/core/promise/promise.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { combineLatestOr } from '@app/core/utils/helpers';

@Injectable()
export class ContactRegistrationService {
  private _guid$    = new BehaviorSubject<string>(null);
  private _limit$   = new BehaviorSubject<IPromiseLimit>(null);
  private _mode$    = new BehaviorSubject<IContactRegistrationMode>(IContactRegistrationMode.TREE);
  private _outcome$ = new BehaviorSubject<IOutcome>(null);
  private _params$  = new BehaviorSubject<Partial<IContactRegistrationParams>>(null);

  private status$   = new BehaviorSubject<IContactRegistrationStatus>(null);

  constructor(
    private dataService: DataService,
    private debtsService: DebtsService,
    private notificationsService: NotificationsService,
    private promiseService: PromiseService,
    private userPermissionsService: UserPermissionsService,
  ) {
    combineLatest(this.canSetPromise$, this.debtId$)
      .pipe(
        mergeMap(([ canLoad, debtId ]) => canLoad ? this.promiseService.getLimit(debtId, true) : of(null)),
      )
      .subscribe(limit => this._limit$.next(limit));
  }

  set status(status: IContactRegistrationStatus) {
    this.status$.next(status);
  }

  get shouldConfirm$(): Observable<boolean> {
    return this.status$.pipe(map(status => status === IContactRegistrationStatus.PAUSE));
  }

  get isActive$(): Observable<boolean> {
    return this._params$.pipe(map(Boolean));
  }

  get mode$(): Observable<IContactRegistrationMode> {
    return this._mode$.asObservable();
  }

  set mode(mode: IContactRegistrationMode) {
    this._mode$.next(mode);
  }

  get params$(): Observable<Partial<IContactRegistrationParams>> {
    return this._params$.asObservable();
  }

  get params(): Partial<IContactRegistrationParams> {
    return this._params$.value;
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
      mergeMap(debtId => debtId ? this.debtsService.getDebt(debtId) : of(null)),
    );
  }

  get limit$(): Observable<IPromiseLimit> {
    return this._limit$.asObservable();
  }

  get canSetPromise$(): Observable<boolean> {
    return this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.promiseMode)));
  }

  get canSetInsufficientPromiseAmount$(): Observable<boolean> {
    return combineLatestOr([
      this._outcome$.pipe(map(outcome => outcome && outcome.promiseMode && outcome.promiseMode !== 2)),
      this.userPermissionsService.has('PROMISE_INSUFFICIENT_AMOUNT_ADD'),
    ]);
  }

  pauseRegistration(): Observable<IContactRegistrationStatus> {
    if (this.status$.value) {
      this.status$.next(IContactRegistrationStatus.PAUSE);
      return this.status$.pipe(
        filter(status => status === IContactRegistrationStatus.REGISTRATION || status === null),
        first(),
      );
    } else {
      return of(null);
    }
  }

  startRegistration(params: Partial<IContactRegistrationParams>): void {
    if (this.params) {
      this.pauseRegistration().subscribe(proceed => {
        if (proceed) {
          this.continueRegistration();
        } else {
          this.cancelRegistration();
          this.status$.next(IContactRegistrationStatus.REGISTRATION);
          this._params$.next(params);
        }
      });
    } else {
      this.status$.next(IContactRegistrationStatus.REGISTRATION);
      this._params$.next(params);
    }
  }

  cancelRegistration(): void {
    this._mode$.next(IContactRegistrationMode.TREE);
    this._outcome$.next(null);
    this._params$.next(null);
    this.status$.next(null);
  }

  continueRegistration(): void {
    this.status$.next(IContactRegistrationStatus.REGISTRATION);
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
    const { contactId, contactType, debtId, ...params } = this.params;
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
