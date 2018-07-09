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
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, filter, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { map, switchMap } from 'rxjs/operators';

import { ICall, PBXStateEnum } from '@app/core/calls/call.interface';
import { IPhone, ISMSSchedule } from '@app/routes/workplaces/core/phone/phone.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { CallService } from '@app/core/calls/call.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { PhoneService } from '@app/routes/workplaces/core/phone/phone.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { DateTimeRendererComponent, TickRendererComponent } from '@app/shared/components/grids/renderers';

import { SubscriptionBag } from '@app/core/subscription-bag/subscription-bag';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

import { Debt, Person } from '@app/entities';
import { CompleteStatus } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
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
  @Output() onSelect = new EventEmitter<IPhone>();

  private _debtId$ = new BehaviorSubject<number>(null);
  private _personId$ = new BehaviorSubject<number>(null);

  selectedPhoneId$ = new BehaviorSubject<number>(null);

  columns: ISimpleGridColumn<IPhone>[] = [];

  dialog = null;

  phones$ = new BehaviorSubject<IPhone[]>([]);

  debt: Debt;

  private activeCallPhoneId: number;

  private person: Person;

  private subs = new SubscriptionBag();

  private _columns: ISimpleGridColumn<IPhone>[] = [
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_TYPE, minWidth: 120 },
    { prop: 'phone', /* renderer: 'phonerenderer', */ minWidth: 120 },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_STATUS, minWidth: 150 },
    { prop: 'isInactive', renderer: TickRendererComponent, minWidth: 100, maxWidth: 120 },
    { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_PHONE_REASON_FOR_BLOCKING, minWidth: 150 },
    { prop: 'inactiveDateTime', renderer: DateTimeRendererComponent, minWidth: 150 },
    { prop: 'comment', minWIdth: 200 },
  ].map(addGridLabel('debtor.information.phone.grid'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private callService: CallService,
    private route: ActivatedRoute,
    private contactRegistrationService: ContactRegistrationService,
    private workplacesService: WorkplacesService,
    private notificationsService: NotificationsService,
    private phoneService: PhoneService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    const phonesSub = this._personId$
      .pipe(
        switchMap(personId => this.phoneService.fetchAll(this.entityType, personId, this.callCenter))
      )
      .subscribe(phones => {
        this.phones$.next(phones);
        this.selectedPhoneId$.next(null);
        this.cdRef.markForCheck();
      });

    const debtSubscription = this._debtId$
      .flatMap(debtId => debtId ? this.workplacesService.fetchDebt(debtId) : of(null))
      .subscribe(debt => {
        this.debt = debt;
        this.cdRef.markForCheck();
      });

    const canViewSubscription = combineLatest(this.canView$, this._personId$)
      .subscribe(([ canView, personId ]) => {
        if (!canView) {
          this.notificationsService.permissionError().entity('entities.phones.gen.plural').dispatch();
          this.clear();
        } else if (personId) {
          this.refresh();
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

    const busSubscription = this.phoneService
      .getAction(PhoneService.MESSAGE_PHONE_SAVED)
      .subscribe(() => this.refresh());


    const callSubscription = this.callService.activeCall$
      .filter(Boolean)
      .flatMap(() => this.callService.pbxLineStatus$.map(lineStatus => lineStatus === PBXStateEnum.PBX_DIAL))
      .distinctUntilChanged()
      .filter(Boolean)
      .flatMap(() =>
        combineLatestAnd([
          this.callService.settings$.map(settings => settings && !!settings.previewShowRegContact),
          this.canRegisterContact$
        ])
        .pipe(first())
      )
      .subscribe(() => this.registerContact());

    const activeCallSubscription = this.callService.activeCall$
      .subscribe(call => {
        this.activeCallPhoneId = call && call.phoneId;
        this.phones$.next([ ...this.phones ]);
        this.cdRef.markForCheck();
      });

    const contactDetailsChangeSub = this.contactRegistrationService
      .completeRegistration$
      // tslint:disable-next-line:no-bitwise
      .filter(status => Boolean(status & CompleteStatus.Phone))
      .subscribe(_ => this.refresh());

    this.person$
      .pipe(first())
      .subscribe(person => {
        this.person = person;
        this.cdRef.markForCheck();
      });

    const contactRegisterSub = combineLatest(
      this.route.queryParams,
      this.callService.predictiveCall$,
      this.phones$.filter(phones => !!phones.length),
      this.person$.filter(Boolean),
      this._debtId$.filter(Boolean)
    )
    .pipe(
      filter(([ _, predictiveCall ]) => predictiveCall),
      map(([ params ]) => params),
      distinctUntilChanged()
    )
    .subscribe(params => {
      this.selectedPhoneId$.next(+params.activePhoneId);
      this.registerContact();
      this.cdRef.markForCheck();
    });

      this.subs.add(phonesSub);
      this.subs.add(debtSubscription);
      this.subs.add(canViewSubscription);
      this.subs.add(busSubscription);
      this.subs.add(callSubscription);
      this.subs.add(activeCallSubscription);
      this.subs.add(contactDetailsChangeSub);
      this.subs.add(contactRegisterSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  get phones(): IPhone[] {
    return this.phones$.value;
  }

  getRowClass(): any {
    return (phone: IPhone) => {
      if (phone.isInactive) {
        return 'inactive';
      } else if (this.activeCallPhoneId === phone.id) {
        return 'active';
      }
      return null;
    };
  }

  onDoubleClick(phone: IPhone): void {
    this.dblClick.emit(phone);
  }

  onSelectRow(phones: IPhone[]): void {
    const phone = isEmpty(phones)
      ? null
      : phones[0];
    this.onSelect.emit(phone);
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
    this.callService.transferCall(operatorId);
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

  readonly person$ = this.personId$
    .filter(Boolean)
    .flatMap(personId => this.workplacesService.fetchDebtor(personId));

  readonly selectedPhone$: Observable<IPhone>  = this.selectedPhoneId$.map(id => this.phones.find(phone => phone.id === id));

  readonly selectedPhoneCall$: Observable<ICall> = this.selectedPhone$
    .flatMap(phone => this.callService.activeCall$
      .map(call => phone && call && call.phoneId === phone.id ? call : null)
    );

  readonly canView$: Observable<boolean> = this.userPermissionsService.has('PHONE_VIEW')
    .pipe(
      map(hasPermission => hasPermission || this.ignorePermissions)
    );

  readonly canViewBlock$: Observable<boolean> = this.userPermissionsService.has('PHONE_INACTIVE_VIEW');

  readonly canAdd$: Observable<boolean> = this.userPermissionsService.has('PHONE_ADD');

  readonly canEdit$: Observable<boolean> = this.userPermissionsService.hasOne([ 'PHONE_EDIT', 'PHONE_COMMENT_EDIT' ]);

  readonly canDelete$: Observable<boolean> = this.userPermissionsService.has('PHONE_DELETE');

  readonly canBlock$: Observable<boolean> = this.userPermissionsService.has('PHONE_SET_INACTIVE');

  readonly canUnblock$: Observable<boolean> = this.userPermissionsService.has('PHONE_SET_ACTIVE');

  readonly canSchedule$: Observable<boolean> = this.selectedPhone$
    .mergeMap(phone => {
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

  // TODO(d.maltsev): use debtor service
  readonly canRegisterContact$: Observable<boolean> = combineLatestAnd([
      this.selectedPhone$.map(phone => phone && !phone.isInactive),
      this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 1)
        .map(hasPermission => hasPermission || this.ignorePermissions),
      this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG').map(canRegisterClosed => this.isDebtOpen || canRegisterClosed),
    ]);

  readonly canMakeCall$: Observable<boolean> = combineLatestAnd([
    this.callService.canMakeCall$,
    this.selectedPhone$.map(phone => phone && !phone.isInactive),
    this.selectedPhoneCall$.map(call => !call)
  ]);

  gridToolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: combineLatestAnd([this.canAdd$, this._personId$.map(Boolean)]),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      enabled: combineLatestAnd([this.canEdit$, this.selectedPhone$.map(Boolean)]),
      action: () => this.onEdit(),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.BLOCK,
      enabled: combineLatestAnd([this.canBlock$, this.selectedPhone$.map(phone => phone && !phone.isInactive)]),
      action: () => this.setDialog('block')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.UNBLOCK,
      enabled: combineLatestAnd([this.canUnblock$, this.selectedPhone$.map(phone => phone && !!phone.isInactive)]),
      action: () => this.setDialog('unblock')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.SMS,
      enabled: this.canSchedule$,
      action: () => this.setDialog('schedule')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REGISTER_CONTACT,
      enabled: this.canRegisterContact$,
      action: () => this.registerContact()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      enabled: combineLatestAnd([this.canDelete$, this.selectedPhone$.map(Boolean)]),
      action: () => this.setDialog('delete')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      enabled: combineLatestAnd([this.canView$, this._personId$.map(Boolean)]),
      action: () => this.refresh()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.CALL,
      align: 'right',
      enabled: this.canMakeCall$,
      action: () => this.onMakeCall()
    },
  ];

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
    this.refresh();
    this.setDialog();
  }

  private onMakeCall(): void {
    this.selectedPhone$
      .pipe(first())
      .subscribe(phone => this.callService.makeCall({
        phoneId: phone.id,
        debtId: this._debtId$.value,
        personId: this._personId$.value,
        personRole: this.personRole,
        phone: phone.phone,
        lastName: this.person.lastName,
        firstName: this.person.firstName,
        middleName: this.person.middleName
      }));
  }

  private refresh(): void {
    this.phoneService.refreshPhones(this.entityType, this._personId$.value, this.callCenter);
  }

  private clear(): void {
    this.phones$.next([]);
    this.cdRef.markForCheck();
  }

  private setDialog(dialog: string = null): void {
    this.dialog = dialog;
    this.cdRef.markForCheck();
  }
}
