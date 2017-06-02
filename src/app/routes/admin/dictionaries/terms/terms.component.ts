import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { IDataSource, IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { ITerm } from './terms.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsComponent extends GridEntityComponent<ITerm> implements OnChanges {

  toolbarActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: false, permission: 'DICT_TERM_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'DICT_TERM_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'DICT_TERM_DELETE' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  toolbarActionsMasterGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.ADD
  ];

  toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 100, maxWidth: 150 },
    { prop: 'name', maxWidth: 400 },
    { prop: 'typeCode', localized: true },
    { prop: 'parentCodeName' },
    { prop: 'isClosed' },
  ];

  renderers: IRenderer = {
    typeCode: [
      { label: 'dictionaries.types.system', value: 1 },
      { label: 'dictionaries.types.client', value: 2 }
    ],
    parentCodeName: (term: ITerm) => term.parentCodeName || term.parentCode || '',
    isClosed: (term: ITerm) => term.isClosed ? `<i class="fa fa-check-square-o" aria-hidden="true"></i>` : ''
  };

  dataSource: IDataSource = {
    read: '/api/dictionaries/{code}/terms',
    dataKey: 'terms',
  };

  constructor(
    private gridService: GridService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { masterEntity: master } = changes;
    if (master.currentValue === master.previousValue) {
      return;
    }
    this.grid.load({ code: master.currentValue.code })
      .take(1)
      .subscribe();
  }

  onEditSubmit(data: ITerm, createMode: boolean): void {
    data.typeCode = this.valueConverterService.firstLabeledValue(data.typeCode);
    data.parentCode = this.valueConverterService.firstLabeledValue(data.parentCode);
    data.isClosed = this.valueConverterService.toBooleanNumber(data.isClosed);

    if (createMode) {
      this.gridService.create('/api/dictionaries/{code}/terms', this.masterEntity, data)
        .subscribe(() => this.onSuccess());
    } else {
      const termsId: number = this.selectedEntity.id;
      this.gridService.update(`/api/dictionaries/{code}/terms/${termsId}`, this.masterEntity, data)
        .subscribe(() => this.onSuccess());
    }
  }

  onRemoveSubmit(): void {
    const termsId: number = this.selectedEntity.id;
    this.gridService.delete(`/api/dictionaries/{code}/terms/${termsId}`, this.masterEntity)
      .subscribe(() => this.onSuccess());
  }

  onSuccess(): void {
    this.cancelAction();
    this.afterUpdate();
  }
}
