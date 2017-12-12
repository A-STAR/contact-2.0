import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import { first } from 'rxjs/operators/first';

import { IDebt } from '../../../../../core/app-modules/app-modules.interface';
import { IEmail, IEmailSchedule } from '../email.interface';
import { IGridColumn, IContextMenuItem } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { EmailService } from '../email.service';
import { DebtService } from '../../../../../core/debt/debt.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserConstantsService } from '../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';
import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-email-grid',
  templateUrl: './email-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input() campaignId: number;
  @Input('debt')
  set debt(debt: IDebt) {
    this.debt$.next(debt);
  }
  @Input() entityId: number;
  @Input() entityType = 18;
  @Input() ignorePermissions = false;
  @Input() personRole = 1;

  private selectedEmailId$ = new BehaviorSubject<number>(null);
  private debt$ = new BehaviorSubject<IDebt>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: combineLatestAnd([ this.canEdit$, this.selectedEmail$.map(Boolean) ]),
      action: () => this.onEdit(this.selectedEmailId$.value)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_BLOCK,
      enabled: combineLatestAnd([ this.canBlock$, this.selectedEmail$.map(email => email && !email.isInactive) ]),
      action: () => this.setDialog('block')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_UNBLOCK,
      enabled: combineLatestAnd([ this.canBlock$, this.selectedEmail$.map(email => email && !!email.isInactive) ]),
      action: () => this.setDialog('unblock')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_SMS,
      enabled: this.canSchedule$,
      action: () => this.setDialog('schedule')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([ this.canDelete$, this.selectedEmail$.map(Boolean) ]),
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
      prop: 'email',
      enabled: Observable.of(true)
    },
  ];

  columns: Array<IGridColumn> = [];

  private _emails: Array<any> = [];

  private canViewSubscription: Subscription;
  private busSubscription: Subscription;

  private _columns: Array<IGridColumn> = [
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_EMAIL_TYPE },
    { prop: 'email' },
    { prop: 'isInactive', renderer: 'checkboxRenderer', maxWidth: 90 },
    { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_EMAIL_REASON_FOR_BLOCKING },
    { prop: 'inactiveDateTime', renderer: 'dateTimeRenderer' },
  ];

  dialog: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private emailService: EmailService,
    private debtService: DebtService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private router: Router,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();

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
      .select(EmailService.MESSAGE_EMAIL_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .filter(canView => canView !== undefined)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.emails.gen.plural').dispatch();
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
    return UserDictionariesService.DICTIONARY_EMAIL_REASON_FOR_BLOCKING;
  }

  get emails(): Array<IEmail> {
    return this._emails;
  }

  getRowClass(): any {
    return (email: IEmail) => ({ inactive: !!email.isInactive });
  }

  onDoubleClick(email: IEmail): void {
    this.onEdit(email.id);
  }

  onSelect(email: IEmail): void {
    this.selectedEmailId$.next(email.id);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.emailService
      .block(this.entityType, this.entityId, this.selectedEmailId$.value, code)
      .subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.emailService
      .unblock(this.entityType, this.entityId, this.selectedEmailId$.value)
      .subscribe(() => this.onSubmitSuccess());
  }

  onScheduleDialogSubmit(schedule: IEmailSchedule): void {
    const data = {
      ...schedule,
      // Here '!=' instead of '!==' is correct because `campaignId` can equal 0
      ...(this.campaignId != null ? { campaignId: this.campaignId } : {}),
      personId: this.entityId,
      personRole: this.personRole,
      emailId: this.selectedEmailId$.value
    };
    this.emailService.scheduleEmail(this.debt$.value.id, data).subscribe(() => this.onSubmitSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.emailService
      .delete(this.entityType, this.entityId, this.selectedEmailId$.value)
      .subscribe(() => this.onSubmitSuccess());
  }

  onDialogClose(): void {
    this.setDialog(null);
  }

  get selectedEmail$(): Observable<IEmail> {
    return this.selectedEmailId$.map(id => this._emails.find(email => email.id === id));
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_VIEW').distinctUntilChanged();
  }

  get canViewBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_INACTIVE_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.hasOne([ 'EMAIL_EDIT', 'EMAIL_COMMENT_EDIT' ]).distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_DELETE').distinctUntilChanged();
  }

  get canBlock$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_SET_INACTIVE').distinctUntilChanged();
  }

  get canUnblock$(): Observable<boolean> {
    return this.userPermissionsService.has('EMAIL_SET_ACTIVE').distinctUntilChanged();
  }

  get canSchedule$(): Observable<boolean> {
    return combineLatestAnd([
      this.userConstantsService.get('Email.Use').map(constant => constant && constant.valueB),
      this.userPermissionsService
        .contains('EMAIL_SINGLE_FORM_PERSON_ROLE_LIST', this.personRole)
        .map(hasPermission => hasPermission || this.ignorePermissions),
      this.debt$.map(debt => this.debtService.isDebtActive(debt)),
      this.selectedEmail$.flatMap(email => email
        ? this.userPermissionsService
            .contains('EMAIL_SINGLE_ADDRESS_TYPE_LIST', email.typeCode)
            .map(hasPermission => hasPermission || this.ignorePermissions)
        : Observable.of(false)
      ),
      this.selectedEmail$.map(email => email && !email.isInactive),
    ]);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/email/create` ]);
  }

  private onEdit(emailId: number): void {
    this.router.navigate([ `${this.router.url}/email/${emailId}` ]);
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    // TODO(d.maltsev): persist selection
    this.emailService.fetchAll(this.entityType, this.entityId)
      .subscribe(emails => {
        this._emails = emails;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this._emails = [];
    this.cdRef.markForCheck();
  }
}
