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
import { IPromiseLimit } from '@app/routes/workplaces/core/promise/promise.interface';

import { DataService } from '@app/core/data/data.service';
import { DebtsService } from '@app/routes/workplaces/core/debts/debts.service';
import { DocumentService } from '@app/routes/workplaces/shared/documents/document.service';
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
  private _attachmentChange: Function;

  readonly contactPersonChange$ = new BehaviorSubject<boolean>(false);
  readonly paymentChange$ = new BehaviorSubject<boolean>(false);
  readonly promiseChange$ = new BehaviorSubject<boolean>(false);
  readonly completeRegistration$ = new BehaviorSubject<boolean>(false);
  readonly attachmentChange$ = new BehaviorSubject<boolean>(false);

  constructor(
    private dataService: DataService,
    private debtsService: DebtsService,
    private documentService: DocumentService,
    private notificationsService: NotificationsService,
    private promiseService: PromiseService,
    private userPermissionsService: UserPermissionsService,
  ) {
    combineLatest(this.canSetPromise$, this.debtId$)
      .pipe(
        mergeMap(([ canLoad, debtId ]) => canLoad ? this.promiseService.getLimit(debtId, true) : of(null)),
      )
      .subscribe(limit => this._limit$.next(limit));
    this.attachmentChange$
      .filter(Boolean)
      .subscribe(_ => {
        if (this._attachmentChange) {
          this._attachmentChange();
          this._attachmentChange = null;
        }
      });
  }

  set status(status: IContactRegistrationStatus) {
    this.status$.next(status);
  }

  readonly shouldConfirm$ = this.status$.pipe(map(status => status === IContactRegistrationStatus.PAUSE));

  readonly isActive$ = this._params$.pipe(map(Boolean));

  readonly mode$ = this._mode$.asObservable();

  set mode(mode: IContactRegistrationMode) {
    this._mode$.next(mode);
  }

  readonly params$ = this._params$.asObservable();

  get params(): Partial<IContactRegistrationParams> {
    return this._params$.value;
  }

  readonly campaignId$ = this.params$.pipe(map(params => params && params.campaignId));

  readonly contactId$ = this.params$.pipe(map(params => params && params.contactId));

  readonly personRole$ = this.params$.pipe(map(params => params && params.personRole));

  get campaignId(): number {
    return this.params && this.params.campaignId;
  }

  get contactId(): number {
    return this.params && this.params.contactId;
  }

  readonly contactType$ = this.params$.pipe(map(params => params && params.contactType));

  get contactType(): number {
    return this.params && this.params.contactType;
  }

  readonly debtId$ = this.params$.pipe(map(params => params && params.debtId));

  get debtId(): number {
    return this.params && this.params.debtId;
  }

  readonly guid$ = this._guid$.asObservable();

  get guid(): string {
    return this._guid$.value;
  }

  set guid(guid: string) {
    this._guid$.next(guid);
  }

  readonly outcome$ = this._outcome$.asObservable();

  get outcome(): IOutcome {
    return this._outcome$.value;
  }

  set outcome(outcome: IOutcome) {
    this._outcome$.next(outcome);
    if (outcome && this.params) {
      this.initRegistration();
    }
  }

  readonly personId$ = this.params$.pipe(map(params => params && params.personId));

  get personId(): number {
    return this.params && this.params.personId;
  }

  get personRole(): number {
    return this.params && this.params.personRole;
  }

  readonly debt$ = this.debtId$.pipe(
      mergeMap(debtId => debtId ? this.debtsService.getDebt(debtId) : of(null)),
  );

  readonly limit$ = this._limit$.asObservable();

  readonly canSetPromise$ = this._outcome$.pipe(map(outcome => outcome && [2, 3].includes(outcome.promiseMode)));

  readonly canSetInsufficientPromiseAmount$ = combineLatestOr([
    this._outcome$.pipe(map(outcome => outcome && outcome.promiseMode && outcome.promiseMode !== 2)),
    this.userPermissionsService.has('PROMISE_INSUFFICIENT_AMOUNT_ADD'),
  ]);

  onAttachmentChange(): void {
    this._attachmentChange = () => this.documentService.dispatchAction(DocumentService.MESSAGE_DOCUMENT_SAVED);
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
