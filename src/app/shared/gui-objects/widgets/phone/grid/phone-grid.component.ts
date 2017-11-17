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
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

import { IDebt } from '../../debt/debt/debt.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IPhone } from '../phone.interface';
import { ISMSSchedule } from '../phone.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContentTabService } from '../../../../components/content-tabstrip/tab/content-tab.service';
import { DebtService } from '../../debt/debt/debt.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { PhoneService } from '../phone.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-phone-grid',
  templateUrl: './phone-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridComponent implements OnInit, OnDestroy {
  @Input() action: 'edit';
  @Input() contactType: number;
  @Input('debtId')
  set debtId(debtId: number) {
    this.debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input() callCenter = false;
  @Input() entityType = 18;
  @Input('personId')
  set personId(personId: number) {
    this.personId$.next(personId);
    this.cdRef.markForCheck();
  }
  @Input() personRole: number;
  @Input() styles: Partial<CSSStyleDeclaration> = { height: '230px' };

  @Output() select = new EventEmitter<IPhone>();

  private debtId$ = new BehaviorSubject<number>(null);
  private personId$ = new BehaviorSubject<number>(null);

  selectedPhoneId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([this.canEdit$, this.selectedPhone$.map(Boolean)]),
      action: () => this.onEdit(this.selectedPhoneId$.value)
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
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  columns: Array<IGridColumn> = [];

  dialog = null;

  phones: Array<IPhone> = [];

  debt: IDebt;

  private canViewSubscription: Subscription;
  private debtSubscription: Subscription;
  private busSubscription: Subscription;

  private _columns: Array<IGridColumn> = [
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_TYPE },
    { prop: 'phone', renderer: 'phoneRenderer' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS },
    { prop: 'isInactive', maxWidth: 90, renderer: 'checkboxRenderer', type: 'boolean' },
    { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING },
    { prop: 'inactiveDateTime', renderer: 'dateTimeRenderer' },
    { prop: 'comment' },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtService: DebtService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private phoneService: PhoneService,
    private router: Router,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.debtSubscription = this.debtId$
      .flatMap(debtId => debtId ? this.debtService.fetch(null, debtId) : Observable.of(null))
      .subscribe(debt => {
        this.debt = debt;
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = Observable
      .combineLatest(this.canView$, this.personId$)
      .subscribe(([ canView, personId ]) => {
        if (!canView) {
          this.notificationsService.error('errors.default.read.403').entity('entities.phones.gen.plural').dispatch();
          this.clear();
        } else if (personId) {
          this.fetch();
        } else {
          this.clear();
        }
      });

    Observable.combineLatest(
      this.gridService.setDictionaryRenderers(this._columns),
      this.canViewBlock$,
    )
    .take(1)
    .subscribe(([ columns, canViewBlock ]) => {
      const filteredColumns = columns.filter(column => {
        return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop);
      });
      this.columns = this.gridService.setRenderers(filteredColumns);
      this.cdRef.markForCheck();
    });

    this.busSubscription = this.messageBusService
      .select(PhoneService.MESSAGE_PHONE_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.debtSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
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
    switch (this.action) {
      case 'edit':
        this.onEdit(phone.id);
        break;
    }
  }

  onSelect(phone: IPhone): void {
    this.select.emit(phone);
    this.selectedPhoneId$.next(phone.id);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.phoneService.block(this.entityType, this.personId$.value, this.selectedPhoneId$.value, this.callCenter, code)
      .subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.phoneService.unblock(this.entityType, this.personId$.value, this.selectedPhoneId$.value, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onScheduleDialogSubmit(schedule: ISMSSchedule): void {
    const data = {
      ...schedule,
      personId: this.personId$.value,
      personRole: this.personRole,
      phoneId: this.selectedPhoneId$.value
    };
    this.phoneService.scheduleSMS(this.debtId$.value, data).subscribe(() => this.onSubmitSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.phoneService.delete(this.entityType, this.personId$.value, this.selectedPhoneId$.value, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onDialogClose(): void {
    this.setDialog();
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  registerContact(): void {
    this.selectedPhoneId$
      .take(1)
      .subscribe(phoneId => {
        this.contentTabService.removeTabByPath(`\/workplaces\/contact-registration(.*)`);
        const url = `/workplaces/contact-registration/${this.debtId$.value}/${this.contactType}/${phoneId}`;
        this.router.navigate([ url ], { queryParams: { personId: this.personId$.value, personRole: this.personRole } });
      });
  }

  get selectedPhone$(): Observable<IPhone> {
    return this.selectedPhoneId$.map(id => this.phones.find(phone => phone.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_VIEW');
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
          this.userPermissionsService.contains('SMS_SINGLE_FORM_PERSON_ROLE_LIST', this.personRole),
        ])
        : Observable.of(false);
    });
  }

  get canRegisterContact$(): Observable<boolean> {
    // TODO(d.maltsev): use debtor service
    return combineLatestAnd([
      this.selectedPhone$.map(phone => phone && !phone.isInactive),
      this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 1),
      this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG').map(canRegisterClosed => this.isDebtOpen || canRegisterClosed),
    ]);
  }

  private get isDebtOpen(): boolean {
    return this.debt && ![6, 7, 8, 17].includes(this.debt.statusCode);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/phone/create` ]);
  }

  private onEdit(phoneId: number): void {
    this.router.navigate([ `${this.router.url}/phone/${phoneId}` ], {
      queryParams: this.callCenter ? { callCenter: 1 } : {}
    });
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog();
  }

  private fetch(): void {
    this.phoneService.fetchAll(this.entityType, this.personId$.value, this.callCenter)
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
