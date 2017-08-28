import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPromise } from '../promise.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PromiseService } from '../promise.service';
import { GridService } from '../../../../components/grid/grid.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-promise-grid',
  templateUrl: './promise-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseGridComponent implements OnInit, OnDestroy {

  private selectedPromise$ = new BehaviorSubject<IPromise>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedPromise$.value.id),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.selectedPromise$
      ).map(([canEdit, selectedPromise]) => !!canEdit && !!selectedPromise)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('remove'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.selectedPromise$
      ).map(([canDelete, selectedPromise]) => !!canDelete && !!selectedPromise),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'promiseDate', maxWidth: 130 },
    { prop: 'promiseSum', maxWidth: 110 },
    { prop: 'receiveDateTime', maxWidth: 130 },
    { prop: 'statusCode' },
    { prop: 'comment' },
    { prop: 'fullName' },
  ];

  rows: Array<IPromise> = [];

  private dialog: string;
  private debtId: number;
  private routeParams = (<any>this.route.params).value;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;
  private debtSubscription: Subscription;
  private gridSubscription: Subscription;

  private renderers: IRenderer = {
    promiseDate: 'dateTimeRenderer',
    promiseSum: 'numberRenderer',
    receiveDateTime: 'dateTimeRenderer',
    statusCode: [],
  };

  gridStyles = this.routeParams.contactId ? { height: '230px' } : { height: '300px' };

  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseService: PromiseService,
    private gridService: GridService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(
        UserDictionariesService.DICTIONARY_WORK_TYPE
      ),
      this.lookupService.currencyOptions,
    )
    .subscribe(([ dictOptions, currencyOptions ]) => {
      this.renderers = {
        ...this.renderers,
        statusCode: [ ...dictOptions ],
        currencyId: [ ...currencyOptions ],
      }
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.cdRef.markForCheck();
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
      .subscribe((id: number) => {
        this.debtId = id;
        this.fetch();
      });

    this.busSubscription = this.messageBusService
      .select(PromiseService.MESSAGE_PROMISE_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedPromise$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.debtSubscription.unsubscribe();
    this.gridSubscription.unsubscribe();
  }

  onDoubleClick(promise: IPromise): void {
    this.onEdit(promise.id);
  }

  onSelect(promise: IPromise): void {
    this.selectedPromise$.next(promise);
  }

  onRemove(): void {
    const { id: promiseId } = this.selectedPromise$.value;
    this.promiseService.delete(this.debtId, promiseId)
      .subscribe(() => {
        this.setDialog(null);
        this.fetch();
      });
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string): void {
    this.dialog = dialog;
  }

  onCancel(): void {
    this.setDialog(null);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/promise/create` ]);
  }

  private onEdit(promiseId: number): void {
    this.router.navigate([ `${this.router.url}/promise/${promiseId}` ]);
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_EDIT').distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PROMISE_DELETE').distinctUntilChanged();
  }

  private fetch(): void {
    if (!this.debtId) { return; }

    this.promiseService.fetchAll(this.debtId)
      .subscribe(promises => {
        this.rows = [].concat(promises);
        this.selectedPromise$.next(null);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.rows = [];
    this.selectedPromise$.next(null);
    this.cdRef.markForCheck();
  }

}
