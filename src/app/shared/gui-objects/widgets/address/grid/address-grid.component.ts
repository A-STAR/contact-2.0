import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { IAddress } from '../address.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { AddressService } from '../address.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridComponent implements OnInit, OnDestroy {
  private selectedAddressId$ = new BehaviorSubject<number>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedAddress$)
        .map(([ canEdit, address ]) => canEdit && !!address),
      action: () => this.onEdit(this.selectedAddressId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_BLOCK,
      enabled: Observable.combineLatest(this.canBlock$, this.selectedAddress$)
        .map(([ canBlock, address ]) => canBlock && !!address && !address.isInactive),
      action: () => this.setDialog('block')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: Observable.combineLatest(this.canUnblock$, this.selectedAddress$)
        .map(([ canUnblock, address ]) => canUnblock && !!address && !!address.isInactive),
      action: () => this.setDialog('unblock')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedAddress$)
        .map(([ canDelete, address ]) => canDelete && !!address),
      action: () => this.setDialog('delete')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [];

  private _addresses: Array<IAddress> = [];

  private canViewSubscription: Subscription;
  private busSubscription: Subscription;

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

  private routeParams = (<any>this.route.params).value;
  private personId = this.routeParams.personId || null;
  private contactId = this.routeParams.contactId || null;

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
  ) {
    // NOTE: on deper routes we should take the contactId
    this.personId = this.contactId || this.personId;

    Observable.combineLatest(
      this.gridService.setDictionaryRenderers(this._columns),
      this.canViewBlock$,
    )
    .take(1)
    .subscribe(([ columns, canViewBlock ]) => {
      const filteredColumns = columns.filter(column => {
        return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop)
      });

      this.columns = this.gridService.setRenderers(filteredColumns);
      this.cdRef.markForCheck();
    });

    this.busSubscription = this.messageBusService
      .select(AddressService.MESSAGE_ADDRESS_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .filter(canView => canView !== undefined)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.addresses.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
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

  onDoubleClick(address: IAddress): void {
    this.onEdit(address.id);
  }

  onSelect(address: IAddress): void {
    this.selectedAddressId$.next(address.id);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.addressService.block(18, this.personId, this.selectedAddressId$.value, code).subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.addressService.unblock(18, this.personId, this.selectedAddressId$.value).subscribe(() => this.onSubmitSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.addressService.delete(18, this.personId, this.selectedAddressId$.value).subscribe(() => this.onSubmitSuccess());
  }

  onCloseDialog(): void {
    this.setDialog(null);
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  get selectedAddress$(): Observable<IAddress> {
    return this.selectedAddressId$.map(id => this._addresses.find(address => address.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_VIEW').distinctUntilChanged();
  }

  get canViewBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_BLOCK_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'ADDRESS_EDIT', 'ADDRESS_COMMENT_EDIT' ]).distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_DELETE').distinctUntilChanged();
  }

  get canBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_BLOCK').distinctUntilChanged();
  }

  get canUnblock$(): Observable<boolean> {
    return this.userPermissionsService.has('ADDRESS_UNBLOCK').distinctUntilChanged();
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/address/create` ]);
  }

  private onEdit(addressId: number): void {
    this.router.navigate([ `${this.router.url}/address/${addressId}` ]);
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    this.addressService.fetchAll(18, this.personId)
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
