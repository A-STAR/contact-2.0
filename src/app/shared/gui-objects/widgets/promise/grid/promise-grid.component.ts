import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPromise } from '../promise.interface';
import { IDebt } from '../../debt/debt/debt.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PromiseService } from '../promise.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-promise-grid',
  templateUrl: './promise-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseGridComponent implements OnInit, OnDestroy {
  private selectedPromise$ = new BehaviorSubject<IPromise>(null);
  private debt$ = new BehaviorSubject<IDebt>(null);
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
      enabled: Observable.combineLatest(this.canСonfirm$, this.selectedPromise$)
        .map(([ canConfirm, selectedPromise ]) => canConfirm && !!selectedPromise && selectedPromise.statusCode === 6),
      action: () => this.setDialog('approve')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('remove'),
      enabled: Observable.combineLatest(this.canDelete$, this.canСonfirm$, this.selectedPromise$)
        .map(([canDelete, canConfirm, selectedPromise]) =>
          (canDelete && !!selectedPromise) || (canConfirm && !!selectedPromise && selectedPromise.statusCode === 6)),
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
  private debtSubscription: Subscription;

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
    const subscription = this.gridService.setAllRenderers(this.columns)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
        subscription.unsubscribe();
      });
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.promises.gen.plural').dispatch();
          this.clear();
        }
      });

    this.debtSubscription = this.messageBusService
      .select(PromiseService.MESSAGE_DEBT_SELECTED)
      .subscribe((debt: IDebt) => {
        this.debt$.next(debt);
        if (!debt.id) {
          this.clear();
        } else {
          this.fetch();
        }
      });

    this.busSubscription = this.messageBusService
      .select(PromiseService.MESSAGE_PROMISE_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedPromise$.complete();
    this.debt$.complete();
    this.hasActivePromise$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.debtSubscription.unsubscribe();
  }

  onSelect(promise: IPromise): void {
    this.selectedPromise$.next(promise);
  }

  onDoubleClick(promise: IPromise): void {
    const { id: promiseId } = this.selectedPromise$.value;
    const { debtId } = this;
    if (!debtId) { return; }
    this.router.navigate([ `${this.router.url}/debt/${debtId}/promise/${promiseId}` ]);
  }

  onRemove(): void {
    const { id: promiseId } = this.selectedPromise$.value;
    this.promiseService.delete(this.debt$.value.id, promiseId)
      .subscribe(
        () => this.setDialog().fetch(),
        () => this.setDialog()
    );
  }

  onApprove(): void {
    const { id: promiseId } = this.selectedPromise$.value;
    const promise = { isUnconfirmed: 0 } as IPromise;
    this.promiseService.update(this.debt$.value.id, promiseId, promise)
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
    return this.debt$.value && this.debt$.value.id;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return Observable.combineLatest(
      this.userPermissionsService.has('PROMISE_ADD'),
      this.userConstantsService.get('Promise.SeveralActive.Use'),
      this.debt$,
      this.hasActivePromise$,
    )
    .map(([canAdd, severalActiveValue, debt, hasActivePromise ]) => {
      const severalActiveUse = Boolean(severalActiveValue.valueB);
      return canAdd && this.debtId && ![6, 7, 8, 17].includes(debt.statusCode) &&
       (severalActiveUse || (!severalActiveUse && !hasActivePromise));
    })
    .distinctUntilChanged();
  }

  get canRefresh$(): Observable<boolean> {
    return Observable.combineLatest(this.canView$, this.debt$)
      .map(([ canView, debt ]) => canView && !!debt && !!debt.id)
      .distinctUntilChanged();
  }

  get canСonfirm$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_CONFIRM');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_DELETE');
  }

  private onAdd(): void {
    const { debtId } = this;
    if (!debtId) { return; }
    this.router.navigate([ `${this.router.url}/debt/${debtId}/promise/create` ]);
  }

  private fetch(): void {
    const { debtId } = this;
    if (!debtId) { return; }

    this.promiseService.fetchAll(debtId)
      .subscribe(promises => {
        this.rows = [].concat(promises);
        this.selectedPromise$.next(null);
        this.cdRef.markForCheck();
      });

    this.promiseService.getPromiseLimit(debtId)
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
