import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDebtComponent } from '../debt-component.interface';
import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form-control.interface';
import { IGridColumn, IRenderer } from '../../../../../components/grid/grid.interface';
import { ILookupPortfolio } from '../../../../../../core/lookup/lookup.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../components/toolbar-2/toolbar-2.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtComponentService } from '../debt-component.service';
import { GridService } from '../../../../../components/grid/grid.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-component-grid',
  templateUrl: './debt-component-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtComponentGridComponent {
  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;
  private debtId = (this.route.params as any).value.debtId || null;

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
      enabled: this.canEditDebtComponent$,
      // enabled: Observable.combineLatest(
      //   this.userPermissionsService.has('CONST_VALUE_EDIT'),
      //   this.constantsService.state.map(state => !!state.currentConstant)
      // ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => null,
      enabled: this.canEditDebtComponent$,
      // enabled: Observable.combineLatest(
      //   this.userPermissionsService.has('CONST_VALUE_EDIT'),
      //   this.constantsService.state.map(state => !!state.currentConstant)
      // ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => null,
      enabled: this.canEditDebtComponent$,
      // enabled: Observable.combineLatest(
      //   this.userPermissionsService.has('CONST_VALUE_EDIT'),
      //   this.constantsService.state.map(state => !!state.currentConstant)
      // ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => null,
      enabled: this.canEditDebtComponent$,
      // enabled: this.userPermissionsService.has('CONST_VALUE_VIEW')
    },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtComponentService: DebtComponentService,
    private gridService: GridService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
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

  get canEditDebtComponent$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_SUM_EDIT');
  }
}
