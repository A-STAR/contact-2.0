import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ICall } from '@app/core/calls/call.interface';
import { IDebt } from '@app/core/debt/debt.interface';
// import { IGridColumn, IContextMenuItem } from '@app/shared/components/grid/grid.interface';
import { IPhone } from '../phone.interface';
import { ISMSSchedule } from '../phone.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { CallService } from '@app/core/calls/call.service';
import { DebtService } from '@app/core/debt/debt.service';
// import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PhoneService } from '../phone.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-phone-grid',
  templateUrl: './phone-grid.component.html',
})
export class PhoneGridComponent implements OnInit, OnDestroy {
  @Input() campaignId: number;
  @Input() contactType: number;
  @Input('debtId')
  set debtId(debtId: number) {
    this._debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input() callCenter = false;
  @Input() entityType = 18;
  @Input() ignorePermissions = false;
  @Input('personId')
  set personId(personId: number) {
    this._personId$.next(personId);
    this.cdRef.markForCheck();
  }
  @Input() personRole: number;
  @Input() styles: Partial<CSSStyleDeclaration> = { height: '230px' };

  @Output() add = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<IPhone>();
  @Output() edit = new EventEmitter<IPhone>();
  @Output() register = new EventEmitter<IPhone>();
  @Output() select = new EventEmitter<IPhone>();

  private _debtId$ = new BehaviorSubject<number>(null);
  private _personId$ = new BehaviorSubject<number>(null);

  selectedPhoneId$ = new BehaviorSubject<number>(null);

  gridToolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestAnd([this.canAdd$, this._personId$.map(Boolean)]),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([this.canEdit$, this.selectedPhone$.map(Boolean)]),
      action: () => this.onEdit(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_BLOCK,
      enabled: combineLatestAnd([this.canBlock$, this.selectedPhone$.map(phone => phone && !phone.isInactive)]),
      action: () => this.setDialog('block')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: combineLatestAnd([this.canUnblock$, this.selectedPhone$.map(phone => phone && !!phone.isInactive)]),
      action: () => this.setDialog('unblock')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_SMS,
      enabled: this.canSchedule$,
      action: () => this.setDialog('schedule')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REGISTER_CONTACT,
      enabled: this.canRegisterContact$,
      action: () => this.registerContact()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([this.canDelete$, this.selectedPhone$.map(Boolean)]),
      action: () => this.setDialog('delete')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: combineLatestAnd([this.canView$, this._personId$.map(Boolean)]),
      action: () => this.fetch()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_TRANSFER,
      align: 'right',
      enabled: this.canTransferCall$,
      action: () => this.setDialog('operator')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_RESUME,
      align: 'right',
      enabled: this.canRetrieveCall$,
      action: () => this.onRetrieveCall()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_PAUSE,
      align: 'right',
      enabled: this.canHoldCall$,
      action: () => this.onHoldCall()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DROP,
      align: 'right',
      enabled: this.canDropCall$,
      action: () => this.onDropCall()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_CALL,
      align: 'right',
      enabled: this.canMakeCall$,
      action: () => this.onMakeCall()
    },
  ];

  // contextMenuOptions: IContextMenuItem[] = [
  //   {
  //     simpleActionsNames: [
  //       'copyField',
  //       'copyRow'
  //     ],
  //     translationKey: 'default.grid.localeText',
  //     prop: 'phone',
  //     enabled: of(true)
  //   },
  // ];

  columns: ISimpleGridColumn<IPhone>[] = [];

  dialog = null;

  phones: Array<IPhone> = [];

  debt: IDebt;

  private canViewSubscription: Subscription;
  private debtSubscription: Subscription;
  private busSubscription: Subscription;
  private callSubscription: Subscription;

  // private _columns: Array<IGridColumn> = [
  //   { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_TYPE },
  //   { prop: 'phone', renderer: 'phoneRenderer' },
  //   { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
  //   { prop: 'isInactive', maxWidth: 90, renderer: 'checkboxRenderer', type: 'boolean' },
  //   { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING },
  //   { prop: 'inactiveDateTime', renderer: 'dateTimeRenderer' },
  //   { prop: 'comment' },
  // ];

