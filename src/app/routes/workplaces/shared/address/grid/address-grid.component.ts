import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IAddress, IAddressMarkData } from '@app/routes/workplaces/core/address/address.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { AddressService } from '@app/routes/workplaces/core/address/address.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateTimeRendererComponent, TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, combineLatestAnd, combineLatestOr, isEmpty } from '@app/core/utils';
import { Debt } from '@app/entities';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { CompleteStatus } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
})
export class AddressGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input() campaignId: number;
  @Input('debtId')
  set debtId(debtId: number) {
    this._debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input() debtorId: number;
  @Input() ignorePermissions = false;
  @Input() entityType = 18;
  @Input('personId')
  set personId(personId: number) {
    this._personId$.next(personId);
    this.cdRef.markForCheck();
  }

  @Input('personRole')
  set personRole(personRole: number) {
    this._personRole$.next(personRole);
    this.cdRef.markForCheck();
  }

  @Output() add = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<IAddress>();
  @Output() edit = new EventEmitter<IAddress>();
  @Output() register = new EventEmitter<IAddress>();

  private _debtId$ = new BehaviorSubject<number>(null);
  private _personId$ = new BehaviorSubject<number>(null);
  private _personRole$ = new BehaviorSubject<number>(null);

  readonly selectedAddress$ = new BehaviorSubject<IAddress>(null);
  readonly debtId$ = this._debtId$;
  readonly personId$ = this._personId$;

  readonly canView$ = this.userPermissionsService.has('ADDRESS_VIEW')
    .map(hasPermission => hasPermission || this.ignorePermissions);

  readonly canViewBlock$ = this.userPermissionsService.has('ADDRESS_INACTIVE_VIEW');

  readonly canAdd$ = this.userPermissionsService.has('ADDRESS_ADD');

  readonly selectedAddressId$ = this.selectedAddress$.pipe(
    map(address => address ? address.id : null),
  );

  readonly canEdit$ = combineLatestAnd([
    this.userPermissionsService.hasOne([ 'ADDRESS_EDIT', 'ADDRESS_COMMENT_EDIT' ]),
    this.selectedAddress$.map(Boolean),
  ]);

  readonly canDelete$ = combineLatestAnd([
    this.userPermissionsService.has('ADDRESS_DELETE'),
    this.selectedAddress$.map(Boolean),
  ]);

  readonly canBlock$ = combineLatestAnd([
    this.userPermissionsService.has('ADDRESS_SET_INACTIVE'),
    this.selectedAddress$.map(address => address && !address.isInactive),
  ]);

  readonly canUnblock$ = combineLatestAnd([
    this.userPermissionsService.has('ADDRESS_SET_ACTIVE'),
    this.selectedAddress$.map(address => address && !!address.isInactive),
  ]);

  readonly canViewVisitLog$ = combineLatestAnd([
    this.userPermissionsService.has('ADDRESS_VISIT_VIEW')
      .map(hasPermission => hasPermission || this.ignorePermissions),
    this.selectedAddress$.map(Boolean),
  ]);

  readonly canMarkVisit$ = combineLatestAnd([
    this.userPermissionsService.has('ADDRESS_VISIT_ADD')
      .map(hasPermission => hasPermission || this.ignorePermissions),
    this.selectedAddress$.map(address => address && address.statusCode !== 3 && !address.isInactive),
  ]);

  // TODO(d.maltsev): use debtor service
  readonly canRegisterContact$ = combineLatestAnd([
    this.selectedAddress$.map(address => address && !address.isInactive),
    this.userPermissionsService.contains('DEBT_REG_CONTACT_TYPE_LIST', 3)
      .map(hasPermission => hasPermission || this.ignorePermissions),
    this.userPermissionsService.has('DEBT_CLOSE_CONTACT_REG').map(canRegisterClosed => this.isDebtOpen || canRegisterClosed),
  ]);

  readonly canGenerateLetter$ = combineLatestAnd([
    this._personRole$.flatMap(personRole => this.userPermissionsService.contains('LETTER_FORM_PERSON_ROLE_LIST', personRole)),
    this.selectedAddress$.map(address => address && !address.isInactive)
  ]);

  readonly canViewMap$ = combineLatestAnd([
    this.selectedAddress$.map(address => Boolean(address && address.longitude && address.latitude)),
    this.userPermissionsService.has('MAP_ADDRESS_VIEW')
  ]);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: combineLatestAnd([this.canAdd$, this._personId$.map(Boolean)]),
      action: () => this.onAdd(),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      enabled: this.canEdit$,
      action: () => this.onEdit(),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.BLOCK,
      enabled: this.canBlock$,
      action: () => this.setDialog('block')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.UNBLOCK,
      enabled: this.canUnblock$,
      action: () => this.setDialog('unblock')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.VISIT,
      enabled: combineLatestOr([ this.canViewVisitLog$, this.canMarkVisit$ ]),
      children: [
        {
          label: 'widgets.phone.toolbar.visits.view',
          enabled: this.canViewVisitLog$,
          action: () => this.setDialog('visits')
        },
        {
          label: 'widgets.phone.toolbar.visits.mark',
          enabled: this.canMarkVisit$,
          action: () => this.onMarkClick()
        },
      ]
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.MAP,
      enabled: this.canViewMap$,
      action: () => this.setDialog('map')
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
      enabled: this.canDelete$,
      action: () => this.setDialog('delete')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EMAIL,
      label: 'routes.workplaces.shared.address.toolbar.letter',
      enabled: this.canGenerateLetter$,
      action: () => this.setDialog('letterGeneration')
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      enabled: combineLatestAnd([this.canView$, this._personId$.map(Boolean)]),
      action: () => this.fetch()
    },
  ];

  columns: ISimpleGridColumn<IAddress>[] = [];

  private _addresses: IAddress[] = [];

  private canViewSubscription: Subscription;
  private busSubscription: Subscription;
  private debtSubscription: Subscription;
  private contactRegistrationSub: Subscription;

  private debt: Debt;

  private _columns: ISimpleGridColumn<IAddress>[] = [
    { prop: 'typeCode', dictCode:  UserDictionariesService.DICTIONARY_ADDRESS_TYPE },
    { prop: 'fullAddress' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_STATUS },
    { prop: 'isResidence', maxWidth: 90, renderer: TickRendererComponent },
    { prop: 'isInactive', maxWidth: 90, renderer: TickRendererComponent },
    { prop: 'inactiveReasonCode', dictCode: UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING },
    { prop: 'inactiveDateTime', renderer: DateTimeRendererComponent },
    { prop: 'comment' },
  ].map(addGridLabel('debtor.information.address.grid'));

  private dialog: string;

  constructor(
    private addressService: AddressService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private workplacesService: WorkplacesService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.debtSubscription = this._debtId$
      .flatMap(debtId => debtId ? this.workplacesService.fetchDebt(debtId) : of(null))
      .subscribe(debt => {
        this.debt = debt;
        this.cdRef.markForCheck();
      });

    this.canViewBlock$
      .pipe(first())
      .subscribe(canViewBlock => {
        this.columns = this._columns.filter(column => {
          return canViewBlock ? true : ![ 'isInactive', 'inactiveReasonCode', 'inactiveDateTime' ].includes(column.prop);
        });
        this.cdRef.markForCheck();
      });

    this.busSubscription = this.addressService
      .getAction(AddressService.MESSAGE_ADDRESS_SAVED)
      .subscribe(() => this.fetch());

    this.canViewSubscription = combineLatest(this.canView$, this._personId$)
      .subscribe(([ canView, personId ]) => {
        if (!canView) {
          this.notificationsService.permissionError().entity('entities.addresses.gen.plural').dispatch();
          this.clear();
        } else if (personId) {
          this.fetch();
        } else {
          this.clear();
        }
      });

    this.contactRegistrationSub = this.contactRegistrationService
      .completeRegistration$
      // tslint:disable-next-line:no-bitwise
      .filter(status => Boolean(status & CompleteStatus.Address))
      .subscribe(_ => this.fetch());
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
    this.debtSubscription.unsubscribe();
    this.contactRegistrationSub.unsubscribe();
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

  get personRole(): number {
    return this._personRole$.value;
  }

  getRowClass(): any {
    return (address: IAddress) => address.isInactive ? 'inactive' : null;
  }

  onMarkClick(): void {
    this.addressService.check(this._personId$.value, this.selectedAddress$.value.id)
      .subscribe(result => this.setDialog(result ? 'markConfirm' : 'mark'));
  }

  onMarkConfirmDialogSubmit(): void {
    this.setDialog('mark');
  }

  onMarkDialogSubmit(data: IAddressMarkData): void {
    this.addressService.markForVisit(this._personId$.value, this.selectedAddress$.value.id, data, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onDoubleClick(address: IAddress): void {
    this.dblClick.emit(address);
  }

  onSelect(addresses: IAddress[]): void {
    const address = isEmpty(addresses)
      ? null
      : addresses[0];
    this.selectedAddress$.next(address);
  }

  onBlockDialogSubmit(inactiveReasonCode: number | Array<{ value: number }>): void {
    const code = Array.isArray(inactiveReasonCode) ? inactiveReasonCode[0].value : inactiveReasonCode;
    this.addressService.block(this.entityType, this._personId$.value, this.selectedAddress$.value.id, this.callCenter, code)
      .subscribe(() => this.onSubmitSuccess());
  }

  onUnblockDialogSubmit(): void {
    this.addressService.unblock(this.entityType, this._personId$.value, this.selectedAddress$.value.id, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.addressService.delete(this.entityType, this._personId$.value, this.selectedAddress$.value.id, this.callCenter)
      .subscribe(() => this.onSubmitSuccess());
  }

  onCloseDialog(): void {
    this.setDialog(null);
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  registerContact(): void {
    this.selectedAddress$
      .pipe(first())
      .subscribe(address => this.register.emit(address));
  }

  private get isDebtOpen(): boolean {
    return this.debt && ![6, 7, 8, 17].includes(this.debt.statusCode);
  }

  private onAdd(): void {
    this.add.emit();
  }

  private onEdit(): void {
    this.selectedAddress$
      .pipe(first())
      .subscribe(address => this.edit.emit(address));
  }

  private onSubmitSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }

  private fetch(): void {
    this.addressService.fetchAll(this.entityType, this._personId$.value, this.callCenter)
      .subscribe(addresses => {
        this._addresses = addresses;
        this.selectedAddress$.next(null);
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
