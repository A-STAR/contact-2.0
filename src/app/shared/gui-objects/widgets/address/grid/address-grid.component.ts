import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { IAddress } from '../address.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { AddressGridService } from './address-grid.service';
import { GridService } from '../../../../components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

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
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedAddress$)
        .map(([ canEdit, address ]) => canEdit && !!address),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedAddress$)
        .map(([ canDelete, address ]) => canDelete && !!address),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_BLOCK,
      enabled: Observable.combineLatest(this.canBlock$, this.selectedAddress$)
        .map(([ canBlock, address ]) => canBlock && !!address && !address.isBlocked),
      action: () => {
        this._dialog = 1;
        this.cdRef.markForCheck();
      }
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: Observable.combineLatest(this.canUnblock$, this.selectedAddress$)
        .map(([ canUnblock, address ]) => canUnblock && !!address && address.isBlocked),
      action: () => { console.log('unblock!') }
    }
  ];

  columns: Array<IGridColumn> = [];

  private _addresses: Array<IAddress> = [];
  private _key: string;

  private gridSubscription: Subscription;

  private renderers: IRenderer = {
    typeCode: []
  };

  private _columns: Array<IGridColumn> = [
    { prop: 'typeCode' },
    { prop: 'fullAddress' },
    { prop: 'statusCode' },
    { prop: 'isResidence' },
    { prop: 'isBlocked' },
    { prop: 'blockReasonCode' },
    { prop: 'blockDateTime' },
    { prop: 'comment' },
  ];

  private _dialog = null;

  constructor(
    private addressGridService: AddressGridService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private injector: Injector,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this._key = this.injector.get('key');

    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_ADDRESS_TYPE),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_ADDRESS_STATUS),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING),
      this.canViewBlock$,
    )
    .subscribe(([ typeCodeOptions, statusCodeOptions, blockReasonCodeOptions, canViewBlock ]) => {
      this.renderers.typeCode = [].concat(typeCodeOptions);
      this.renderers.statusCode = [].concat(statusCodeOptions);
      this.renderers.blockReasonCode = [].concat(blockReasonCodeOptions);
      const columns = this._columns.filter(column => {
        return canViewBlock ? true : [ 'isBlocked', 'blockReasonCode', 'blockDateTime' ].includes(column.prop)
      });
      this.columns = this.gridService.setRenderers(columns, this.renderers);
    });

    this.userDictionariesService.preload([
      UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING,
      UserDictionariesService.DICTIONARY_ADDRESS_STATUS,
      UserDictionariesService.DICTIONARY_ADDRESS_TYPE,
    ]);
  }

  ngOnInit(): void {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
  }

  get addresses(): Array<IAddress> {
    return this._addresses;
  }

  get dialog(): number {
    return this._dialog;
  }

  onDoubleClick(event: any): void {
    //
  }

  onSelect(address: IAddress): void {
    this.selectedAddressId$.next(address.id);
  }

  onBlockDialogSubmit(blockReasonCode: number): void {
    console.log(blockReasonCode);
    this._dialog = null;
  }

  onDialogClose(): void {
    this._dialog = null;
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

  private fetch(): void {
    // TODO(d.maltsev): persist selection
    // TODO(d.maltsev): pass entity type & id
    this.addressGridService.fetch(18, 1)
      .subscribe(addresses => {
        this._addresses = addresses;
        this.cdRef.markForCheck();
      });
  }
}