  private _columns: ISimpleGridColumn<IPhone>[] = [
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_TYPE },
    { prop: 'phone' },
    // { prop: 'phone', renderer: 'phoneRenderer' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
    // { prop: 'isInactive', maxWidth: 90, renderer: 'checkboxRenderer', type: 'boolean' },
    { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING },
    // { prop: 'inactiveDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'comment' },
  ].map(addGridLabel('debtor.information.phone.grid'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private callService: CallService,
    private debtService: DebtService,
    // private gridService: GridService,
    private notificationsService: NotificationsService,
    private phoneService: PhoneService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.debtSubscription = this._debtId$
      .flatMap(debtId => debtId ? this.debtService.fetch(null, debtId) : of(null))
      .subscribe(debt => {
        this.debt = debt;
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = combineLatest(this.canView$, this._personId$)
      .subscribe(([ canView, personId ]) => {
        if (!canView) {
          this.notificationsService.permissionError().entity('entities.phones.gen.plural').dispatch();
          this.clear();
        } else if (personId) {
          this.fetch();
        } else {
          this.clear();
        }
      });

    this.canViewBlock$
      .pipe(first())
      .subscribe(canViewBlock => {
        this.columns = this._columns.filter(column => {
          return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop);
        });
        this.cdRef.markForCheck();
      });

    // combineLatest(
    //   this.gridService.setDictionaryRenderers(this._columns),
    //   this.canViewBlock$,
    // )
    // .pipe(first())
    // .subscribe(([ columns, canViewBlock ]) => {
    //   const filteredColumns = columns.filter(column => {
    //     return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop);
    //   });
    //   this.columns = this.gridService.setRenderers(filteredColumns);
    //   this.cdRef.markForCheck();
    // });

    this.busSubscription = this.phoneService
      .getAction(PhoneService.MESSAGE_PHONE_SAVED)
      .subscribe(() => this.fetch());

    this.callSubscription = this.callService.calls$
      .flatMap(() => this.selectedPhoneCall$.pipe(first()))
      .map(call => call && !call.id)
      .flatMap(hasCall => combineLatestAnd([
        of(hasCall),
        this.callService.settings$.map(settings => settings && !!settings.previewShowRegContact),
        this.canRegisterContact$
      ]).pipe(first()))
      .filter(Boolean)
      .subscribe(() => this.registerContact());
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.debtSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
    this.callSubscription.unsubscribe();
  }

  get debtId$(): Observable<number> {
    return this._debtId$;
  }

  get personId$(): Observable<number> {
    return this._personId$;
  }

  get canDisplayGrid(): boolean {
    return this.columns.length > 0;
  }

  get blockDialogDictionaryId(): number {
    return UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING;
  }

  getRowClass(): any {
    return (phone: IPhone) => ({ inactive: !!phone.isInactive });
  }

  onDoubleClick(phone: IPhone): void {
    this.dblClick.emit(phone);
  }

  onSelect(phones: IPhone[]): void {
    const phone = phones[0];
    this.select.emit(phone);
    this.selectedPhoneId$.next(phone.id);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.phoneService.block(this.entityType, this._personId$.value, this.selectedPhoneId$.value, this.callCenter, code)
      .subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.phoneService.unblock(this.entityType, this._personId$.value, this.selectedPhoneId$.value, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onScheduleDialogSubmit(schedule: ISMSSchedule): void {
    const data = {
      ...schedule,
      // Here '!=' instead of '!==' is correct because `campaignId` can equal 0
      ...(this.campaignId != null ? { campaignId: this.campaignId } : {}),
      personId: this._personId$.value,
      personRole: this.personRole,
      phoneId: this.selectedPhoneId$.value
    };
    this.phoneService.scheduleSMS(this._debtId$.value, data).subscribe(() => this.onSubmitSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.phoneService.delete(this.entityType, this._personId$.value, this.selectedPhoneId$.value, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onPhoneOperatorSelect(operatorId: number): void {
    this.selectedPhoneCall$
      .pipe(first())
      .filter(Boolean)
      .subscribe(call => this.callService.transferCall(call.id, operatorId));
  }

  onDialogClose(): void {
    this.setDialog();
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  registerContact(): void {
    this.selectedPhone$
      .pipe(first())
      .subscribe(phone => this.register.emit(phone));
  }

  get selectedPhone$(): Observable<IPhone> {
    return this.selectedPhoneId$.map(id => this.phones.find(phone => phone.id === id));
  }

  get selectedPhoneCall$(): Observable<ICall> {
    return this.selectedPhone$.flatMap(phone => phone
      ? this.callService.findPhoneCall(phone.id)
      : of(null)
    );
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_VIEW')
      .map(hasPermission => hasPermission || this.ignorePermissions);
  }

  get canViewBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_INACTIVE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'PHONE_EDIT', 'PHONE_COMMENT_EDIT' ]);
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_DELETE');
  }

  get canBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_SET_INACTIVE');
  }

  get canUnblock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_SET_ACTIVE');
  }

  get canSchedule$(): Observable<boolean> {
    return this.selectedPhone$.mergeMap(phone => {
      return phone && !phone.isInactive && !phone.stopAutoSms && this.isDebtOpen
        ? combineLatestAnd([
          this.userConstantsService.get('SMS.Use').map(constant => constant.valueB),
          this.userPermissionsService.contains('SMS_SINGLE_PHONE_TYPE_LIST', phone.typeCode),
          this.userPermissionsService.contains('SMS_SINGLE_PHONE_STATUS_LIST', phone.statusCode),
          this.userPermissionsService.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', this.personRole)
            .map(hasPermission => hasPermission || this.ignorePermissions),
        ])
        : of(false);
    });
  }

  get canRegisterContact$(): Observable<boolean> {
    // TODO(d.maltsev): use debtor service
    return combineLatestAnd([
      this.selectedPhone$.map(phone => phone && !phone.isInactive),
      this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 1)
        .map(hasPermission => hasPermission || this.ignorePermissions),
      this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG').map(canRegisterClosed => this.isDebtOpen || canRegisterClosed),
    ]);
  }

  get canMakeCall$(): Observable<boolean> {
    return combineLatestAnd([
      // this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useMakeCall),
      this.selectedPhone$
        .flatMap(phone => combineLatestAnd([
          of(phone && !phone.isInactive),
          this.selectedPhoneCall$.map(call => !call)
        ]))
    ]);
  }

  get canDropCall$(): Observable<boolean> {
    return combineLatestAnd([
      // this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useDropCall),
      this.selectedPhoneCall$.map(Boolean)
    ]);
  }

  get canHoldCall$(): Observable<boolean> {
    return combineLatestAnd([
      // this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useHoldCall),
      this.selectedPhoneCall$.map(call => call && !call.onHold)
    ]);
  }

  get canRetrieveCall$(): Observable<boolean> {
    return combineLatestAnd([
      // this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useRetriveCall),
      this.selectedPhoneCall$.map(call => call && call.onHold)
    ]);
  }

  get canTransferCall$(): Observable<boolean> {
    return combineLatestAnd([
      // this.userPermissionsService.has('PBX_PREVIEW'),
      this.callService.settings$
        .map(settings => settings && !!settings.usePreview && !!settings.useTransferCall),
      this.selectedPhoneCall$.map(Boolean)
    ]);
  }

  private get isDebtOpen(): boolean {
    return this.debt && ![6, 7, 8, 17].includes(this.debt.statusCode);
  }

  private onAdd(): void {
    this.add.emit();
  }

  private onEdit(): void {
    this.selectedPhone$
      .pipe(first())
      .subscribe(phone => this.edit.emit(phone));
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog();
  }

  private onMakeCall(): void {
    this.selectedPhone$
      .pipe(first())
      .subscribe(phone => this.callService.makeCall(phone.id, this._debtId$.value, this._personId$.value, this.personRole));
  }

  private onDropCall(): void {
    this.selectedPhoneCall$
      .pipe(first())
      .filter(Boolean)
      .subscribe(call => this.callService.dropCall(call.id));
  }

  private onHoldCall(): void {
    this.selectedPhoneCall$
      .pipe(first())
      .filter(Boolean)
      .subscribe(call => this.callService.holdCall(call.id));
  }

  private onRetrieveCall(): void {
    this.selectedPhoneCall$
      .pipe(first())
      .filter(Boolean)
      .subscribe(call => this.callService.retrieveCall(call.id));
  }

  private fetch(): void {
    this.phoneService.fetchAll(this.entityType, this._personId$.value, this.callCenter)
      .subscribe(phones => {
        this.phones = phones;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.phones = [];
    this.cdRef.markForCheck();
  }

  private setDialog(dialog: string = null): void {
    this.dialog = dialog;
    this.cdRef.markForCheck();
  }
}
