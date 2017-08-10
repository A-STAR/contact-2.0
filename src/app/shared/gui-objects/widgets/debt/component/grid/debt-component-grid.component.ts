import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDebtComponent } from '../debt-component.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../components/toolbar-2/toolbar-2.interface';

import { DebtComponentService } from '../debt-component.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-debt-component-grid',
  templateUrl: './debt-component-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtComponentGridComponent {
  private debtId = (this.route.params as any).value.debtId || null;

  private selectedDebtComponentId$ = new BehaviorSubject<number>(null);

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
      action: () => null,
      enabled: this.canEditDebtComponent$
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => null,
      enabled: Observable.combineLatest(
        this.canEditDebtComponent$,
        this.selectedDebtComponentId$
      ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => null,
      enabled: Observable.combineLatest(
        this.canEditDebtComponent$,
        this.selectedDebtComponentId$
      ).map(([ hasPermissions, hasSelectedEntity ]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => null,
      enabled: this.canEditDebtComponent$
    },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtComponentService: DebtComponentService,
    private gridService: GridService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PRODUCT_TYPE),
      this.lookupService.currencyOptions,
    ).subscribe(([ productTypeOptions, currencyOptions ]) => {
      this.renderers.typeCode = [ ...productTypeOptions ];
      this.renderers.currencyId = [ ...currencyOptions ];
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });

    this.debtComponentService.fetchAll(this.debtId).subscribe(components => {
      this.components = components;
      this.cdRef.markForCheck();
    });
  }

  onSelect(debtComponent: IDebtComponent): void {
    this.selectedDebtComponentId$.next(debtComponent.id);
  }

  onDoubleClick(debtComponent: IDebtComponent): void {

  }

  private get canEditDebtComponent$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_SUM_EDIT');
  }
}
