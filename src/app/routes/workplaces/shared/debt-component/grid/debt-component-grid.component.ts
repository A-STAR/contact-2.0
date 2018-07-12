import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';
import { Subscription } from 'rxjs/Subscription';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { CompleteStatus } from '@app/routes/workplaces/shared/contact-registration/contact-registration.interface';
import { IDebtComponent, IDebtDialog } from '../debt-component.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { DebtComponentService } from '../debt-component.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-component-grid',
  templateUrl: './debt-component-grid.component.html',
})
export class DebtComponentGridComponent implements OnDestroy, OnInit {
  @Input() action: 'edit' = 'edit';
  @Input('debtId') set debtId(debtId: number) {
    this.debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input() displayToolbar = true;
  @Input() callCenter = false;

  private debtId$ = new BehaviorSubject<number>(null);

  private selectedDebtComponentId$ = new BehaviorSubject<number>(null);

  private fetchSubscription: Subscription;
  private busSubscription: Subscription;
  private contactRegistrationSub: Subscription;

  columns: ISimpleGridColumn<IDebtComponent>[] = [
    { prop: 'typeCode', minWidth: 150, maxWidth: 200, dictCode: UserDictionariesService.DICTIONARY_DEBT_COMPONENTS },
    { prop: 'amount', minWidth: 150, maxWidth: 200 },
    { prop: 'currencyId', minWidth: 150, lookupKey: 'currencies' },
  ].map(addGridLabel('widgets.debt.component.grid'));

  components: IDebtComponent[] = [];

  readonly canViewDebtComponent$ = this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_VIEW');

  readonly canEditDebtComponent$ = this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_EDIT');

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.onAdd(),
        enabled: this.canEditDebtComponent$
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.onEdit(this.selectedDebtComponentId$.value),
        enabled: combineLatest(
          this.canEditDebtComponent$,
          this.selectedDebtComponentId$
        ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.dialog$.next('delete'),
        enabled: combineLatest(
          this.canEditDebtComponent$,
          this.selectedDebtComponentId$
        ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
        enabled: this.canViewDebtComponent$
      },
    ]
  };

  dialog$ = new BehaviorSubject<IDebtDialog>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtComponentService: DebtComponentService,
    private contactRegistrationService: ContactRegistrationService,
    private notificationsService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {

    this.fetchSubscription = combineLatest(
      this.canViewDebtComponent$,
      this.debtId$,
    )
    .subscribe(([ canView, personId ]) => {
      if (!canView) {
        this.notificationsService.permissionError().entity('entities.debtComponents.gen.plural').dispatch();
        this.clear();
      } else if (personId) {
        this.fetch();
      } else {
        this.clear();
      }
    });

    this.busSubscription = this.debtComponentService
      .getAction(DebtComponentService.MESSAGE_DEBT_COMPONENT_SAVED)
      .subscribe(() => this.fetch());

    this.contactRegistrationSub = this.contactRegistrationService
      .completeRegistration$
      // tslint:disable-next-line:no-bitwise
      .filter(status => Boolean(status & (CompleteStatus.Payment | CompleteStatus.Promise)))
      .subscribe(_ => this.fetch());
  }

  ngOnDestroy(): void {
    this.fetchSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
    this.contactRegistrationSub.unsubscribe();
  }

  readonly selectedDebtComponent$ = this.selectedDebtComponentId$.pipe(
    map(id => this.components.find(component => component.id === id))
  );

  onSelect(debtComponents: IDebtComponent[]): void {
    this.selectedDebtComponentId$.next(debtComponents[0].id);
  }

  onDoubleClick(debtComponent: IDebtComponent): void {
    if (this.action === 'edit') {
      this.onEdit(debtComponent.id);
    }
  }

  onRemoveSubmit(): void {
    this.debtComponentService.delete(this.debtId$.value, this.selectedDebtComponentId$.value)
      .subscribe(() => {
        this.fetch();
        this.dialog$.next(null);
        this.selectedDebtComponentId$.next(null);
      });
  }

  onCloseDialog(): void {
    this.dialog$.next(null);
  }

  private onAdd(): void {
    this.routingService.navigate([ 'debt-component/create' ], this.route);
  }

  private onEdit(debtComponentId: number): void {
    this.router.navigate([ `debt-component/${debtComponentId}` ], {
      relativeTo: this.route,
      queryParams: this.callCenter ? { callCenter: 1 } : {}
    });
  }

  private fetch(): void {
    this.debtComponentService.fetchAll(this.debtId$.value, this.callCenter)
      .subscribe(components => {
        this.components = components;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.components = [];
    this.cdRef.markForCheck();
  }
}
