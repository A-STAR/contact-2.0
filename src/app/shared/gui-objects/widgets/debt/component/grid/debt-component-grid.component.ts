import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDebtComponent, IDebtDialog } from '../debt-component.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../components/toolbar-2/toolbar-2.interface';

import { DebtComponentService } from '../debt-component.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../../core/message-bus/message-bus.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-debt-component-grid',
  templateUrl: './debt-component-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtComponentGridComponent implements OnDestroy {
  private debtId = (this.route.params as any).value.debtId || null;

  private selectedDebtComponentId$ = new BehaviorSubject<number>(null);

  private gridSubscription: Subscription;
  private busSubscription: Subscription;

  columns: Array<IGridColumn> = [
    { prop: 'typeCode', minWidth: 150, maxWidth: 200 },
    { prop: 'sum', minWidth: 150, maxWidth: 200 },
    { prop: 'currencyId', minWidth: 150, maxWidth: 200 },
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
      enabled: Observable.combineLatest(
        this.canEditDebtComponent$,
        this.selectedDebtComponentId$
      ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.dialog$.next('delete'),
      enabled: Observable.combineLatest(
        this.canEditDebtComponent$,
        this.selectedDebtComponentId$
      ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canEditDebtComponent$
    },
  ];

  dialog$ = new BehaviorSubject<IDebtDialog>(null);

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtComponentService: DebtComponentService,
    private gridService: GridService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_DEBT_COMPONENTS),
      this.lookupService.currencyOptions,
    ).subscribe(([ productTypeOptions, currencyOptions ]) => {
      this.renderers.typeCode = [ ...productTypeOptions ];
      this.renderers.currencyId = [ ...currencyOptions ];
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });

    // TODO(d.maltsev): check permissions
    this.fetch();

    this.busSubscription = this.messageBusService
      .select(DebtComponentService.MESSAGE_DEBT_COMPONENT_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.gridSubscription.unsubscribe();
  }

  get selectedDebtComponent$(): Observable<IDebtComponent> {
    return this.selectedDebtComponentId$
      .map(id => this.components.find(component => component.id === id));
  }

  onSelect(debtComponent: IDebtComponent): void {
    this.selectedDebtComponentId$.next(debtComponent.id);
  }

  onDoubleClick(debtComponent: IDebtComponent): void {
    this.onEdit(debtComponent.id);
  }

  onRemoveSubmit(): void {
    this.debtComponentService.delete(this.debtId, this.selectedDebtComponentId$.value).subscribe(() => {
      this.fetch();
      this.dialog$.next(null);
    });
  }

  onCloseDialog(): void {
    this.dialog$.next(null);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/debt-component/create` ]);
  }

  private onEdit(debtComponentId: number): void {
    this.router.navigate([ `${this.router.url}/debt-component/${debtComponentId}` ]);
  }

  private fetch(): void {
    this.debtComponentService.fetchAll(this.debtId).subscribe(components => {
      this.components = components;
      this.cdRef.markForCheck();
    });
  }

  private get canEditDebtComponent$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_SUM_EDIT');
  }
}
