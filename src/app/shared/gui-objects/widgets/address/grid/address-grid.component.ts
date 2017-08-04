import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { IAddress } from '../address.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { AddressService } from '../address.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserDictionaries2Service } from '../../../../../core/user/dictionaries/user-dictionaries-2.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

@Component({
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridComponent implements OnInit, OnDestroy {
  private selectedAddressId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
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
        .map(([ canBlock, address ]) => canBlock && !!address && !address.isBlocked),
      action: () => this.setDialog(1)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: Observable.combineLatest(this.canUnblock$, this.selectedAddress$)
        .map(([ canUnblock, address ]) => canUnblock && !!address && address.isBlocked),
      action: () => this.setDialog(2)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedAddress$)
        .map(([ canDelete, address ]) => canDelete && !!address),
      action: () => this.setDialog(3)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [];

  private _addresses: Array<IAddress> = [];

  private gridSubscription: Subscription;
  private canViewSubscription: Subscription;

  private renderers: IRenderer = {
    typeCode: [],
    statusCode: [],
    blockReasonCode: [],
    blockDateTime: ({ blockDateTime }) => this.valueConverterService.ISOToLocalDateTime(blockDateTime) || '',
    isBlocked: ({ isBlocked }) => isBlocked ? 'default.yesNo.Yes' : 'default.yesNo.No',
  };

  private _columns: Array<IGridColumn> = [
    { prop: 'typeCode' },
    { prop: 'fullAddress' },
    { prop: 'statusCode' },
    { prop: 'isResidence' },
    { prop: 'isBlocked', localized: true },
    { prop: 'blockReasonCode' },
    { prop: 'blockDateTime' },
    { prop: 'comment' },
  ];

  private _dialog = null;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionaries2Service,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_ADDRESS_TYPE,
        UserDictionariesService.DICTIONARY_ADDRESS_STATUS,
        UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING,
      ]),
      this.canViewBlock$,
    )
    .subscribe(([ options, canViewBlock ]) => {
      this.renderers = {
        ...this.renderers,
        typeCode: [].concat(options[UserDictionariesService.DICTIONARY_ADDRESS_TYPE]),
        statusCode: [].concat(options[UserDictionariesService.DICTIONARY_ADDRESS_STATUS]),
        blockReasonCode: [].concat(options[UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING]),
      }
      const columns = this._columns.filter(column => {
        return canViewBlock ? true : [ 'isBlocked', 'blockReasonCode', 'blockDateTime' ].includes(column.prop)
      });

      this.columns = this.gridService.setRenderers(columns, this.renderers);
      this.cdRef.markForCheck();
    });
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
    this.gridSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
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

  get dialog(): number {
    return this._dialog;
  }

  getRowClass(): any {
    return (address: IAddress) => ({ blocked: !!address.isBlocked });
  }

  onDoubleClick(address: IAddress): void {
    this.onEdit(address.id);
  }

  onSelect(address: IAddress): void {
    this.selectedAddressId$.next(address.id);
  }

  onBlockDialogSubmit(blockReasonCode: number): void {
    this.addressService.block(18, this.id, this.selectedAddressId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onUnblockDialogSubmit(blockReasonCode: number): void {
    this.addressService.unblock(18, this.id, this.selectedAddressId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onRemoveDialogSubmit(): void {
    this.addressService.delete(18, this.id, this.selectedAddressId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onDialogClose(): void {
    this.setDialog(null);
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

  private fetch(): void {
    // TODO(d.maltsev): persist selection
    // TODO(d.maltsev): pass entity type
    this.addressService.fetchAll(18, this.id)
      .subscribe(addresses => {
        this._addresses = addresses;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this._addresses = [];
    this.cdRef.markForCheck();
  }

  private setDialog(dialog: number): void {
    this._dialog = dialog;
    this.cdRef.markForCheck();
  }
}
