import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IPerson } from '../../../../../routes/workplaces/debt-processing/debtor/debtor.interface';
import { IPhone } from '../phone.interface';
import { ISMSSchedule } from '../phone.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { DebtorService } from '../../../../../routes/workplaces/debt-processing/debtor/debtor.service';
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

  person: IPerson;

  private canViewSubscription: Subscription;
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

  private routeParams = (<any>this.route.params).value;
  private personId = this.routeParams.contactId || this.routeParams.personId || null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private phoneService: PhoneService,
    private route: ActivatedRoute,
    private router: Router,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.debtorService.fetch(this.personId),
      this.gridService.setDictionaryRenderers(this._columns),
      this.canViewBlock$,
    )
    .take(1)
    .subscribe(([ person, columns, canViewBlock ]) => {
      this.person = person;
      const filteredColumns = columns.filter(column => {
        return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop)
      });
      this.columns = this.gridService.setRenderers(filteredColumns);
      this.cdRef.markForCheck();
    });

    this.busSubscription = this.messageBusService
      .select(PhoneService.MESSAGE_PHONE_SAVED)
      .subscribe(() => this.fetch());
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
    this.canViewSubscription.unsubscribe();
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
    this.onEdit(phone.id);
  }

  onSelect(phone: IPhone): void {
    this.selectedPhoneId$.next(phone.id);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.phoneService.block(18, this.personId, this.selectedPhoneId$.value, code).subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.phoneService.unblock(18, this.personId, this.selectedPhoneId$.value).subscribe(() => this.onSubmitSuccess());
  }

  onScheduleDialogSubmit(data: Partial<ISMSSchedule>): void {
    console.log(data);
  }

  onRemoveDialogSubmit(): void {
    this.phoneService.delete(18, this.personId, this.selectedPhoneId$.value).subscribe(() => this.onSubmitSuccess());
  }

  onDialogClose(): void {
    this.setDialog();
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  get selectedPhone$(): Observable<IPhone> {
    return this.selectedPhoneId$.map(id => this.phones.find(phone => phone.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_VIEW');
  }

  get canViewBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_BLOCK_VIEW');
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
    return this.userPermissionsService.has('PHONE_BLOCK');
  }

  get canUnblock$(): Observable<boolean> {
    return this.userPermissionsService.has('PHONE_UNBLOCK');
  }

  get canSchedule$(): Observable<boolean> {
    return this.selectedPhone$.mergeMap(phone => {
      return phone && !phone.isInactive && !phone.stopAutoSms
        ? combineLatestAnd([
          this.userConstantsService.get('SMS.Use').map(constant => constant.valueB),
          this.userPermissionsService.contains('SMS_SINGLE_PHONE_TYPE_LIST', phone.typeCode),
          this.userPermissionsService.contains('SMS_SINGLE_PHONE_STATUS_LIST', phone.statusCode)
        ])
        : Observable.of(false);
    });
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/phone/create` ]);
  }

  private onEdit(phoneId: number): void {
    this.router.navigate([ `${this.router.url}/phone/${phoneId}` ]);
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog();
  }

  private fetch(): void {
    this.phoneService.fetchAll(18, this.personId)
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
