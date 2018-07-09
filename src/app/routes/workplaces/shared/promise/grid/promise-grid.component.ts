import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPromise } from '../promise.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PromiseService } from '../promise.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import {
  DateRendererComponent,
  DateTimeRendererComponent,
  NumberRendererComponent,
} from '@app/shared/components/grids/renderers';

import { addGridLabel, combineLatestAnd } from '@app/core/utils';
import { CompleteStatus } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-promise-grid',
  templateUrl: './promise-grid.component.html',
})
export class PromiseGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input() hideToolbar = false;
  @Input() set debtId(debtId: number) {
    this._debtId = debtId;
    this.debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input() set debtStatusCode(debtStatusCode: number) {
    this.debtStatusCode$.next(debtStatusCode);
    this.cdRef.markForCheck();
  }

  private selectedPromise$ = new BehaviorSubject<IPromise>(null);
  private debtId$ = new BehaviorSubject<number>(null);
  private debtStatusCode$ = new BehaviorSubject<number>(null);
  // NOTE: emit true by default, since false means that the user can add another promise
  private hasActivePromise$ = new BehaviorSubject<boolean>(true);
  private _debtId: number;

  readonly canView$ = this.userPermissionsService.has('PROMISE_VIEW');

  readonly canAdd$ = combineLatest(
      this.userPermissionsService.has('PROMISE_ADD'),
      this.userConstantsService.get('Promise.SeveralActive.Use'),
      this.debtStatusCode$,
      this.hasActivePromise$,
    )
    .pipe(
      map(([canAdd, severalActiveValue, debtStatusCode, hasActivePromise ]) => {
        const severalActiveUse = Boolean(severalActiveValue.valueB);
        return canAdd && this._debtId && ![6, 7, 8, 17].includes(debtStatusCode) &&
         (severalActiveUse || (!severalActiveUse && !hasActivePromise));
      }),
      distinctUntilChanged()
    );

  readonly canRefresh$ = combineLatestAnd([ this.canView$, this.debtId$.map(Boolean) ]).distinctUntilChanged();

  readonly canСonfirm$ = this.userPermissionsService.has('PROMISE_CONFIRM');

  readonly canDelete$ = this.userPermissionsService.has('PROMISE_DELETE');

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.OK,
      label: 'debtor.promisesTab.approve.buttonLabel',
      enabled: combineLatestAnd([
        this.canСonfirm$,
        this.selectedPromise$.map(promise => promise && promise.statusCode === 6),
      ]),
      action: () => this.setDialog('approve')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      enabled: combineLatestAnd([
        this.canDelete$,
        this.canСonfirm$,
        this.selectedPromise$.map(promise => promise && promise.statusCode === 6),
      ]),
      action: () => this.setDialog('remove'),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      action: () => this.fetch(),
      enabled: this.canRefresh$
    },
  ];

  columns: ISimpleGridColumn<IPromise>[] = [
    // TODO(d.maltsev): should be just date
    { prop: 'promiseDate', minWidth: 130, maxWidth: 200, renderer: DateRendererComponent },
    { prop: 'promiseAmount', minWidth: 120, maxWidth: 150, renderer: NumberRendererComponent },
    { prop: 'receiveDateTime', minWidth: 130, maxWidth: 150, renderer: DateTimeRendererComponent },
    { prop: 'statusCode', minWidth: 120, dictCode: UserDictionariesService.DICTIONARY_PROMISE_STATUS },
    { prop: 'comment', minWidth: 100 },
    { prop: 'fullName', minWidth: 120 },
    // TODO(atymchuk): the currency should appear in the promiseAmount column header
    // { prop: 'currencyId', hidden: true, lookupKey: 'currencies', },
  ].map(addGridLabel('widgets.promise.grid'));

  rows: IPromise[] = [];

  private dialog: string;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;
  private promiseChangeSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private promiseService: PromiseService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    this.canViewSubscription = combineLatest(this.canView$, this.debtId$)
      .subscribe(([ hasPermission ]) => {
        if (!hasPermission) {
          this.notificationsService.permissionError().entity('entities.promises.gen.plural').dispatch();
          this.clear();
        } else if (this._debtId) {
          this.fetch();
        } else {
          this.clear();
        }
      });

    this.busSubscription = this.promiseService
      .getAction(PromiseService.MESSAGE_PROMISE_SAVED)
      .subscribe(() => this.fetch());
    this.promiseChangeSub = this.contactRegistrationService
      .completeRegistration$
      // tslint:disable-next-line:no-bitwise
      .filter(status => Boolean(status & CompleteStatus.Promise))
      .subscribe(_ => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedPromise$.complete();
    this.hasActivePromise$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.promiseChangeSub.unsubscribe();
  }

  onSelect(promises: IPromise[]): void {
    this.selectedPromise$.next(promises[0]);
  }

  onDoubleClick(promise: IPromise): void {
    const { id: promiseId } = promise || this.selectedPromise$.value;
    if (!this._debtId) { return; }
    const url = this.callCenter
      ? `promise/${this._debtId}/${promiseId}`
      : `debt/promise/${promiseId}`;
    this.routingService.navigate([ url ], this.route);
  }

  onRemove(): void {
    const { id: promiseId } = this.selectedPromise$.value;
    this.promiseService.delete(this._debtId, promiseId, this.callCenter)
      .subscribe(
        () => this.setDialog().fetch(),
        () => this.setDialog()
    );
  }

  onApprove(): void {
    const { id: promiseId } = this.selectedPromise$.value;
    const promise = { isUnconfirmed: 0 } as IPromise;
    this.promiseService.update(this._debtId, promiseId, promise, this.callCenter)
      .subscribe(
        () => this.setDialog().fetch(),
        () => this.setDialog()
    );
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string = null): PromiseGridComponent {
    this.dialog = dialog;
    return this;
  }

  onCancel(): void {
    this.setDialog();
  }

  get debtId(): number {
    return this._debtId;
  }

  private onAdd(): void {
    if (!this._debtId) {
      return;
    }
    this.routingService.navigate([ 'debt/promise/create' ], this.route);
  }

  private fetch(): void {
    if (!this._debtId) { return; }

    this.promiseService.fetchAll(this._debtId, this.callCenter)
      .subscribe(promises => {
        this.rows = [].concat(promises);
        this.selectedPromise$.next(null);
        this.cdRef.markForCheck();
      });

    this.promiseService.getPromiseLimit(this._debtId, this.callCenter)
      .subscribe(({ hasActivePromise }) => {
        this.hasActivePromise$.next(hasActivePromise);
      });
  }

  private clear(): void {
    this.rows = [];
    this.selectedPromise$.next(null);
    this.hasActivePromise$.next(true);
    this.cdRef.markForCheck();
  }
}
