import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { first } from 'rxjs/operators/first';
import { map } from 'rxjs/operators/map';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';

import { IEmail, IEmailSchedule } from '@app/routes/workplaces/core/email/email.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { EmailService } from '@app/routes/workplaces/core/email/email.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { DateTimeRendererComponent, TickRendererComponent } from '@app/shared/components/grids/renderers';

import { DialogFunctions } from '@app/core/dialog';
import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

import { Debt } from '@app/entities';

@Component({
  selector: 'app-email-grid',
  templateUrl: './email-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input() campaignId: number;
  @Input() entityId: number;
  @Input() entityType = 18;
  @Input() ignorePermissions = false;
  @Input() personRole = 1;

  private selectedEmailId: number;

  selectedEmail$ = new BehaviorSubject<IEmail>(null);

  columns: ISimpleGridColumn<IEmail>[] = [];

  /*
  contextMenuOptions: IContextMenuItem[] = [
    {
      simpleActionsNames: [
        'copyField',
        'copyRow'
      ],
      translationKey: 'default.grid.localeText',
      prop: 'email',
      enabled: of(true)
    },
  ];
  */

  readonly debtId = Number(this.route.snapshot.paramMap.get('debtId'));

  private _emails: Array<any> = [];
  private canViewSubscription: Subscription;
  private onSaveSubscription: Subscription;

  private _columns: ISimpleGridColumn<IEmail>[] = [
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_EMAIL_TYPE },
    { prop: 'email' },
    { prop: 'isInactive', renderer: TickRendererComponent, maxWidth: 90 },
    { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_EMAIL_REASON_FOR_BLOCKING },
    { prop: 'inactiveDateTime', renderer: DateTimeRendererComponent },
  ].map(addGridLabel('debtor.information.email.grid'));

  dialog: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
    private repositoryService: RepositoryService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
    private workplacesService: WorkplacesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.canViewBlock$
      .pipe(first())
      .subscribe(canViewBlock => {
        this.columns = this._columns.filter(column => {
          return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop);
        });
        this.cdRef.markForCheck();
      });

    this.onSaveSubscription = this.emailService.onSave$.subscribe(() => this.fetch());

    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.permissionError().entity('entities.emails.gen.plural').dispatch();
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.onSaveSubscription.unsubscribe();
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
    return (email: IEmail) => email.isInactive ? 'inactive' : null;
  }

  onDoubleClick(email: IEmail): void {
    this.onEdit(email.id);
  }

  onSelect(emails: IEmail[]): void {
    const id = isEmpty(emails)
      ? null
      : emails[0].id;
    this.selectedEmailId = id;
    this.selectedEmail$.next(emails[0]);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.emailService
      .block(this.entityType, this.entityId, this.selectedEmailId, code)
      .subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.emailService
      .unblock(this.entityType, this.entityId, this.selectedEmailId)
      .subscribe(() => this.onSubmitSuccess());
  }

  onScheduleDialogSubmit(schedule: IEmailSchedule): void {
    const data = {
      ...schedule,
      // Here '!=' instead of '!==' is correct because `campaignId` can equal 0
      ...(this.campaignId != null ? { campaignId: this.campaignId } : {}),
      personId: this.entityId,
      personRole: this.personRole,
      emailId: this.selectedEmailId
    };
    this.emailService.scheduleEmail(this.debtId, data).subscribe(() => this.onSubmitSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.emailService
      .delete(this.entityType, this.entityId, this.selectedEmailId)
      .subscribe(() => this.onSubmitSuccess());
  }

  readonly canView$: Observable<boolean> = this.userPermissionsService.has('EMAIL_VIEW')
    .pipe(
      distinctUntilChanged()
    );

  readonly canViewBlock$: Observable<boolean> = this.userPermissionsService.has('EMAIL_INACTIVE_VIEW')
    .pipe(
      distinctUntilChanged()
    );

  readonly canAdd$: Observable<boolean> = this.userPermissionsService.has('EMAIL_ADD')
    .pipe(
      distinctUntilChanged()
    );

  readonly canEdit$: Observable<boolean> = this.userPermissionsService.hasOne([ 'EMAIL_EDIT', 'EMAIL_COMMENT_EDIT' ])
    .pipe(
      distinctUntilChanged()
    );

  readonly canDelete$: Observable<boolean> = this.userPermissionsService.has('EMAIL_DELETE')
    .pipe(
      distinctUntilChanged()
    );

  readonly canBlock$: Observable<boolean> = this.userPermissionsService.has('EMAIL_SET_INACTIVE')
    .pipe(
      distinctUntilChanged()
    );

  readonly canUnblock$: Observable<boolean> = this.userPermissionsService.has('EMAIL_SET_ACTIVE')
    .pipe(
      distinctUntilChanged()
    );

  readonly canSchedule$: Observable<boolean> = combineLatestAnd([
      this.userConstantsService.get('Email.Use')
      .pipe(
        map(constant => constant && constant.valueB)
      ),
      this.userPermissionsService
        .contains('EMAIL_SINGLE_FORM_PERSON_ROLE_LIST', this.personRole)
        .pipe(
          map(hasPermission => hasPermission || this.ignorePermissions),
        ),
      this.repositoryService.fetch(Debt, { id: this.debtId }).pipe(
        map(debts => debts[0]),
        map(debt => debt && this.workplacesService.isDebtActive(debt))
      ),
      this.selectedEmail$.flatMap(email => email
        ? this.userPermissionsService
            .contains('EMAIL_SINGLE_ADDRESS_TYPE_LIST', email.typeCode)
            .pipe(
              map(hasPermission => hasPermission || this.ignorePermissions)
            )
        : of(false)
      ),
      this.selectedEmail$.pipe(
        map(email => email && !email.isInactive),
      )
    ]);

  readonly isEmailActive$ = this.selectedEmail$
    .pipe(
      map(email => email && !email.isInactive)
    );

  readonly isEmailInactive$ = this.selectedEmail$
    .pipe(
      map(email => email && !!email.isInactive)
    );

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      enabled: combineLatestAnd([ this.canEdit$, this.selectedEmail$.pipe( map(Boolean) ) ]),
      action: () => this.onEdit(this.selectedEmailId)
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.BLOCK,
      enabled: combineLatestAnd([ this.canBlock$, this.isEmailActive$ ]),
      action: () => this.setDialog('block')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.UNBLOCK,
      enabled: combineLatestAnd([ this.canBlock$, this.isEmailInactive$ ]),
      action: () => this.setDialog('unblock')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EMAIL,
      enabled: this.canSchedule$,
      action: () => this.setDialog('schedule')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      enabled: combineLatestAnd([ this.canDelete$, this.selectedEmail$.pipe(map(Boolean)) ]),
      action: () => this.setDialog('delete')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      enabled: this.canView$,
      action: () => this.fetch()
    },
  ];

  private onAdd(): void {
    this.routingService.navigate([ 'email/create' ], this.route);
  }

  private onEdit(emailId: number): void {
    this.routingService.navigate([ `email/${emailId}` ], this.route);
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    this.emailService.fetchAll(this.entityType, this.entityId)
      .subscribe(emails => {
        this._emails = emails;
        this.selectedEmail$.next(null);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this._emails = [];
    this.cdRef.markForCheck();
  }
}
