import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { IDebtComponent, IDebtDialog } from '../debt-component.interface';
import { IGridColumn, IRenderer } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { DebtComponentService } from '@app/shared/gui-objects/widgets/debt/component/debt-component.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-debt-component-grid',
  templateUrl: './debt-component-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtComponentGridComponent implements OnDestroy {
  @Input() action: 'edit' = 'edit';
  @Input('debtId') set debtId(debtId: number) {
    this.debtId$.next(debtId);
    this.cdRef.markForCheck();
  }
  @Input() displayToolbar = true;
  @Input() callCenter = false;

  private debtId$ = new BehaviorSubject<number>(null);

  private selectedDebtComponentId$ = new BehaviorSubject<number>(null);

  private gridSubscription: Subscription;
  private fetchSubscription: Subscription;
  private busSubscription: Subscription;

  columns: Array<IGridColumn> = [
    { prop: 'typeCode', minWidth: 150, maxWidth: 200 },
    { prop: 'amount', minWidth: 150, maxWidth: 200 },
    { prop: 'currencyId', minWidth: 150 },
  ];
  components: Array<IDebtComponent> = [];

  private renderers: IRenderer = {
    typeCode: [],
    currencyId: [],
  };

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.canEditDebtComponent$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedDebtComponentId$.value),
      enabled: combineLatest(
        this.canEditDebtComponent$,
        this.selectedDebtComponentId$
      ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialog$.next('delete'),
      enabled: combineLatest(
        this.canEditDebtComponent$,
        this.selectedDebtComponentId$
      ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canViewDebtComponent$
    },
  ];

  dialog$ = new BehaviorSubject<IDebtDialog>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtComponentService: DebtComponentService,
    private gridService: GridService,
    private lookupService: LookupService,
    private notificationsService: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {
    this.gridSubscription = combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DEBT_COMPONENTS),
      this.lookupService.currencyOptions,
    ).subscribe(([ productTypeOptions, currencyOptions ]) => {
      this.renderers.typeCode = [ ...productTypeOptions ];
      this.renderers.currencyId = [ ...currencyOptions ];
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.cdRef.markForCheck();
    });

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
  }

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
    this.fetchSubscription.unsubscribe();
    this.busSubscription.unsubscribe();
  }

  get selectedDebtComponent$(): Observable<IDebtComponent> {
    return this.selectedDebtComponentId$
      .map(id => this.components.find(component => component.id === id));
  }

  onSelect(debtComponent: IDebtComponent): void {
    this.selectedDebtComponentId$.next(debtComponent.id);
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

  private get canViewDebtComponent$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_VIEW');
  }

  private get canEditDebtComponent$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_EDIT');
  }
}
