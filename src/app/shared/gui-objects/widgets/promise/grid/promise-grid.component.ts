import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPromise } from '../promise.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PromiseService } from '../promise.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-promise-grid',
  templateUrl: './promise-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input('debtId') set debtId(debtId: number) {
    this.debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input('debtStatusCode') set debtStatusCode(debtStatusCode: number) {
    this.debtStatusCode$.next(debtStatusCode);
    this.cdRef.markForCheck();
  }

  private selectedPromise$ = new BehaviorSubject<IPromise>(null);
  private debtId$ = new BehaviorSubject<number>(null);
  private debtStatusCode$ = new BehaviorSubject<number>(null);
  // NOTE: emit true by default, since false means that the user can add another promise
  private hasActivePromise$ = new BehaviorSubject<boolean>(true);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_OK,
      label: 'debtor.promisesTab.approve.buttonLabel',
      enabled: combineLatestAnd([
        this.canСonfirm$,
        this.selectedPromise$.map(promise => promise && promise.statusCode === 6),
      ]),
      action: () => this.setDialog('approve')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([
        this.canDelete$,
        this.canСonfirm$,
        this.selectedPromise$.map(promise => promise && promise.statusCode === 6),
      ]),
      action: () => this.setDialog('remove'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canRefresh$
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'promiseDate', minWidth: 110, maxWidth: 130, renderer: 'dateRenderer' },
    { prop: 'promiseAmount', minWidth: 130, maxWidth: 130, renderer: 'numberRenderer' },
    { prop: 'receiveDateTime', minWidth: 120, maxWidth: 130, renderer: 'dateTimeRenderer' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PROMISE_STATUS },
    { prop: 'comment' },
    { prop: 'fullName' },
    // TODO(atymchuk): the currency should appear in the promiseAmount column header
    // { prop: 'currencyId', hidden: true, lookupKey: 'currencies', },
  ];

  rows: Array<IPromise> = [];

  private dialog: string;
  private routeParams = (<any>this.route.params).value;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;

  gridStyles = this.routeParams.contactId ? { height: '230px' } : { height: '300px' };

  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseService: PromiseService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });
  }

  ngOnInit(): void {
    this.canViewSubscription = Observable.combineLatest(this.canView$, this.debtId$)
      .subscribe(([ hasPermission, debtId ]) => {
        if (!hasPermission) {
          this.notificationsService.error('errors.default.read.403').entity('entities.promises.gen.plural').dispatch();
          this.clear();
        } else if (this.debtId) {
          this.fetch();
        } else {
          this.clear();
        }
      });

    this.busSubscription = this.messageBusService
      .select(PromiseService.MESSAGE_PROMISE_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedPromise$.complete();
    this.hasActivePromise$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  onSelect(promise: IPromise): void {
    this.selectedPromise$.next(promise);
  }

  onDoubleClick(promise: IPromise): void {
    const { id: promiseId } = this.selectedPromise$.value;
    const { debtId } = this;
    if (!debtId) { return; }
    this.router.navigate([ `${this.router.url}/debt/promise/${promiseId}` ]);
  }

  onRemove(): void {
    const { id: promiseId } = this.selectedPromise$.value;
    this.promiseService.delete(this.debtId$.value, promiseId, this.callCenter)
      .subscribe(
        () => this.setDialog().fetch(),
        () => this.setDialog()
    );
  }

  onApprove(): void {
    const { id: promiseId } = this.selectedPromise$.value;
    const promise = { isUnconfirmed: 0 } as IPromise;
    this.promiseService.update(this.debtId$.value, promiseId, promise, this.callCenter)
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
    return this.debtId$.value;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return Observable.combineLatest(
      this.userPermissionsService.has('PROMISE_ADD'),
      this.userConstantsService.get('Promise.SeveralActive.Use'),
      this.debtStatusCode$,
      this.hasActivePromise$,
    )
    .map(([canAdd, severalActiveValue, debtStatusCode, hasActivePromise ]) => {
      const severalActiveUse = Boolean(severalActiveValue.valueB);
      return canAdd && this.debtId && ![6, 7, 8, 17].includes(debtStatusCode) &&
       (severalActiveUse || (!severalActiveUse && !hasActivePromise));
    })
    .distinctUntilChanged();
  }

  get canRefresh$(): Observable<boolean> {
    return combineLatestAnd([ this.canView$, this.debtId$.map(Boolean) ]).distinctUntilChanged();
  }

  get canСonfirm$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_CONFIRM');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_DELETE');
  }

  private onAdd(): void {
    if (!this.debtId) {
      return;
    }
    this.router.navigate([ this.callCenter ? 'promise/create' : 'debt/promise/create' ], {
      queryParams: { callCenter: Number(this.callCenter) },
      relativeTo: this.route,
    });
  }

  private fetch(): void {
    const { debtId } = this;
    if (!debtId) { return; }

    this.promiseService.fetchAll(debtId, this.callCenter)
      .subscribe(promises => {
        this.rows = [].concat(promises);
        this.selectedPromise$.next(null);
        this.cdRef.markForCheck();
      });

    this.promiseService.getPromiseLimit(debtId, this.callCenter)
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
