import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { IAddress } from '../address.interface';
import { IAddressMarkData } from './mark/mark.interface';
import { IDebt } from '../../debt/debt/debt.interface';
import { IGridColumn, IContextMenuItem } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { AddressService } from '../address.service';
import { ContentTabService } from '../../../../components/content-tabstrip/tab/content-tab.service';
import { DebtService } from '../../debt/debt/debt.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd, combineLatestOr } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridComponent implements OnInit, OnDestroy {
  @Input() action: 'edit';
  @Input() callCenter = false;
  @Input('debtId')
  set debtId(debtId: number) {
    this._debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input() debtorId: number;
  @Input() ignoreDebtRegContactTypeListPermissions = false;
  @Input() ignoreViewPermissions = false;
  @Input() ignoreVisitAddPermissions = false;
  @Input() ignoreVisitViewPermissions = false;
  @Input() entityType = 18;
  @Input('personId')
  set personId(personId: number) {
    this._personId$.next(personId);
    this.cdRef.markForCheck();
  }
  @Input() personRole: number;

  private _debtId$ = new BehaviorSubject<number>(null);
  private _personId$ = new BehaviorSubject<number>(null);

  private _selectedAddressId$ = new BehaviorSubject<number>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: this.canEdit$,
      action: () => this.onEdit(this._selectedAddressId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_BLOCK,
      enabled: this.canBlock$,
      action: () => this.setDialog('block')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: this.canUnblock$,
      action: () => this.setDialog('unblock')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_VISIT,
      enabled: combineLatestOr([ this.canViewVisitLog$, this.canMarkVisit$ ]),
      children: [
        {
          label: 'widgets.phone.toolbar.visits.view',
          enabled: this.canViewVisitLog$,
          action: () => this.setDialog('visits')
        },
        {
          label: 'widgets.phone.toolbar.visits.mark',
          enabled: this.canMarkVisit$,
          action: () => this.onMarkClick()
        },
      ]
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REGISTER_CONTACT,
      enabled: this.canRegisterContact$,
      action: () => this.registerContact()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: this.canDelete$,
      action: () => this.setDialog('delete')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  contextMenuOptions: IContextMenuItem[] = [
    {
      fieldActions: [
        'copyField',
        'copyRow'
      ],
      translationKey: 'default.grid.localeText',
      prop: 'fullAddress',
      enabled: Observable.of(true)
    }
  ];

  columns: Array<IGridColumn> = [];

  private _addresses: Array<IAddress> = [];

  private canViewSubscription: Subscription;
  private busSubscription: Subscription;
  private debtSubscription: Subscription;

  private debt: IDebt;

  private _columns: Array<IGridColumn> = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_ADDRESS_TYPE },
    { prop: 'fullAddress' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_STATUS },
    { prop: 'isResidence', maxWidth: 90, type: 'boolean', renderer: 'checkboxRenderer' },
    { prop: 'isInactive', maxWidth: 90, type: 'boolean', renderer: 'checkboxRenderer' },
    { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING },
    { prop: 'inactiveDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'comment' },
  ];

  private dialog: string;

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtService: DebtService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.debtSubscription = this._debtId$
      .flatMap(debtId => debtId ? this.debtService.fetch(null, debtId) : Observable.of(null))
      .subscribe(debt => {
        this.debt = debt;
        this.cdRef.markForCheck();
      });

      Observable.combineLatest(
        this.gridService.setDictionaryRenderers(this._columns),
        this.canViewBlock$,
      )
      .pipe(first())
      .subscribe(([ columns, canViewBlock ]) => {
        const filteredColumns = columns.filter(column => {
          return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop);
        });
        this.columns = this.gridService.setRenderers(filteredColumns);
        this.cdRef.markForCheck();
      });

    this.busSubscription = this.messageBusService
      .select(AddressService.MESSAGE_ADDRESS_SAVED)
      .subscribe(() => this.fetch());

    this.canViewSubscription = Observable
      .combineLatest(this.canView$, this._personId$)
      .subscribe(([ canView, personId ]) => {
        if (!canView) {
          this.notificationsService.error('errors.default.read.403').entity('entities.addresses.gen.plural').dispatch();
          this.clear();
        } else if (personId) {
          this.fetch();
        } else {
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
  }

  get personId$(): Observable<number> {
    return this._personId$;
  }

  get canDisplayGrid(): boolean {
    return this.columns.length > 0;
  }

  get blockDialogDictionaryId(): number {
    return UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING;
  }

  get addresses(): Array<IAddress> {
    return this._addresses;
  }

  getRowClass(): any {
    return (address: IAddress) => ({ inactive: !!address.isInactive });
  }

  onMarkClick(): void {
    this.addressService.check(this._personId$.value, this._selectedAddressId$.value)
      .subscribe(result => this.setDialog(result ? 'markConfirm' : 'mark'));
  }

  onMarkConfirmDialogSubmit(): void {
    this.setDialog('mark');
  }

  onMarkDialogSubmit(data: IAddressMarkData): void {
    this.addressService.markForVisit(this._personId$.value, this._selectedAddressId$.value, data)
      .subscribe(() => this.onSubmitSuccess());
  }

  onDoubleClick(address: IAddress): void {
    switch (this.action) {
      case 'edit':
        this.onEdit(address.id);
        break;
    }
  }

  onSelect(address: IAddress): void {
    this._selectedAddressId$.next(address.id);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.addressService.block(this.entityType, this._personId$.value, this._selectedAddressId$.value, this.callCenter, code)
      .subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.addressService.unblock(this.entityType, this._personId$.value, this._selectedAddressId$.value, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.addressService.delete(this.entityType, this._personId$.value, this._selectedAddressId$.value, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onCloseDialog(): void {
    this.setDialog(null);
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  registerContact(): void {
    this.selectedAddressId$
      .pipe(first())
      .subscribe(addressId => {
        this.contentTabService.removeTabByPath(`\/workplaces\/contact-registration(.*)`);
        // Contact type 'Visit' = 3
        // See http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=81002516#id-Списоксловарей-code=50.Типконтакта
        const url = `/workplaces/contact-registration/${this._debtId$.value}/3/${addressId}`;
        this.router.navigate([ url ], { queryParams: { personId: this._personId$.value, personRole: this.personRole } });
      });
  }

  get selectedAddressId$(): Observable<number> {
    return this._selectedAddressId$;
  }

  get selectedAddress$(): Observable<IAddress> {
    return this._selectedAddressId$.map(id => this._addresses.find(address => address.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.ignoreViewPermissions
      ? Observable.of(true)
      : this.userPermissionsService.has('ADDRESS_VIEW');
  }

  get canViewBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_INACTIVE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.hasOne([ 'ADDRESS_EDIT', 'ADDRESS_COMMENT_EDIT' ]),
      this.selectedAddress$.map(Boolean),
    ]);
  }

  get canDelete$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('ADDRESS_DELETE'),
      this.selectedAddress$.map(Boolean),
    ]);
  }

  get canBlock$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('ADDRESS_SET_INACTIVE'),
      this.selectedAddress$.map(address => address && !address.isInactive),
    ]);
  }

  get canUnblock$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.has('ADDRESS_SET_ACTIVE'),
      this.selectedAddress$.map(address => address && !!address.isInactive),
    ]);
  }

  get canViewVisitLog$(): Observable<boolean> {
    return combineLatestAnd([
      this.ignoreVisitViewPermissions
        ? Observable.of(true)
        : this.userPermissionsService.has('ADDRESS_VISIT_VIEW'),
      this.selectedAddress$.map(Boolean),
    ]);
  }

  get canMarkVisit$(): Observable<boolean> {
    return combineLatestAnd([
      this.ignoreVisitAddPermissions
        ? Observable.of(true)
        : this.userPermissionsService.has('ADDRESS_VISIT_ADD'),
      this.selectedAddress$.map(address => address && address.statusCode !== 3 && !address.isInactive),
    ]);
  }

  get canRegisterContact$(): Observable<boolean> {
    // TODO(d.maltsev): use debtor service
    return combineLatestAnd([
      this.selectedAddress$.map(address => address && !address.isInactive),
      this.ignoreDebtRegContactTypeListPermissions
        ? Observable.of(true)
        : this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 3),
      this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG').map(canRegisterClosed => this.isDebtOpen || canRegisterClosed),
    ]);
  }

  private get isDebtOpen(): boolean {
    return this.debt && ![6, 7, 8, 17].includes(this.debt.statusCode);
  }

  private onAdd(): void {
    const url = this.callCenter
      ? `${this.router.url}/address/${this._personId$.value}/create`
      : `${this.router.url}/address/create`;
    this.router.navigate([ url ]);
  }

  private onEdit(addressId: number): void {
    const url = this.callCenter
      ? `${this.router.url}/address/${this._personId$.value}/${addressId}`
      : `${this.router.url}/address/${addressId}`;
    this.router.navigate([ url ]);
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    this.addressService.fetchAll(this.entityType, this._personId$.value, this.callCenter)
      .subscribe(addresses => {
        this._addresses = addresses;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this._addresses = [];
    this.cdRef.markForCheck();
  }

  private setDialog(dialog: string): void {
    this.dialog = dialog;
    this.cdRef.markForCheck();
  }
}
