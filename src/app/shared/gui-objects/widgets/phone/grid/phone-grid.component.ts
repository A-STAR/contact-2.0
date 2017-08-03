import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

import { IPhone } from '../phone.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { PhoneService } from '../phone.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

@Component({
  selector: 'app-phone-grid',
  templateUrl: './phone-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridComponent implements OnInit, OnDestroy {
  private selectedPhoneId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedPhone$)
        .map(([ canEdit, phone ]) => canEdit && !!phone),
      action: () => this.onEdit(this.selectedPhoneId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_BLOCK,
      enabled: Observable.combineLatest(this.canBlock$, this.selectedPhone$)
        .map(([ canBlock, phone ]) => canBlock && !!phone && !phone.isBlocked),
      action: () => this.setDialog(1)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: Observable.combineLatest(this.canUnblock$, this.selectedPhone$)
        .map(([ canUnblock, phone ]) => canUnblock && !!phone && phone.isBlocked),
      action: () => this.setDialog(2)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.combineLatest(this.canDelete$, this.selectedPhone$)
        .map(([ canDelete, phone ]) => canDelete && !!phone),
      action: () => this.setDialog(3)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [];

  private _phones: Array<any> = [];

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
    { prop: 'phone' },
    { prop: 'statusCode' },
    { prop: 'isBlocked', localized: true },
    { prop: 'blockReasonCode' },
    { prop: 'blockDateTime' },
    { prop: 'comment' },
  ];

  private _dialog = null;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;

  constructor(
    private phoneService: PhoneService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PHONE_STATUS),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING),
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
      UserDictionariesService.DICTIONARY_PHONE_TYPE,
      UserDictionariesService.DICTIONARY_PHONE_STATUS,
      UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING,
    ]);
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .filter(canView => canView !== undefined)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.phones.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  get blockDialogDictionaryId(): number {
    return UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING;
  }

  get phones(): Array<IPhone> {
    return this._phones;
  }

  get dialog(): number {
    return this._dialog;
  }

  getRowClass(): any {
    return (phone: IPhone) => ({ blocked: !!phone.isBlocked });
  }

  onDoubleClick(phone: IPhone): void {
    this.onEdit(phone.id);
  }

  onSelect(phone: IPhone): void {
    this.selectedPhoneId$.next(phone.id);
  }

  onBlockDialogSubmit(blockReasonCode: number): void {
    this.phoneService.block(18, this.id, this.selectedPhoneId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onUnblockDialogSubmit(blockReasonCode: number): void {
    this.phoneService.unblock(18, this.id, this.selectedPhoneId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onRemoveDialogSubmit(): void {
    this.phoneService.delete(18, this.id, this.selectedPhoneId$.value)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
      });
  }

  onDialogClose(): void {
    this.setDialog(null);
  }

  get selectedPhone$(): Observable<IPhone> {
    return this.selectedPhoneId$.map(id => this._phones.find(phone => phone.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_VIEW').distinctUntilChanged();
  }

  get canViewBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_BLOCK_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'PHONE_EDIT', 'PHONE_COMMENT_EDIT' ]).distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_DELETE').distinctUntilChanged();
  }

  get canBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_BLOCK').distinctUntilChanged();
  }

  get canUnblock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_UNBLOCK').distinctUntilChanged();
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/phone/create` ]);
  }

  private onEdit(phoneId: number): void {
    this.router.navigate([ `${this.router.url}/phone/${phoneId}` ]);
  }

  private fetch(): void {
    // TODO(d.maltsev): persist selection
    // TODO(d.maltsev): pass entity type
    this.phoneService.fetchAll(18, this.id)
      .subscribe(phones => {
        this._phones = phones;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this._phones = [];
    this.cdRef.markForCheck();
  }

  private setDialog(dialog: number): void {
    this._dialog = dialog;
    this.cdRef.markForCheck();
  }
}
